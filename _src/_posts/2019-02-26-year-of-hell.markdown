---
layout: post
title:  Surviving software rewrites
date:   2019-02-26
tag: technology
categories:
  - technology
keywords: "rewrite, architecture, platform, BDT, decision, tree"
author: klauss
content: |
  I've suffered a few "rewrites" over my career.
  You know how it goes. You start your project coding
  with a few reasonable assumptions, and you get a nice proof of concept working.
  Then you realize your PoC became the actual thing, so you try
  (in vain) to "tidy things up". But it works, so you move on.

  A little later you look back in horror at your code, and you think to yourself...
  I could do this much better if I rewrote it today.

  And if you've been in that situation, you know how it ends.
  Almost always, in flames.
---

![Silver]({{site.url}}/assets/images/silver_681x380_trans.png){: .center-image }

I've suffered a few "rewrites" over my career, both in professional projects
and in amateur ones. You know how it goes. You start your project coding
with a few reasonable assumptions, and you get a nice proof of concept working.
Then you realize your proof of concept became the actual thing, so you try
(in vain) to "tidy things up". But it works, and well, so you move on.

A few thousand kilometres down the road (because metric!), you look back
in horror at your code. It's awful, you've got tons of features nobody
uses, features that require a lot of code and support.

You also realize you've engineered the whole thing wrong. The assumptions that
seemed reasonable at the time turned out to be untrue after some real-world
experience. Or maybe they were true, but not anymore. Whatever the case, you
realize your whole software architecture no longer fits the problem.

Finally, you notice the quality of the code has considerably degraded. It's hard
to read. It's hard to think about it. Patches upon patches, some for optimization,
some for new features nobody wants, some to fix some obscure bug or worse,
some workaround to deal with someone else's bug.
A million paper cuts made your software hard to read, and hard to maintain.

And you think to yourself... I could do this much better if I rewrote it
today, with the knowledge I accumulated down the road. I know I can.

And if you've been in that situation and decided to go for it, [you know
how it ends as well](https://medium.com/@herbcaudill/lessons-from-6-software-rewrite-stories-635e4c8f7c22).
Almost always, in flames.

Rewrites are very difficult, very risky projects:

* **They're extremely long projects**
  
  It's not due to laziness
  it took years to get the software to that point. It takes time
  to discover how to do things, and more time to actually
  do those things. It's not like you'll be able to redo all that work in a week.
  Or a month. Or two.

* **They're risky**

  Since you've got to develop everything from scratch again,
  there's a very high chance you'll find something unexpected along the way.
  It's a statistical certainty. With so much work ahead, you'd have an easier
  time winning the lottery than finishing the rewrite on time and without a hitch.
  Add that the long time frames involved naturally imply huge
  error bars on any time estimation, and you've got eternal headaches for management.

* **They're giant scope creep magnets**

  Since we're rewriting it, I'll take the opportunity
  to fix this thing I did wrong. And since we're at it, we can
  improve on this... and that... famous last words.

* **Insanely slow ROI**

  You won't see the fruits of your labor until you're done
  rewriting. Unlike with the original development experience, where you could
  deploy features as you went along, it's unlikely you can replace your old software before
  you finish all the features. Feature regressions are hard to accept, so you won't
  see it deployed until you're done. And you don't get feedback until you're done.

* **They're demoralizing**

  All of the above means the whole endeavor will be
  fraught with pain and low morale. It's not fun spending months coding something
  no user sees. You get no satisfaction from your work until the very end, **if** you
  get there.

With that introduction, it might come as a surprise to you when I say the project
I'm going to talk about isn't one of those.

No way José. I've done those, I have developed the knee-jerk self-preservation
reflex to say "No" when I hear such proposals. No, we didn't **intend** to do a rewrite.

We just ended up doing it.

## Preface

Let me tell you the story of how we ended up there in the first place.
If you're feeling like *"TL;DR, gimme the punchline"*, feel free to skip to the
[next section](#the-project). But if you're in the mood for some storytelling, read on.

Like I said before, most useful projects start out from a PoC that does well
and becomes the actual thing. Ours was no different. And, as such, there was
a lot of room for improvement.

Not only that, but our way of doing business was changing, so many of the
assumptions we made while writing the software no longer applied nor were
a good fit to our needs.

The software I'm talking about is our Real-Time Bidder. It has some very
strong performance requirements. One is that it has to answer most
requests within 100ms. Any later, and the response
is ignored. Furthermore, if even one percent of those requests take
longer than that, our partners will start complaining.

But 100ms isn't even close to our actual CPU budget. In order to stay
profitable, we have to take much less than that per request. Our average
target is closer to 4ms than 100ms.

Real-time bidding is a tough thing to get right, even without any machine
learning and sophisticated algorithms and features. Just doing a very
dumb bidder that can respond usefully within those constraints is a
challenge. And we're not content with a dumb bidder, we do use a lot of
machine learning and have sophisticated features that make the endeavor
technically challenging.

So we've cut more than a few corners to get that performance we need.
And each corner we cut was motivated both by performance, and some business
reality we *thought* would hold for a long time. *Except a lot of these didn't*.

Skip a few years ahead, and we realized a lot had changed in how
users (our account managers) were using it.

Our bidder was like the old OpenGL 1.0 of yore: highly configurable,
but fixed-function. It was configurable enough that we could actually
do what we needed, no problem there, but it took a lot of effort and
human involvement, and we do believe in letting computers do what
computers do best.

Weighing lots of variables to try and find the right users to
show an ad to? That's a task for computers,
not humans. Figuring what ad to show to which user? Or the best time to show ads? Again, tasks for
computers. Building reports that give an insight into possible
performance problems or lost opportunities? You guessed it, the computer should
do that, and yet we found, in lots of cases, our users had to "handhold" the
system if they wanted to do things right.

Our bidder design was centered around a workflow that was no longer
in use, and the new workflow was more labor-intensive than it should be
*because* of that.

We knew that, and we wanted to fix it.

We started looking into the problem as a problem of automation
(again, automating repetitive tasks? That's a computer's job) - that is,
how do we build the current workflow into our
UI so that users don't have to spend more time than necessary navigating
and clicking on the UI to do mundane tasks?

A colleague of mine, let's call him Benja, because that's his name, was in
charge of that. As he delved into the problem, it became increasingly apparent
that just UI changes wouldn't cut it. Our whole system
was built on outdated assumptions, not just the UI.

So he came to me to talk about that, and said, (I'm paraphrasing
more than a bit): "What if we switched to a Rules-based system?".

It would work! It was like upgrading from the fixed-function OpenGL
pipeline to the fully-programmable GLSL-powered version 4.0 we're so used
to today (if you're doing GPU programming that is). Having that expressive
power would allow our workflow to translate naturally into the UI,
and simplify our users' tasks an order of magnitude.

At that point two thoughts crossed my mind: First thing I thought
was that I was sold on the idea. I wanted to do it. And a second after that
I thought *"I hate you"*.

Because I knew just how much work achieving that would involve. And if I
hadn't been convinced it was a good idea, I would never have agreed to
take on such a huge task. But I was convinced. And I had fallen into the trap.
And I knew the next N months of my life would be... well... *"fun"*.


## The project

The project itself wasn't a rewrite, but the changes involved were huge.
As I said, it all started with a new UI. The new UI started adding 
constraints to the backend, enough that we ended up rewriting most of
the existing code base. So it wasn't a rewrite per se, but we rewrote
most of our code anyway.

I mentioned we switched from a highly configurable fixed function pipeline
into a highly flexible rules-based one that had a lot more expressive power.
That was the core of the project.

But that's easier said than done. The new system used rules instead
of configuration. Each campaign would basically have a program that had
to run in order to figure out whether to bid on an impression or not.

Suddenly, all the optimizations we had in place to meet our CPU budget
no longer applied, and we had to work out another way to optimize things.

So... how do we get there?

We had to solve quite a few nontrivial - nay, complex - problems in the
process:

* **The Bidder Decision Tree** (BDT)

  First, we replaced all the straightforward business logic code by a
  decision-tree-like structure that could quickly cull rules based on
  auction characteristics.

* **Instrumentation**

  Since the BDT was so magical that it would be an inscrutable black box, and
  that wasn't ok, we designed a whole new instrumentation
  system to measure all the decisions taken within the BDT with minimal overhead.

* **The new UI itself**

  The new UI was indeed a complete rewrite from scratch, with microservices,
  Node.js and React. It was a massive undertaking.

* **Data migration**

  The new model was radically different from the old model so, at some point, we had to
  transition databases, applications, everything to it. It was
  no small feat, especially since it had to be done without impacting day-to-day operations. It's not
  like we could start the new system with a blank database and tell everybody to set
  everything up again, manually, from scratch. We had to come up with an unobtrusive
  transition plan.

As you can probably tell from the preface, though, the project was as stressful as it was
cool. Each step of the way encountered unexpected roadblocks, and was cause
for many a flamewar.

Where to begin...

### The Bidder Decision Tree

Instead of processing campaigns one by one, caching results as we did
before, we precomputed a decision tree optimized for whatever the current
campaign setup is at the time. A greedy algorithm would be free to
shape that BDT the way it best suited the current setup, making it a very
flexible design.

The decision tree would trade offline CPU time with online CPU time.
Building the tree would take a lot of CPU time, but the structure could
then be shared by all bidders and that cost gets amortized in time and scale.
It was a clear win, but not without its challenges.

The first version of the BDT had a rather naïve approach.
We knew this, but we thought we could get away with it.
Instead of building a truly optimal tree, we tried
a heuristic that was fast and simple. At least in tests. As soon as we
plugged it onto some real configurations, there wasn't a machine that
had enough RAM to finish the job. Those were some nicely wasted months,
but it is par for the course for a complex rewrite trying to solve
complex problems. Trial and error involves both trial... and error.

The next version of the BDT was an optimal tree, done in a straightforward, 
brute-force way. It took 6 hours to build, and weighed approximately 30GB.
That was not ok. We had to update the BDT every 5 minutes.

Eventually, we got there; mostly by cleverly optimizing the tree, 
both in how it's represented, with heuristic branch pruning, **and** massive
parallelization of the build process.

There was no book we didn't throw at it.

### Instrumentation

Before this project, every time we decided not to bid for a campaign,
we tracked an "NBR". Quite descriptively, a non-bidding reason.
Problem with that was that it was very hard to interpret. If the NBR
for an auction was, say, "blacklisted publisher", that didn't mean
it would have bid on a different publisher. NBRs weren't easily interpreted
as lost opportunities, and thus actionable recommendations,
and we had to solve that.

We knew that when - not if - something didn't work as intended, we would
have a hard time diagnosing the issue. So we designed a whole new instrumentation
system that let us measure all the decisions taken within the BDT with minimal overhead.
Not only those that would result in a non-bid, but all of them.
And I really mean minimal overhead. On the hottest paths, the instrumentation
takes literally a single CPU cycle.

Getting there took way longer than we had estimated,
evidencing the riskiness of such huge project rewrites. We thought we
could do the instrumentation rather quickly, sloppily on a first version
and then improve on it. However, when we put that sloppy PoC in pre-production,
the performance was so abysmal we just couldn't put that in production.

We had to spend way longer optimizing the thing
down to an acceptable overhead than we thought, squarely putting the 
project off-schedule.

Yes, now we have a really nifty instrumentation system that we can
use to diagnose and measure anything we need. It even produces easy
to understand reports. We were even able to use it to thoroughly test
the BDT in our test suite and in pre-production, which was probably a big
part of why the whole endeavor succeeded.

But it came at considerable cost.

### The new UI

I did mention this all started as a purely-UI project.
The UI team soon realized the original web app
needed sweeping changes, so they set out to rewrite the whole thing
"the modern way" from scratch. With new technologies to boot.
React, Node.js, microservices, you pick the buzzword and we got it.

Seriously though, the original UI was a rather standard web 2.0 app,
already showing its age, and the rewrite was long overdue.
With React, Node.js, and a host of backend microservices to power them,
the usability and maintainability improvements weren't minor.

That's not done overnight though.

But this was also the core of the project. We wanted to redesign the UI because the
old one was just not well suited to our current workflow.

We didn't just change the UI, however... and here it comes...

### Scope creep

Microservices are great. I'm totally in favor of them, especially for connecting
a web UI to its backend. It's such a great way to work in the frontend...

But changing the workflow also meant changing that data model behind it. A data
model is after all also a conceptual model, so if you're trying to adapt your
software to changing realities, no change is complete without a corresponding
model change.

And a model change, especially if it involves a database with terabytes or even petabytes of
historic data that you can't throw away, is a huge change.

We had to turn everything upside down to do that model change, so it looked like
the best time to also change a few things we always wanted to change, but hadn't
had the opportunity to.

### Rip that Database

I mentioned microservices, I mentioned the bidder, and I mentioned the UI. Until
now, the bidder and the UI communicated through a shared database. That was...
chaotic, to put it mildly.

Both applications were hugely different in requirements and workload. The bidder
serves half a million requests per second, whereas the UI serves just us, in
our internal use of the system. Those workloads are so different that the
two apps are always clashing in some way.

Even the teams maintaining them were different. Maintaining that shared database was not easy,
so we decided it would be a great time to force the bidder to start using
those new microservices. After all, we had a huge model change coming, and the
microservices would be a great way to abstract that change away as much as possible.

*And thus it started. Scope crept an inch forward.*

It wasn't really necessary. We just thought it would be the best time to attempt
it. In hindsight, maybe we shouldn't have. The project was big enough without
that, and it wouldn't come cheap in the end.

We thought it would help shield the bidder from the huge model change
that was happening underneath, but in the end it wasn't very effective in doing
that either. It only served to add a dependency between the UI team and bidder team
making team dynamic a lot more complex, and basically delaying the project.

In retrospect, we could have switched to microservices either before or after
the redesign. That would have improved team independence, and a whole category of
things that could go wrong would have vanished, making the project move that much
faster and predictably as a result.

What's worse, the database switch forced the project to be an all-or-nothing
affair. We couldn't do baby steps because the new system would work on a different
database. It's hard to be 100% certain, but I'm pretty sure we would have had a
much smoother transition if we hadn't compounded the problem by doing both things
at once.

But, as always, hindsight is 20:20.

Which brings me back to the preface, and that issue of...

## Late ROI

All of the above made the project unable to hit production before it was fully fleshed
out. We *tried* to chop it into smaller chunks we *could* deploy, but there was
still a huge last jump that was quite problematic.

As with all very long projects, it was hard to predict when it would be done. We
revised our estimates a zillion times, each time delaying it a bit further.
We revised the functionality a zillion times as well, trying to move the date
back to where we wanted it.

There's a very weird dynamic in these huge projects that makes for a
very *"fun"* experience.

On the one side, you want to fix a delivery date and stick to it. That's useful,
it puts a limit to scope creep, it informs the business side so they can make
better decisions, and in general keeps everyone focused on the immediately
useful goals.

On the other side, complex problems can't be rushed. Sometimes the only resource
a project needs to finish, is more time.

Manpower can't be added. There's a very famous saying in this regard, that 
I expect most already know: *"Adding manpower to a late software project, makes it later."*

Functionality can be removed only up to a point. If what delays you is the core
of the project, you can only choose whether to invest the required time or not.
And then there's that sunk cost that keeps you from choosing to bail out.

Suffice it to say, that planning sessions were best watched with popcorn in hand.

### How to cope with it

During all this time, a sense of urgency starts to build up. At some point,
you might be tempted to put all your eggs in the project's basket, go all it,
throw all your resources at it, finish it as quickly as possible and ignore everything
else.

It's a common reaction to think that, if all your development team is fully dedicated to
finishing that rewrite, it will happen sooner. And then, you think, if it happens soon,
then we don't need to maintain the old system. Right?

**Resist the urge to freeze the "old system"**.

That system pays the bills. If you stop maintaining it, at some point, it will stop
paying the bills, and you won't have it either way.

As the old adage goes, *"if you don't schedule time for maintenance, your equipment
will schedule it for you"*. The same applies to software.

It's best to spend a whole year on the rewrite, while keeping the legacy version
relevant and able to sustain the business, than to spend 6 months on the rewrite
to reach the end and find you no longer have a business, because your old system
just couldn't keep up with the business without maintenance.

## In the end

Here we are. After the better part of a very hard year, working tirelessly
to build a super-cool new version of our bidder, we have succeeded.

The switch to production was quite a rocky road, but that was to be expected.
Such a big change is likely to present obstacles. All in all, I know
how lucky we were to even finish. But it wasn't just luck, it was the effort of not one team,
but **all of them**.

Probably the most important thing to make sure you succeed, is knowing that you may
fail. That most of such endeavors fail. Be ready to make hard decisions, because they're definitely
in your future if you're considering a rewrite. Set things up so that **if you fail,
you won't go under**, and learn how to recognize defeat early.

Otherwise, don't let despair set in, it may be difficult to see the light at the
end of the tunnel, but whether you see it or not, it's there.

Just keep calm, and keep coding.

