---
layout: post
title:  Julia in safe Data Science
date:   2016-04-18
tag: data-science
categories:
  - data-science
  - julia
keywords: "Julia, Data Science"
author: cantuna
---

<!--excerpt.start-->
Recently in Jampp, I had the chance to switch some of our data science environment from Python to Julia. For various reasons, its type system is, in my opinion, one of the best language features. The most obvious one is the performance enhancements it allows. I will not, however, address that point here: it has been benchmarked very well in several places. Instead, I will briefly show a safety advantage this type system brings that is really handy for data science.
<!--excerpt.end-->

To be fair, this feature is handy in a production oriented data science team. Someone more oriented towards analytics, then, might not find it so helpful. Quoting [Robert Chang][CHANG], I perform Type B data science: models I build are meant to get into production. Because of this fact, safety issues are a big concern when implementing them. If we don't catch a misbehaviour in our Machine Learning systems, we will be running our business based on mistaken metrics. For example, bidding high prices for bad banners millions times a day...

So, let's get to the point. When you deal with hundreds of thousands of messages per second coming from a number of sources, you learn one thing: every field will eventually receive at least one ill-formated message. It is true, and not only for data science, that a smart use of types in a language helps you finding mismatches early in the data handling process. Take this toy example and look when Python realizes there is something wrong with the message and what Julia does:

Here is Python's version:
{% highlight python %}
import pandas as pd
import numpy as np

#I received a few messages
df = pd.DataFrame(np.round(np.random.rand(1000, 200)),
          dtype=float,
          columns = ["Attribute{}".format(d) for d in range(1,201)])

# Well, some message didn't follow the expected pattern...
df.ix[1000,1:] = np.round(np.random.rand(199))
df.ix[1000, "Attribute1"] = "1.0"

# Python realizes the mismtaching types but it doesn't complain,
# just casts one column to object

# Several Lines of code either not using Attribute1 ...
# ...
# ...

# Or like:
df.groupby("Attribute1").sum()
# The grouping is wrong, though...

# ...
# ...

# Ok, I need to process 20 given attributes,
# one of them is Attribute1
attributes_needed = [1]
attributes_needed += np.random.choice(range(2,201),19, replace=False).tolist()

#DISCLAIMER: this is an inneficient loop, it is only for illustration purposes.
columns_needed = ["Attribute{}".format(d) for d in attributes_needed]
for r in df.ix[:, columns_needed].iterrows():
    r[1].prod()
# Now there is no way out, Python complains and this exception is thrown:
...
...
...
TypeError: Can't multiply sequence by non-int of type 'float'
{% endhighlight %}

And Julia's one:
{% highlight c++ %}
using DataFrames

#I received a few messages
df = DataFrame(round(rand(1000,200))) 
names!(df, [Symbol("Attribute$i") for i in 1:200])

 #Well, again, some message didn't follow the expected pattern...
push!(df, [["1.0"] ; round(rand(199))])

#But this time, Julia complains at this point, and throws this:
ERROR: ArgumentError: Error adding 1.0 to column :x1. Possible type mis-match.
in push! at /home/cristian/.julia/v0.4/DataFrames/src/dataframe/dataframe.jl:883
{% endhighlight %}

In Python, I put the message in my data frame without noticing the mismatch; I even wrongly process data unnoticing it. Only eventually (and by chance) I get an exception. In contrast, in Julia, the very insertion attempt of this message to the data frame results in an exception being thrown. Julia's type system and the promotions implemented for it are flexible enough to allow for easy data handling (I could receive those ones either as Floats or Ints). But at the same time, they are not so extremely liberal as to cast everything to a highly abstract class (as object), enforcing, thus, some checks (I cannot receive a String where a number is expected). It may be argued that, with proper checking, this safety can be achieved using any laguage. Fair enough, I'll concede that. But still, one would have to implement it. In Julia, it comes for free.

In a pure analysis or exploratory level, handling these issues might be considered, in the best cases, annoying and corrected by hand. But if a model is running into production, anything unexpected in a message should be catched as soon as possible, dealt with and only then, finally, process that message. You could be doing a spurious training if ill-formed messages get through your models. As in many other aspects, when dealing with promotions Julia achieves a nice balance between flexibility and safety.

[CHANG]: https://medium.com/@rchang/my-two-year-journey-as-a-data-scientist-at-twitter-f0c13298aee6
