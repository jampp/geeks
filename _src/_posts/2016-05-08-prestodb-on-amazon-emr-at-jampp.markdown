---
layout: post
title:  PrestoDB on Amazon EMR at Jampp
date:   2016-04-08
tag: data-infrastructure
categories:
  - data-infrastructure
keywords: "Presto, PrestoDB, AmazonEMR, Elastic Map Reduce"
author: juanpampliega
---

<!--excerpt.start-->
At Jampp we are big users of Amazon EMR. Since we handle a lot of data, our volumes keep growing and we have a lot of unstructured log data. Amazon EMR was a great fit for a lot of the use cases we had for analytics and log forensics.
<!--excerpt.end-->

We really like the versatility EMR provides with the apps available like PrestoDB, Spark and  Hive. It doesn’t limit you to one kind of processing since you can do batch, interactive and real-time workloads mixed with some Machine Learning magic. In particular, we found in PrestoDB a great tool that gave us speed and flexibility, and was much more robust than Spark SQL as a SQL tool for large scale analytics. As our use of Presto grew, we even got featured in the Amazon [PrestoDB product page](https://aws.amazon.com/elasticmapreduce/details/presto/).

Our production cluster executes daily ETL tasks and contains a warehouse stored in Parquet backed tables, which is queried by OLAP processes through PrestoDB and Spark. These daily and hourly ETL jobs extract data from different sources like RDS databases and log files, and centralize everything in the EMR Cluster. We found <a href="https://github.com/airbnb/airflow" target="_blank">Airflow from AirBnB</a> to be a great tool for orchestrating these workflows and we will talk more in detail on how and why we use it on a later post.

During this post, we will focus on our experience with Presto and the different customizations we implemented and nuggets of wisdom we learnt along the way.

Using Presto through Amazon EMR’s apps enabled us to get up and running quickly and scale capacity as needed during peak hours. We were also able to quickly analyze the enormous amount of logs that we had been dumping on S3, using tables defined in Hive with regular expressions. Also, we could combine this information with data from relational databases that we had previously imported to the cluster or that was directly in the databases. Over time we tuned a lot of Presto’s configuration files and add monitoring, using a bootstrap action.

One problem we had with EMR 4.x is that bootstrap actions are executed before all the EMR apps like Hadoop, Presto, Spark, etc. are installed. In our case we needed to configure Presto and additional programs after Presto was installed. Because of this we developed a way in the bootstrap script to wait for the Presto process to be installed before continuing with the configurations steps. You can get an idea of how to achieve this in the following thread we answered in the AWS forum:
[https://forums.aws.amazon.com/thread.jspa?threadID=220183&tstart=25](https://forums.aws.amazon.com/thread.jspa?threadID=220183&tstart=25)

Since we moved the cluster to VPC, and one of the databases from which we import data into the cluster is in EC2 classic, we had to add Classic Link between the cluster and the Amazon RDS database. The cluster grows and shrinks during the day, so we created a script that we execute every time a node is bootstrapped. The script adds new nodes to the db’s security group whenever the number of nodes in the cluster is increased. Here is the script in case you need to replicate this behaviour:

{% highlight shell %}
#!/bin/sh

AWS_REGION="--region us-east-1"
AWS_PROFILE=""
AWS_FILTERS="Name=tag:aws:elasticmapreduce:job-flow-id,Values=${EMR_CLUSTER_ID} Name=tag:aws:elasticmapreduce:instance-group-role,Values=TASK"

RDS_SG="${EMR_RDS_SG}"

task_ips=$(aws ec2 describe-instances \
    ${AWS_PROFILE} \
    ${AWS_REGION} \
    --filters ${AWS_FILTERS} |\
  awk '/PublicIpAddress/ { print $2 }' |\
  tr -d '",')

current_ips=$(aws rds describe-db-security-groups \
    ${AWS_PROFILE} \
    ${AWS_REGION} \
    --db-security-group-name ${RDS_SG} |\
  awk '/CIDRIP/ { print gensub("^\"(.*)/32\",?$", "\\1", 1, $2) }'

)

for i in ${task_ips}; do

  [ -n "$(echo ${current_ips} | grep ${i})" ] && continue

  echo "Add ${i}"

  aws rds authorize-db-security-group-ingress \
    ${AWS_REGION} \
    ${AWS_PROFILE} \
    --db-security-group-name ${RDS_SG} \
    --cidrip ${i}/32

done

for i in ${current_ips}; do

  [ -n "$(echo ${task_ips} | grep ${i})" ] && continue

  echo "Revoking ${i}"

  aws rds revoke-db-security-group-ingress \
    ${AWS_REGION} \
    ${AWS_PROFILE} \
    --db-security-group-name ${RDS_SG} \
    --cidrip ${i}/32

done
{% endhighlight %}

As our usage of Presto grew, we developed many ways of improving its performance and stability.

One common issue with Presto is that, when handling a join between two large tables, Presto’s process, in the node that is doing part of the join, might be killed due to **OoM exception**. Since most of the queries we run in Presto are for analytics, it is not a big issue for us if one of the queries fails. But, as Amazon EMR is configured by default, once a Presto process dies, there is no monitor that restarts it. Therefore, when you run many large queries, the nodes available for Presto to process data were decreased over time. To fix this issue, we run a bootstrap action for each node in the cluster that installs and configures [Monit](https://mmonit.com/monit/) to monitor the Presto service in each node.

In the **config.properties** file we added:

{% highlight properties %}
query.max-age=50m #maximum time a query can take
query.client.timeout=40m #maximum time a query can run from a client like presto-cli
{% endhighlight %}

We also found out we needed to do a general increase in the timeouts in the **hive.properties** file:

{% highlight properties %}
hive.s3.connect-timeout=5m
hive.s3.max-backoff-time=10m
hive.s3.max-error-retries=50
hive.metastore-refresh-interval=1m
hive.s3.max-connections=500
hive.s3.max-client-retries=50
connector.name=hive-hadoop2
hive.s3.socket-timeout=5m
...
hive.dfs-timeout=1m
hive.dfs.connect.timeout=2m
hive.metastore-timeout=1m
{% endhighlight %}

One final important alteration to Presto’s config was to change the **jvm.config**. We increased the heap to use at least 60% of the available RAM in the node since Presto would be the most resource-hungry process running on it. Also, we changed the garbage collector to use **G1GC Garbage Collector** rather than the Concurrent Mark Sweep GC which is currently the default. If you want good reference material on why the G1GC is a good option for this kind of applications check [this post](https://databricks.com/blog/2015/05/28/tuning-java-garbage-collection-for-spark-applications.html) from the Databricks Blog.

Other important aspects to consider when tuning Presto to improve its performance are the following useful session properties:
 
 - **hive.force_local_scheduling** forces scans to occur locally where the data resides. In the case of EMR it forces scans to happen in the CORE nodes and avoid the increase in network bandwidth usage that would happen if scans were done in a TASK nodes.
 
 - **hive.parquet_predicate_pushdown_enabled** pretty self explanatory.
 
 - **hive.parquet_optimized_reader_enabled** enable optimized Parquet reader for PrestoDB. This reader is still experimental but we have tried most of the usual queries we use and have not found a differences with the legacy reader. We still only use it in queries where approximate results are acceptable.
 
 - **task_intermediate_aggregation** this option forces intermediate aggregation of results which improves the performance of queries that do aggregations over very large data sets.
 
 - **hash_partition_count** the number of partitions for distributed joins and aggregations. The default for Presto in EMR is 8 which is good for only a small cluster. If you have a cluster with more than 8 nodes that do processing and you are running a query that contains a big join, it is a good idea to set this number to a higher value.

Finally, there were a couple of issues we run into in some of the EMR versions. I will leave the solutions we found here, in case you run into any of them.

The first issue had to do with some problems with Presto’s connection to the Hive Metastore to retrieve table metadata. After some use, the connections were timing out and we found that this was originated by EMR switching to the MariaDB connector. In the link below, you can find a post from the EMR blog detailing this issue and our answer on how to fix it:
[https://forums.aws.amazon.com/thread.jspa?threadID=220302&tstart=25](https://forums.aws.amazon.com/thread.jspa?threadID=220302&tstart=25)

The second issue was that in some EMR versions, the file descriptors and processes limits for the **presto** user is set to the default. We fixed it by adding the file **/etc/security/limits.d/presto.conf** during the node bootstrap script execution, with the following content:

{% highlight shell %}
presto - nofile 32768
presto - nproc  65536
{% endhighlight %}

This brings us to the end of the post. As you might have seen, we did a lot of tuning of Presto which was a result of having this tool running in production for almost a year. Although much has been done, this is still a work in progress. If you find anything mentioned in this post interesting and might want to come work with us at Jampp, [We Are Hiring Geeks!](http://jampp.com/jobs.php)