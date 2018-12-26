---
layout: post
title:  "How to help your teams to leverage data by using the perfect graphs."
date:   2018-12-19
tag:    technology
categories:
    - data-science
    - technology
    - python
keywords: "python, matplotlib, visualization, jplotlib"
author: gonzalezzfelipe
---

<!--excerpt.start-->

In these times, it's all about Data..

... BUT, it’s not only about having your data available in a clean and easy
data-set and feeding a machine learning algorithm, it's also about sharing it
so other people (with more or less technical knowledge than you) can understand
the trends without much explanation or even better, without feeling
overwhelmed by an overly-complicated chart that makes them give up before
they even try.

Because of that, at Jampp, we created our own [Matplotlib](https://matplotlib.org/)
wrapper, JPlotLib. Now everyone can use an already customized, Jampp branded
and easy to go Python library to introduce data results with little to no effort.

<!--excerpt.end-->

Before, with an open source library defaults...
![ open source library default histogram ]({{site.url}}/assets/images/jplotlib/old_histogram.png){: .center-image }

After, with JPlotLib:
![ jplotlib histogram ]({{site.url}}/assets/images/jplotlib/histogram.png){: .center-image }

You might be thinking: [_but why?_](https://media.giphy.com/media/1M9fmo1WAFVK0/giphy.gif)
There are libraries that already have what you need. But that is just not true.
We create and analyze tailored data-sets, user behavior and patterns from
millions and millions of data points and let’s be honest, almost none of the
default styles from out-of-the-shelve libraries are the best ones to produce good
visualizations. Some of these have tons of documentation and bugs, so
changing small details require a lot of manual input, a.k.a “human-time”.

Examples with before and after results and the small coding changes needed in
the README are key for an easy and solid experience.

![ readme screenshot ]({{site.url}}/assets/images/jplotlib/readme.png){: .center-image }

## Extreme-Makeover, Jampp edition

This is the part where we show you how different your visual experience can be
by improving your plotting tools.

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


This wouldn't be complete without some of the house favorites.
Here are some examples of the `slope` and `Venn` charts developed on the `JPlotLib` package.

### Slope Plot
![ jplotlib slope plot ]({{site.url}}/assets/images/jplotlib/slope.png){: .center-image }

### Venn Diagram
![ jplotlib venn diagram ]({{site.url}}/assets/images/jplotlib/venn.png){: .center-image }


## Bonus Points

You can preset your brand’s color palette predefine color maps for heatmaps.
This ensures a clean and coherent look and your Marketing team will love you.

![ colors ]({{site.url}}/assets/images/jplotlib/colors.png){: .center-image }
![ colormaps ]({{site.url}}/assets/images/jplotlib/colormaps.png){: .center-image }

## Wrapping Up / Keep in Mind

So remember, it’s not enough to “get” the data, you also need to show it in a
way that allows others to quickly grasp its meaning. You have to make sure
everyone in the company understands what it means with the least effort
possible, and the best way to do that is to make easy-to-read (and pretty,
don't forget pretty) figures that show it's value.
