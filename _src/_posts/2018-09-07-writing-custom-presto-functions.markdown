---
layout: post
title:  Writing custom PrestoDB functions
date:   2018-09-11
tag:    technology
categories:
    - data-infrastructure
    - technology
keywords: "Presto, PrestoDB, UDF, aggregation"
author: dantepawlow
---

<!--excerpt.start-->

Here at Jampp we process and analyze large amounts of data.
One of the tools we employ to do so is [PrestoDB](https://prestodb.io/), which is a "Distributed SQL Query Engine for Big Data".
Presto comes with many [native functions](https://prestodb.io/docs/current/functions.html), which are usually enough for most use cases. Nevertheless, sometimes you need to implement your own function for a very specific use.

Enter the [User Defined Functions](https://prestodb.io/docs/current/develop/functions.html) (UDFs, for short).
Writing one for the first time is not as straightforward as it may appear, mainly because the information to do so is very scattered around the web (and across many Presto versions).

In this blogpost, we present [our JSON_SUM function](https://github.com/jampp/presto-udfs), how we wrote it, and some of the lessons we learned along the way.

<!--excerpt.end-->

## Function types

Presto has two main types of functions: scalar and aggregation[^1].

[^1]: There's also window functions, but we have yet to implement one of those, so we'll leave them out of the scope of this article.

Scalar functions are applied to every element of a list (or every selected row, in this case), without altering the order or the amount of elements of said list.
You can think of them as being [map functions](https://en.wikipedia.org/wiki/Map_(higher-order_function)).

On the other hand, aggregation functions take multiple rows as input and combine them into a single output.
We'll focus mainly on the these, as they're more complex (and more interesting to implement!).

Aggregation functions can harness the power of Presto’s distributed workers via a divide and conquer approach.
They consist of three main methods:

* __input__, which reads each row and feeds it to a state.
* __combine__, invoked whenever two states need to be merged.
* __output__, which returns the result of the aggregation at the end.

The _State_ is a data structure that stores the meaningful results of each step of the aggregation, and can be designed according to the specific needs, the only requirement being that it's serializable to be shareable between workers.

It's important to note that no order of input or combination should be assumed: any given state should be able to be combined with any other and any row should be able to be converted to a valid state.
You can, however, define the initial parameters of the state via its constructor.

## Implementation

User Defined Functions are written in Java, inside a [plugin](https://prestodb.io/docs/current/develop/spi-overview.html), separate from the default Presto functions.
They are exposed to Presto by declaring them in [UdfPlugin.java](https://github.com/jampp/presto-udfs/blob/master/presto-udfs/src/main/java/com/jampp/presto/udfs/UdfPlugin.java) and then deploying them as a _.jar_ file in the _/usr/lib/presto/plugin/udfs_ directory.

{% highlight java %}
public class UdfPlugin
        implements Plugin
{
    @Override
    public Set<Class<?>> getFunctions()
    {
        return ImmutableSet.<Class<?>>builder()
                .add(JSONAggregation.class)
                .add(YourUDF.class)
                .build();
    }
}
{% endhighlight %}

**Scalar functions** are fairly simple: you write a single Java function, and annotate it appropriately.
Here's a simple _abs_ function from [Presto's Math Functions](https://github.com/prestodb/presto/blob/3060c65a1812c6c8b0c2ab725b0184dbad67f0ed/presto-main/src/main/java/com/facebook/presto/operator/scalar/MathFunctions.java#L93):

{% highlight java %}
@Description("absolute value")
@ScalarFunction("abs")
@SqlType(StandardTypes.TINYINT)
public static long absTinyint(@SqlType(StandardTypes.TINYINT) long num)
{
    checkCondition(num != Byte.MIN_VALUE, NUMERIC_VALUE_OUT_OF_RANGE, "Value -128 is out of range for abs(tinyint)");
    return Math.abs(num);
}
{% endhighlight %}

**Aggregation functions** are trickier to implement, as they have many more moving parts.
Aside from the _input_, _combine_ and _output_ functions, you should write a [State](https://github.com/jampp/presto-udfs/blob/master/presto-udfs/src/main/java/com/jampp/presto/udfs/aggregation/state/JSONAggregationState.java) interface and its auxiliary files.
If your state uses just basic data types, Presto automatically knows how to construct, serialize and deserialize it.
Otherwise, you should implement a [Factory](https://github.com/jampp/presto-udfs/blob/master/presto-udfs/src/main/java/com/jampp/presto/udfs/aggregation/state/JSONAggregationStateFactory.java) and a [Serializer](https://github.com/jampp/presto-udfs/blob/master/presto-udfs/src/main/java/com/jampp/presto/udfs/aggregation/state/JSONAggregationStateSerializer.java), and link them to the State using [Presto's Metadata Annotations](https://github.com/prestodb/presto/tree/3060c65a1812c6c8b0c2ab725b0184dbad67f0ed/presto-main/src/main/java/com/facebook/presto/metadata).

{% highlight java %}
@AccumulatorStateMetadata(stateFactoryClass = JSONAggregationStateFactory.class, stateSerializerClass = JSONAggregationStateSerializer.class)
public interface JSONAggregationState
        extends AccumulatorState
{
    Map<String, Object> getMap();

    void setMap(Map<String, Object> value);
}
{% endhighlight %}

If you'd like to write an UDF that takes different data types as input (_JSON_ and _VARCHAR_, for example), there are two ways of going about it.
The simple one is to write two (or more) _input_ functions that take those data types as parameters.
This works in our case, but if you need your UDF to be more generic, you can follow PrestoDB's example in their [native functions](https://github.com/prestodb/presto/tree/master/presto-main/src/main/java/com/facebook/presto/operator/aggregation).

## Testing

Once you have your UDF, the sensible thing is to test it.
But how do you simulate Presto's inner workings? This is especially important for aggregation functions, given that Presto takes the components of your UDF and uses them inside a black box.
Thankfully, we have [Docker](https://www.docker.com/)!

[Here](https://github.com/jampp/presto-udfs/tree/master/docker-presto-cluster) we provide a _Makefile_ and a docker-compose.yml[^2] for getting a Presto server up and running locally, automatically incorporating your UDF.

1. First you need to package your UDFs with Maven.
2. Then, replace the path to them in the _docker-compose.yml_ file.
3. Lastly, run the _make_ and _make run-with-logs_ commands.

[^2]: Thanks to [Lewuathe's docker-presto-cluster](https://github.com/Lewuathe/docker-presto-cluster)!

Once it's up, it can be queried like any other Presto cluster, so you can use it to test your UDF.

## Pitfalls

{% blockquote King Richard III %}
My kingdom for a discernible stack trace!
{% endblockquote %}

Developing software never is a smooth-sailing kind of deal (where's the fun in that?), so be prepared to stare into weird looking stack traces.
Here are some of the traps we've fallen into, hopefully it'll save you some headaches:

* Do NOT use the [presto-main](https://mvnrepository.com/artifact/com.facebook.presto/presto-main) dependency for anything besides testing (and even then, try to avoid it). Whichever function you need from _presto-main_ will most like have an equivalent in the [presto-spi](https://mvnrepository.com/artifact/com.facebook.presto/presto-spi) package.
* If your state uses more complex data types than the basic types, you should add a _Factory_ and a _Serializer_ (otherwise, you get weird errors like "HashMap<> not supported").
* Always check that the _.jar_ files are deployed in both the coordinator and the workers. If you get an esoteric Presto exception (like “varchar not found” even though the function is listed in the _SHOW FUNCTIONS;_ query), this is the most likely suspect.

## Conclusion

Presto is a very powerful tool, and given the wide array of native functions at your disposal, it's likely that you'll never need to write an UDF.
Nevertheless, doing so can be a fun adventure into Presto's inner workings and may encourage you to [contribute to the project](https://github.com/prestodb/presto/blob/master/CONTRIBUTING.md).
