---
layout: post
title:  An in depth look into caching (Part 1)
date:   2016-04-05
tag: caching
categories:
  - python
author: klauss
---

##The world-wide web

Nobody calls it that anymore. But the term is oddly descriptive. 
Nowadays, it's all about interconnected systems. You log into your
mobile game with your google account, or maybe your facebook account.
You search for some page (of which you never ever knew its address
- honestly, who types URLs anymore?) and expect the whole process
of typing your query, finding your page, and going into that, to
be faster than bookmarking it. You find it in half a second, it
was a news page, and hit the button to share on twitter.

Increasingly, the difference between offline and online is slowly
fading, and the separation between services even more so.

At the heart of it all, is a huge, world-wide web of server-to-server
communication protocols. Usually REST, but not necessarily always so.
And for it to work as described above, it all has to be fast. It has
to respond, as they say, in real-time - because everything above 50
milliseconds is fake-time.

And this includes ads, which is where we at Jampp come in.

##Enter Real-Time systems

So, we've got a web (or part of it) that's powered by a set of
services working together, communicating in real-time. But what
does real-time really mean? It usually means there's a user behind
that process waiting for its answer, and it expects the answer
to pop up in a reasonable time. It's not always measured in
milliseconds, sometimes a few seconds is fine, but it's certainly
not minutes. For ads for instance, it's around 100ms. That's
milliseconds.

But the systems are complex - or they wouldn't be useful. And they
get more complex every day. So, aside from Moore's law, how do you
cope with increasing complexity with stricter and stricter timing
requirements?

We're looking for an architecture that can:

 - Handle lots of requests per second. Like 200K rps.
 - Handle each request in milliseconds. 100ms to be precise.
 - Handle increasing complexity

And yes, we're talking architecture, not technologies. While
architectures are empowered by technology, it's usually the 
architecture itself the one defining how and whether an app
can scale with real-time constraints.

Lets look at an example.

###Example: The smart banking system

Typical example. It gets requests for deposits or withdrawals,
and it updates an account. Simple. Nothing complex. It can scale
nicely with a number of techniques, like sharding, two-phase
commits (when transactions need to span shards), etc.

Hardware that is fast enough, can make the system meet the 100ms deadline even under big loads when using sharding. Banks have this very well tuned.

Let’s spice it up a bit. Now, the system wants to reply to
every transaction with both the current balance, and a projection
of future balances, as an estimate of how the user is spending
(or earning) his money. To put an example.

The system suddenly needs access to a lot of historic transaction
data, do a lot of math, and things quickly get out of hand.

It's essential, to be able to guarantee real-time performance,
that requests imply very little work. It will never be viable
to perform heaps of computations on each request and still
manage to meet a millisecond deadline, so the trick lies in
simplifying the problem to the point when requests become
simple, yet produce acceptable results.

There are several ways to get this back to manageable:

 - Precompute: have the projections precomputed by the time the
   request comes in. Update after transactions change the balance.
   After answering, but before the next request.
   
 - Throw a lot of computing power (and money) to the problem.
   The fact that this still is constrained to the history of
   a single user makes it at least scalable (it may not always
   be the case).
 
 - Do approximations. Keep a truncated transaction history
   handy to do the projection quickly, or use algorithms that
   allow online update of the projection, even if it's approximate.

So, on the one side,we have technological solutions, in the form of 
*technologies or very fast hardware* that happens to be fit
for solving the problem at hand, or at least help.
And on the other, we have architectural solutions, that involve introducing 
tradeoffs to *shape the problem* back into a workable state.

Technological solutions tend to be expensive, but it's not always the case. There are very nice examples of technologies that are efficient, both
in time, space, and money, for some kinds of problems. Knowing them
is of course extremely important, so the first step in any kind of work
involving real-time at scale, is due research. Figure out the options,
test them even.

Most of the time, though, fast systems are expensive, and/or inflexible.
After all, they are usually architectures made reusable by packaging them
into a product, and come with their own set of tradeoffs. 
Take NoSQL, for instance. It takes away *ACID* ity (mostly
consistency) and querying capabilities, trading it for speed and ease of
scalability. They may be useful, but they won't work in all cases, and the
tradeoffs need to be considered carefully before adoption.

Most of the time, we can get a better fit by designing our own
architecture with our own, better-fitting tradeoffs. Though it takes effort
and experience, and a lot of thinking.

Here at Jampp we have this habit of thinking from time to time, it saves
us from having to throw money at some problems that have cheaper solutions,
so we're going to try and share some of our experience in this post (and others), and 
maybe it will take you a bit less effort and a bit less experimentation 
to get to your own efficient solutions.

We'll start with simple caching tricks, another way to get the latency down.


