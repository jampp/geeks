---
layout: post
title: A modern take on mobile fraud detection
date:   2016-08-01
tag: data-science
categories:
 - data-science
keywords: "fraud, mobile, anomaly, detection, unsupervised learning"
description: In this post we discuss the current state of the fight against fraud detection. Current and emerging types of fraud are examined with metrics designed to tackle these forms of invalid traffic.
author: jdemonasterio
---
<!--excerpt.start-->
Jampp's mission is to help companies grow their mobile business by engaging users and driving new customers. Combatting mobile fraud is a top priority to ensure this is possible. Other than spamming, phishing and scamming, ad fraud is one of the most profitable scenarios for rogue internet users.  Mobile frraud forecasts for 2016 are between $1.25bn ([Forensiq][Forensiq]) and $7.2bn ([ANA][ANA]). Yes, you’ve read that correctly: impact is on the order of billions of dollars.

<!--excerpt.end-->

TRASH SENTENCE EXAMPLE FOOTNOTE <sup id="a1">[1](#myfootnote1)</sup>

<h2>What is it and how can it be done? </h2>

The mobile ad business is fairly simple in monetary terms, some people, namely advertisers, pay to place their ads in a site whose owners we will call publishers. There’s a whole lot more players in between and around, but for now we’ll keep it simple. Publishers are the ones offering their advertising space for sale and advertisers are essentially bidding for that space.Most pricing models across the industry are proportional to ad impressions, click volumes and, recently, generated installs.

Technically speaking, clicks or impressions are not exactly what people would commonly think of. It’s just information travelling through servers, consequence of an alleged click or ad load. There is no actual sensor in your device checking if the user has made a touch on the screen or even an ad view. This means that faking them is essentially very easy, one’s device has to tell the advertiser’s server that an action has been triggered. 

Given the rules, costs and benefits of this game, you can imagine why scammers feel so encouraged to do their job.  There you have it, that is mobile fraud. 

<h3>Tell me more:</h3>

<h2>Fraud Categories </h2>

The [Invalid Traffic Detection and Filtration Guidelines Addendum][MRA] made by the MRA and the Mobile Marketing Association (MMA) defines two big categories of fraud according to their technical nature:


- <h3>General</h3> :  "consistent source of non-human traffic". This is covered by mobile bots, traffic from data center, virtual machines and traffic from proxies or VPNs.

-

-

What transformation should we use? There are a number of alternatives and the choice is doubtlessly arbitrary. However, since we strive for statistical consistency, we settled for defining a penalty function that corrects the conversion rates according to the sample size required by a specific width of a 95% binomial proportion confidence interval. Let's break that last sentence down.

Assume we can model conversion scenarios as a binomial random variable with parameter $$p$$. A 95% confidence interval for an estimator of $$p$$, call it $$\hat{p}$$, is given by

$$\left[\hat{p} - 2\sqrt{(0.25/n)}, \hat{p} + 2\sqrt{(0.25/n)}\right]$$

where $$n$$ is the sample size.  Subtracting the lower bound from the upper one, it is easy to see that the width of the interval, call it $$w$$, can be written as

$$w = 4\sqrt{0.25/n}$$

Using the previous equation, we allowed $$w$$ to vary (linearly) stepwise in the range $$[0.01, 0.1]$$ and solved for $$n$$. We then mapped the resulting sample sizes (which for our goal can be interpreted as number of installs) to a number, say $$P$$ for penalty, in the interval $$[0, 1]$$.  The penalty mapping is constructed in such a way that if the number of installs for a given source in a given vertical is tiny (or equivalently the confidence interval is wide) then $$P=0$$ (full penalty). If the volume is huge, (which translates to a narrow confidence interval) then $$P=1$$ (i.e no penalty). In other words, there is a direct relationship between the penalty and the interval width. We finally multiply $$P$$ by the raw conversion rates to get our quality index.

In the next figure, we limited our attention to apps belonging to the classifieds vertical, and displayed the top ten sources in the United States according to the key-event quality index. We have normalized the index by the organic key-event to installs ratio (for the retention-event index we normalize by the highest value). In the image, we also show the number of installs for each source on the right hand axis. It can be seen, for instance, how applying the penalty implies diverging from a volume-centered measurement by comparing source **a** and source **i**. Despite having similar volume, the former is ranked first and the latter ninth.

[//]: # (![Graph 1]({{ site.url }}/assets/images/pqi_blog_post_fig.png){: .center-image })

In this post, we have briefly discussed how we have implemented a quality index that ranks our sources for both user acquisition and retargeting campaigns. We are constantly improving this. For instance, to check the robustness of the engagement index we could compare it to some drop-off based measurement such as the number of people engaged at a given day or the first day a drop-off falls below a certain threshold. We will also further automate this. Currently, we use the handy [xlwings](https://github.com/ZoomerAnalytics/xlwings) library to port our `Pandas` dataframes and `Matplotlib` plots to nicely format Excel spreadsheet reports which can then be easily shared with Google Sheets. Finally, our first empirical tests applying the index show that there is a clear correlation between the quality score and source post-install performance. After some obviously necessary fine-tuning, we might eventually incentivize and reward sources based on this score as [Facebook AOS](https://developers.facebook.com/docs/audience-network/AOS) does (probably by paying a premium to the top source).

If you found this post interesting and want to do stuff like this on a daily basis, join the team at Jampp, [We Are Hiring Geeks!](http://jampp.com/jobs.php)


[ANA]: http://www.ana.net/content/show/id/botfraud-2016
[Forensiq]: https://forensiq.com/mobile-app-fraud-study/
[MRA]: http://mediaratingcouncil.org/101515_IVT%20Addendum%20FINAL%20(Version%201.0).pdf 
<b id="myfootnote1">1</b>: Footnote content example goes here [↩](#a1)