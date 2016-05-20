---
layout: post
title:  ITBA's Big Data Present and Future Conference
date:   2016-05-20
tag: technology
categories:
  - technology
keywords: "data, RTB, architecture, platform"
author: juanpampliega
---

<!--excerpt.start-->
On May 18th, our data team participated in the "Big Data: Present and Future in Argentina" conference organized by the Buenos Aires Institute of Technology ( ITBA). 

Several companies that are currently working with technologies considered as part of the Big Data ecosystem or building their own attended this event.
<!--excerpt.end-->

Juan Echagüe head of the research team at Pragma Consulting gave the first presentation. He started by giving his perspective on the topic of Big Data and the current state of affairs. After that, he gave an overview of some of the project his team worked on during the last couple of years like analysing trip data for the public transit system.  

Guido de Caso and Santiago Pérez from Medallia came next. They talked about how they scaled their in-memory OLAP engine. They run mostly on bare metal and they take advantage of many of the recent hardware trends like SSDs becoming really cheap and networks reaching 40-100 Gbps to horizontally scale their engine without loosing too much performance when data does not fit in a single machine's RAM.

Jorge Brea from Gran Data was the following speaker. His presentation focused on inferring demographics attributes about different populations basing their analysis only on data from mobile phone calls and social media. They are working with Apache Spark to scale their solution.

Gustavo Arjones, CTO and co-founder at Socialmetrix, talked about how his company evolved their data platform for social media analytics. 7 years ago, they started with a single self-hosted machine  that handled crawling, processing, storing and displaying of the data. They have evolved to a point where they are now using over 300 virtual instances in Azure Cloud with technologies like Java, Scala, Spark, Redis, MongoDB and Cassandra mainly.

Next came Andrés Moratti from Flowics. He focused on how they achieve real-time data processing with Kafka, Storm, RabbitMQ and Hadoop to enable new forms of interactions through Social Media with different live events like TV shows, recitals and big sporting events.

Sergio Uassouf from SAS presented their offering of SAS Visual Analytics for doing simple and powerful in-memory Big Data analytics alongside Hadoop. He showed a live demo about doing several common data analytics tasks over a data set of 600 million rows with response times of seconds.

Julián Klas and Adrián Quilis gave the last talk of the day. They have both been working at MercadoLibre for a long time. Julián works building Mercado Libre's own A/B testing platform using Big Data tools like PrestoDB and Adrián works in the Business Intelligence team with Teradata and other warehouse style systems. They described how each platform was built and the reasons for it. It was specially interesting for us to hear how they moved from a Hadoop cluster in their local cloud to running Presto on the AWS Cloud and using S3 as a Source of Truth, since we are also using the set up in a somewhat smaller scale. One thing emphasized during the whole presentation was that, since MercadoLibre is such a big company, they are focused 100% on building tools that will allow access to the data to be  completely self service.

<h2>Our Session</h2>

<h3>Programmatic ad buying: How to build an intelligent and scalable, real-time bidding platform</h3>

![Graph 1]({{ site.url }}/assets/images/big-data-itba2.jpg){: .center-image }

Martín Bonamico and myself were the ones representing Jampp. At the beginning we gave an overview on how the programmatic ads market for mobile works. Later we took the audience through the evolution of Jampp's data platform: from the early beginnings when we only used MySQL and PostgreSQL in a very traditional data architecture, to the last iteration that enables near real-time event processing with Amazon Kinesis and Lambda. You can see our presentation below.

<iframe src="//www.slideshare.net/slideshow/embed_code/key/MSKnvOEoHsUtuz" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/Jampp/building-a-realtime-scalable-and-intelligent-programmatic-ad-buying-platform-62233250" title="Building a real-time, scalable and intelligent programmatic ad buying platform" target="_blank">Building a real-time, scalable and intelligent programmatic ad buying platform</a> </strong> from <strong><a href="//www.slideshare.net/Jampp" target="_blank">Jampp</a></strong> </div>

We had a very positive experience taking part in this event. It showed that the ecosystem of developers dealing with large scale data processing challenges is growing at a steady pace. Although each company uses its own combination of tools and components, we could see some clear patterns emerging:
The move to Public Cloud providers like AWS to outsource infrastructure maintenance work.
The trend towards using tools for SQL over Hadoop like Presto.
The evolution towards a real-time architecture to keep up with the needs of the market.


