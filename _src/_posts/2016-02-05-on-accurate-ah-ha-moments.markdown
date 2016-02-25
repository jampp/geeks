---
layout: post
title:  On accurate ‘Ah-Ha’ moments
date:   2016-02-05
tag: news
categories:
  - infrastructure
  - python
author: juanpampliega
---

<!--excerpt.start-->
An ‘Ah-Ha’ moment is a widespread concept in the mobile applications industry: it is an action or sequence of actions that, once taken, reveal the usefulness of an application to an user. Needless to say, a good mobile marketing strategy places an important role on users reaching the application’s ‘Ah-Ha’ moment, since it increases considerably the chances of them getting engaged and monetized. In Jampp, from the very inception of an application’s re-targeting campaign, our analytics team focus on finding its ‘Ah-Ha’ moment, so that proper user segmentation can be made, and an appropriate message delivered to different audiences.
<!--excerpt.end-->

Given the importance an ‘Ah-Ha’ moment will have on the success of a retargeting campaign, we at Jampp developed a framework that leverages on our knowledge of typical applications of a given vertical as well as user behaviour specific for every application. We focus on an ‘Ah-Ha’ moment weighted accuracy, which considers both the moment’s “conversion-accuracy” and “not-missing-accuracy”, as described below.

“Conversion-accuracy” takes into consideration how well an ‘Ah-Ha’ moment occurrence will tell us that an user will be monetized. Not less important, “not-missing-accuracy” tells us how well correlated are users who fail to reach an ‘Ah-Ha’ moment with the absence of monetization. This two sided nature of classification is quite often forgotten, which may lead to over or under-specification of user segments. That is, you might end up with either too narrow segments which contain mostly good users, but also miss a lot of them. Or vice-versa, too broad segments which include almost all the good users, but also include many bad ones.

Let’s talk about these accuracy measures using a real world example from our analysis of booking applications vertical. A preliminary analysis showed us that content-view within a week was a good candidate to constitute our ‘Ah-Ha’ moment. But, how many views make an ‘Ah-Ha’ moment? As stated, we considered weighted accuracy as a way to determine it. So, for any views threshold we built this table:

|						| Monetized		 | Monetized	 |
| --------------------- |:--------------:|:-------------:|
| Views < Threshold		| 27409			 | 249			 |
| Views >= Threshold	| 12612			 | 1857			 |


It is clear that, the better the ‘Ah-Ha’ moment, more people will be allocated in the upper-left and bottom-right corners of the table. Let us call them true-negatives and true-positives respectively. “Conversion-Accuracy”, thus, can be defined as the ratio between true-positives and the total number of monetized users; and, by the same token, “Not-Missing-Accuracy”  is the ratio between true-negatives and the total number of not-monetized users. Getting a 100% “Conversion Accuracy” is easy: set the threshold at 0 and every monetized user will be spotted by this criteria… as well as anyone else (we have just created a too broad segment). “Conversion Accuracy” is 100%, but “Not-Missing Accuracy” is 0% (as no one is below the threshold). As the threshold goes up,  “Conversion-Accuracy” falls and “Not-Missing” accuracy goes up. On the other side of the spectrum, when the threshold is very high, everyone is below it, so “Not-Missing” accuracy is 100%, but “Conversion” accuracy is 0%. This relationship can be seen in the figure below:

![Graph 1]({{ site.url }}/assets/images/ahha-graph1.jpg){: .center-image }

From a business perspective, both accuracies do not have the same value, an ‘Ah-Ha’ moment with excellent “Conversion Accuracy” might spot a segment with a very high conversion rate within itself, but still miss people who convert outside it. As reaching every good user usually overweights the cost of showing publicity to some bad ones, when constructing our overall accuracy index we give a higher weight to “Not-Missing-Accuracy”. Then, our accuracy index is a weighted average of them. The ‘Ah-Ha’ moment is the threshold which maximizes this index; that is, the most accurate.

![Graph 2]({{ site.url }}/assets/images/ahha-graph2.jpg){: .center-image }

So, finishing our example, using data from several apps belonging to the booking vertical we found that, in this case, a three views within a week threshold was the most accurate ‘Ah-Ha’ moment when segmenting users from this kind of application. If this segmentation is used, conversion lift between users who experienced the ‘Ah-Ha’ moment and those who didn’t is over 10 times. And, if measured against average users, conversion rate is three time higher for people who went through the ‘Ah-Ha’ moment.

As concluding remarks, we at Jampp found that accurate ‘Ah-Ha’ moments are key to develop a well performing re-targeting campaign.  It allows to segment valuable users from the rest, putting different strategies for these audiences. At the same time, it serves as a goal for people who hadn’t converted yet, as pushing them through the ‘Ah-Ha’ moment is a way of letting them know what the app can actually provide,encouraging them to a more valuable use of it.
