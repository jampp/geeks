---
layout: post
title:  "How to help your teams to leverage data by using the perfect graphs."
date:   2019-01-03
tag:    technology
categories:
    - data-science
    - technology
    - python
keywords: "python, matplotlib, visualization, jplotlib"
author: gonzalezzfelipe
---

<!--excerpt.start-->

We’ve written posts about retrieving data, and storing and using data. Us and
a lot of other people. These days, it’s all about the data. We process +100 TB
of data per day, feeding a machine-learning algorithm that allows us to drive
incremental sales for app marketers. Data makes the performance marketing world
go round. There is however one point about data that few people in the industry
are talking about…

It has to do with how you present data. How do you share data with others so
that trends and implications can be easily understood by everyone (regardless
  of their analytical savviness).

Oftentimes, we find that key insights get lost in overly-complicated charts
and graphs. Because of that, at Jampp, we created our own
[Matplotlib](https://matplotlib.org/) wrapper: JPlotLib. Now everyone in our
team, can quickly access and use a customized, Jampp branded Python library to
introduce data results with little to no effort. In this post, we include
several examples of data visualization, we hope it’s useful!

<!--excerpt.end-->

Before, with an open source library defaults...
![ open source library default histogram ]({{site.url}}/assets/images/jplotlib/old_histogram.png){: .center-image }

After, with JPlotLib:
![ jplotlib histogram ]({{site.url}}/assets/images/jplotlib/histogram.png){: .center-image }

At this point, you might be wondering:
[_but why?_](https://media.giphy.com/media/1M9fmo1WAFVK0/giphy.gif) There are
libraries that already have what you need. But do they really? We create
tailored data-sets, analyzing user behavior and patterns from millions and
millions of data points and let’s be honest, it’s hard to find ones that
actually offer good and highly customizable data visualizations. What’s more,
some of these have tons of documentation and bugs, which means changing small
details requires a lot of manual labor.

A detailed README with example plots and it’s corresponding code goes a long
way to improve user experience. Below you can find the promised examples with
before and after results.

![ readme screenshot ]({{site.url}}/assets/images/jplotlib/readme.png){: .center-image }

## Extreme-Makeover, Jampp edition

It’s not just how it looks, it’s how you see it, meaning how easily you can
grasp what the graph / chart is trying to show. Improving your plotting tools
can make a huge difference!

### Bar Plot

#### [Before](https://media.giphy.com/media/3oEjHLIKODQJeCtEic/giphy.gif)
![ basic bar plot ]({{site.url}}/assets/images/jplotlib/old_bar.png){: .center-image }

#### [After](https://gph.is/1POdqLV)
![ jplotlib bar plot ]({{site.url}}/assets/images/jplotlib/bar.png){: .center-image }

### Barh Plot

#### [Before](https://gph.is/2q2PjzG)
![ basic barh plot ]({{site.url}}/assets/images/jplotlib/old_barh.png){: .center-image }

#### [After](https://gph.is/1XASFqw)
![ jplotlib barh plot ]({{site.url}}/assets/images/jplotlib/barh.png){: .center-image }

### Scatter Plot

#### [Before](https://media.giphy.com/media/l1J9IcUl8ttRzrQju/giphy.gif)
![ basic scatter plot ]({{site.url}}/assets/images/jplotlib/old_scatter.png){: .center-image }

#### [After](https://gph.is/2d7Vro9)
![ jplotlib barh plot ]({{site.url}}/assets/images/jplotlib/scatter.png){: .center-image }


This wouldn't be complete without some of the house's favorites.
Here are some examples of the `slope` and `Venn` charts developed on the `JPlotLib` package.

### Slope Plot
![ jplotlib slope plot ]({{site.url}}/assets/images/jplotlib/slope.png){: .center-image }

### Venn Diagram
![ jplotlib venn diagram ]({{site.url}}/assets/images/jplotlib/venn.png){: .center-image }


## Bonus Points

You can also preset your brand’s color palette to define color maps.
This ensures a clean and coherent look and your Marketing team will love you.

![ colors ]({{site.url}}/assets/images/jplotlib/colors.png){: .center-image }
![ colormaps ]({{site.url}}/assets/images/jplotlib/colormaps.png){: .center-image }

## Wrapping Up / Keep in Mind

When it comes to data, appearances matter.
[Humans are visual learners](https://thenextweb.com/dd/2014/05/21/importance-visual-content-deliver-effectively/)
so data visualization is a key in helping people understand what the data
actually means.

It’s not just about making it “pretty”, if you are doing it right, chances are
it will look pretty, but the main point is to *make it readable,
understandable.*

Colors aren’t (or shouldn’t be) capricious, use them wisely! Same goes for any
other element you are adding to your chart. Everyone should be able to grasp
what the data is showing, with the least possible amount of effort.
