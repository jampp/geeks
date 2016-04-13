
# How we use Jupyter + Airpal to improve our Data Analytics processes


Being a data driven company, reporting needs are constantly increasing in Jampp. From basic summarizations to complex analysis, every team needs to query our databases. Given this backdrop, a priority for our tech team is to readily provide these reports to non technical areas. Client-sided reports and other frequently used reports can be found on our Dashboard . Initially, this was enough to cover Jampp’s evolving reporting needs But, for some time now, we found ourselves getting more and more report and visualizations requests.

Requests were steadily growing in quantity and complexity. Moreover,  complex analysis tend to be more specific, so a report may be very insightful for a unique area but irrelevant for other areas. For example, the sales team wouldn’t need the same analysis as the operations team, not to mention that some analysis and visualizations might only be useful for a limited time, for a particular project. This meant that the long process it took to productionize dashboards in our UI became increasingly costly, both in terms of tech team resources and delay for the reports availability. 

This became a more important issue as the needs for rapid data analysis increased in the company. So we decided to spend some time investigating alternatives to fix this.

We noticed that our problem could be divided in two parts:

 1. Safely exposing data to every Jampper.
 2. Provide each Jampper the querying and analytics tools it required to effectively use that data and be able to abstract away common tasks.

Each step should, optimally, require a minimal and easy setup for non technical teams. Also, portability across the different platforms had to be taken into consideration.

Our first step was to set up **Airpal from AirBnB** as a frontend client to our PrestoDB cluster (where the more granular analysis are carried out).
As it is explained in Airpal’s GitHub repository:
*“Airpal is a web-based, query execution tool which leverages Facebook's PrestoDB to make authoring queries and retrieving results simple for users. Airpal provides the ability to find tables, see metadata, browse sample rows, write and edit queries, then submit queries all in a web interface. Once queries are running, users can track query progress and when finished, get the results back through the browser as a CSV (download it or share it with friends). The results of a query can be used to generate a new Hive table for subsequent analysis, and Airpal maintains a searchable history of all queries run within the tool.“*

![Graph 1]({{ site.url }}/assets/images/airpal_screenshot.png){: .center-image }


In this context, Airpal adoption was a nice first step. As each Jampper that needs to deal with data receives a basic SQL training, Airpal gave him/her the opportunity to quickly put these abilities into practice. After the initial setup from the tech team, using Airpal is as easy as typing a url, user and password. No matter if a Jampper has Windows, Mac or Linux, everyone can use this client. So this tool helped us improve our working pace, as a lot of queries that previously had to be redirected to the tech team (due to lack of a access to our databases) were now being resolved directly where they originated. That being said,more complex requirements still needed to be resolved by our tech team.

Our next step was introducing Jupyter notebooks to our working schema. As Python is our primary language here at Jampp, IPython notebooks were the natural choice. The first decision we had to make was to define if they would be run locally by each user or in a centralized computer. We went with the first option, as it gave each user the option to modify notebooks anyway that was needed. Also, as some people might know, hosting a Jupyter Notebook in a remote server can create some security problems, since arbitrary Python code can be executed in it, which might enable an attacker to do some nasty things. Using Anaconda made it simple to install IPython in every machine that required it, and base notebooks are kept in a private  GitHub repo that every user clones.

At first, the notebooks’ main use was to serve as templates for queries that non technical users could not write by themselves. Typically, some advanced SQL statement which was parameterized (for the time window being considered, application to look for, etc…). The notebook only exposed a function that received these parameters and printed the statement. Then, the notebook user could modify it  to fit his/her exact needs and run it on Airpal.

Through this process, we learned how to incorporate these two particular tools. Moreover, most of our improvement came from the fact that, with proper tech-sided inception, reporting tools do not need to be just point and click. We enabled analysts to run free formed queries which reduce the constraints they have and accelerate the process, since almost no setup is needed for them to use these tools and the new data available through them. In the end, the new process improved meant much more independence for people that work with data at Jampp.