---
layout: post
title:  Overview of Jampp's platform
date:   2016-04-01
tag: news
categories:
  - technology
author: juanpampliega
---

<!--excerpt.start-->
Jampp is a mobile app marketing company. Our platform helps mobile app advertisers to acquire and re-engage their users globally. This enables brands to go beyond simple installs and re-targeting clicks, as it optimizes for in-app activity and conversions, thus maximizing lifetime value.

Our intention, in this initial post, is to give a brief overview of the different systems that power our platform. In future posts we will delve deeper into most of the topics covered here and others.
<!--excerpt.end-->

Jampp markets apps by effectively buying programmatic ads. Our platform processes more than 200,000 RTB ad bid requests per second which amounts to about 300 MB/s or 25 TB of data per day. Additionally, Jampp tracks more than 6 billion in-app events (app installs, actions taken inside the app and contextual information used for user segmentation) per month. To effectively deal with this volume of information, we combine different technologies like ZMQ, PostgreSQL, SciPy, Cython and Memcache and especially compact data storage formats that eliminate redundancies.

Jampp’s architecture is composed of four main subsystems that run in the Amazon Web Services (AWS) cloud:
A bidding system that implements the OpenRTB protocol and answers bid requests in less than 100ms.
A tracking system for clicks, installs and in-app events which lets us attribute an install or in-app event to a click on an ad.
An online supervised learning system that improves the bidder’s performance by trying to estimate conversion rates and how to explore the market in an efficient way.
A data processing platform that is constituted by different pub-sub systems with different guarantees that enable consistent sampling of all the data available in real-time and a cluster for scalable data processing.

![Graph 1]({{ site.url }}/assets/images/rtb_callout_diagram.png){: .center-image }

The bidder system receives the bid requests for ad slots and decides whether to make an offer for a slot and the amount to offer.
The bidder relies on two data sources. The first is a database which contains the ad campaigns’ data  configured by the campaign managers through a web application. The second one is a PostgreSQL database which contain aggregated metrics that are used to adjust the pace at which a campaign budget is spent.
The bidding system is composed by a variable amount of processes implemented in Tornado (a Python framework). These processes run on Amazon instances inside an Auto Scaling Group which uses Spot Instances to optimize costs. This AS is located behind an Amazon ELB instance.

![Graph 2]({{ site.url }}/assets/images/jampp_architecture_agranda2.png){: .center-image }

##Caching and pacing

Due to the bidding system’s distributed nature and the need to implement a pacing algorithm to regulate expenditure, some communication exists between the different machines that compose the bidding system.
The actual money spent bidding can be modeled as a random process, due to multiple external factors like the existence of other RTB systems. This problem can be conceptualized in the following formula:

$$E(S) = E(P_v|P_b, R) · P(W|P_b, R)$$

Where $$S$$ represents the estimated money spent every 1000 impression, $$P_v$$ the clearing price, $$P_b$$ the offered price (the bid), $$W$$ winning the auction and $$R$$ represents the contextual information provided during the bid request.
With this expense estimate, we can update the pacing algorithm’s current state, by adjusting the bidding system’s current behaviour according to the expected outcome of each offer and periodically synchronizing with the database to get the actual cost tracked. This way the system can run a stable operation with a low communication overhead with the database.   
To implement the pacing algorithm it needs to consult both databases, and compute metrics and plans (expenditure projections according to the configured parameters). These operations are expensive in terms of computational costs and, due to the strict latency requirements, have to be done in an asynchronous manner. To alleviate this problem we implemented a caching architecture with various levels which is shown in the following diagram:

![Graph 3]({{ site.url }}/assets/images/rtb_caching.png){: .center-image }

The first cache level is located in an in-process data structure which guarantees immediate availability of the most important data. Cache misses on the first level can trigger a promotion from the lower levels or an asynchronous calculation while the bidding system modifies its algorithm to work without the needed value or simply decides not to bid in the auction being processed. Since usually the same user is targeted by more than one ad, we assume that any missed opportunity will probably arise again once the necessary value is loaded in the cache.
Coherence between the different caching levels is kept by communicating the different processes through a pub/sub system implemented with ZMQ. This mechanism enables the different processes to coordinate which values are being calculated so as to avoid duplicate calculations.  Finally, if, for any reason, a value is invalidated or replaced, the lower and sibling cache levels are notified through this channel so they can also invalidate it and avoid split-brain issues.

##Bid computation

To decide whether to bid and how much we use similar metrics derived from machine learning algorithms. 
With metrics like the click through rate and the conversion rate:

$$CT R = P(click\|impression)$$
$$CV R = P(open\|click)$$

We choose a price that, in average, will be profitable:

$$P_b = P_c · R_g \\$$ 
$$CTR = \frac{N_c}{N_i} \\$$ 
$$CVR = \frac{N_o}{N_c} \\$$
$$R_g = CTR o CTR · CVR \\$$

Where $$P_c$$ is the price by objective that the client accepts, $$N_c$$ the amount of clicks in the sample, $$N_i$$ the amount of impressions and $$N_o$$ the amount of opens.
After this, an internal auction between all campaigns whose business rules permit an offer for the current bid request is executed. For each campaign one randomly chosen creative is selected with a distribution that fosters the ones with the best performance.
The winner of the internal auction is chosen randomly with a distribution based on the probability of winning the external auction and on expected profitability. This way, we can avoid starving the campaigns with worse performance which is what would happen if we always chose the ones with the highest expected performance.

##Event tracking and stream

The event tracking and attribution system is divided in two parts. The first one is an application written in Node.js which is horizontally scalable through an Auto Scaling Group and writes the data to a database and different Amazon Kinesis streams.
In front of the Node.js we have an AWS Elastic Load Balancer to distribute the requests between the different instances that are part of the Auto Scaling Group.
The tracking system receives clicks in ads placed by Jampp and registers the data needed to identify this device in the future. Afterwards, if the user continues down the conversion funnel, the system receives an install. Depending the type of campaign that the ad belonged to this install might be a conversion. Finally, the system receives in-app events like making a purchase (e-commerce application) or booking a taxi. These events can belong to devices that installed the app through a Jampp ad (attributed events) or through other channels (organic events).
Attributed events are stored in a database to power dashboards that show the status of each campaign in real-time. These events are also published in different Kinesis streams to be replicated to other systems. Organic events, due to their volume, are only published in Kinesis streams.
The bidding system also generates events like auctions, bids, wins, loses and impressions. Since the volume of these events is orders of magnitude larger than the ones from the tracking platform, we publish them through a PUB/SUB channel using ZMQ. The events are published by a set of processes called Bid Loggers, which are also in charge of filtering, aggregating and sampling the data to persist it in the Postgres database. 
The stream of events from the bidder is designed as PUB/SUB message stream without persistence so the only messages that are actually published are the ones which belong to topics that have actual consumers subscribed. When events are published, they are partitioned by a transaction id that is maintained through the whole chain of events: auction, bid, impression, click, in app event. This permits the consumers to do consistent sampling by subscribing to a particular partition and receiving all the associated events for one transaction. This capability is of vital importance when systems want to analyze the events’ data without being forced to handle 100% of the volume and avoid skewed results.

This was a very brief summary of some aspects of the systems we have in place at Jampp to effectively market apps. 

If you found any part of this interesting and would like to work in a cool company where you can tackle other challenges like this [We Are Hiring Geeks!](http://jampp.com/jobs.php "We Are Hiring Geeks!").

###References:
[http://44jaiio.sadio.org.ar/sites/default/files/agranda14-30.pdf](http://44jaiio.sadio.org.ar/sites/default/files/agranda14-30.pdf)
[http://jampp.pr.co/96504-mobile-app-marketing-platform-jampp-raises-7m-series-a-to-accelerate-growth](http://jampp.pr.co/96504-mobile-app-marketing-platform-jampp-raises-7m-series-a-to-accelerate-growth)


