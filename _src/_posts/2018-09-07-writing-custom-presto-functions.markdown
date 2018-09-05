---
layout: post
title:  Overview of Jampp's platform
date:   
tag:    technology
categories:
    - infrastructure
    - technology
keywords: "Presto, PrestoDB, UDF, aggregation"
author: dantepawlow
---

<!--excerpt.start-->
Here at Jampp we process and analyse large amounts of data. One of the tools we employ to do so is [PrestoDB](https://prestodb.io/), which is a "Distributed SQL Query Engine for Big Data".
Presto comes with many [functions](https://prestodb.io/docs/current/functions.html), which are usually enough for most use cases. Nevertheless, sometimes you need to implement your own function for a very specific use.

Enter the [User Defined Functions](https://prestodb.io/docs/current/develop/functions.html) (UDFs, for short). Writing one is not as straightforward as it first appears, mainly because the information to do so is very scattered around the web (and across many Presto versions).

In this blogpost, we present our _JSON Sum_ function, how did we write it, and some of the lessons we learned along the way.
<!--excerpt.end-->

## Function types
Presto has two main types of functions: scalar and aggregation[^1]. Scalar functions behave more like traditional functions, in the sense that their output is immediate from the values of their parameters. On the other hand, aggregation functions take multiple rows as input and combine them into a single output, we'll focus mainly on these functions, as they're more complex (and, interesting!).

[^1]: There's also window functions, but we have yet to implement one of those, so we'll leave them out of the scope of this article.

Aggregation functions can harness the power of presto’s distributed workers via a divide and conquer approach.
They consist of three main methods:
    - _input_, which reads each row and feeds it to a state.
    - _combine_, invoked whenever two states need to be merged.
    - _output_, which returns the result of the aggregation at the end.

The _state_ is a data structure that stores the meaningful results of each step of the aggregation, and can be designed according to the specific needs. It should be serializable (and deserializable) to share it between nodes.

It's important to note that no order of input or combination should be assumed: any given state should be able to be combined with any other and any row should be able to be converted to a valid state. You can, however, define the initial parameters of the state via its constructor.

## Implementation
UDFs are implemented inside a [plugin](https://prestodb.io/docs/current/develop/spi-overview.html), separate from the default Presto functions. They are exposed to presto by declaring them in [UdfPlugin.java] and later deployed as .jar files in your cluster. 

Aggregation functions are trickier to implement than scalar functions, as they have many more moving parts. Aside from the _input_, _combine_ and _output_ functions, you should write a [State](TODO) and its auxiliary files. If your state uses just basic data types, Presto automatically knows how to construct, serialize and deserialize it. Else, you should implement a [Factory]() and a [Serializer](TODO).

If you'd like to write an UDF that takes different data types as input (_JSON_ and _VARCHAR_, for example), there are two ways of going about it. The simple one is to write two (or more) _input_ functions that take those data types as parameters. This works in our case, but if you need your UDF to be more generic, you can follow PrestoDB's example in their [native functions](https://github.com/prestodb/presto/tree/master/presto-main/src/main/java/com/facebook/presto/operator/aggregation).

## Testing
Once you have your UDF, the sensible thing is to test it. But how do you simulate Presto's inner workings? This is especially important for aggregation functions, given that Presto takes the components of your UDF and uses them inside a black box. Thankfully, we have [Docker](https://www.docker.com/)! [Here](TODO) we provide a Makefile and a docker-compose.yml[^2] for getting a Presto server up and running locally, automatically incorporating your UDF.

[^2]: Thanks to [Lewuathe's docker-presto-cluster](https://github.com/Lewuathe/docker-presto-cluster)!

Once it's up, it can be queried like any other Presto cluster, so you can use it to test your UDF.


## Pitfalls
> _"My kingdom for a discernible stacktrace!"_ 
>> King Richard III

Developing software never is a smooth-sailing kind of deal (where would the fun in that be?), so be prepared to stare into weird looking stack traces. Here are some of the traps we falled into, hopefully we'll save you some headaches.
* Do NOT use the presto-main dependency for anything besides testing (and even then, try to avoid it). Whichever function you need from presto-main most likely has an equivalent in the spi-package.
* If your state uses more complex data types than the basic types, you should add a _Factory_ and a _Serializer_ (for weird errors like "HashMap<> not supported").
* Always check that the .jar files are deployed in both the coordinator and the workers. If you get an esoteric Presto exception (like “varchar not found” even though the function is listed in the SHOW FUNCTIONS query), this is the most likely suspect.