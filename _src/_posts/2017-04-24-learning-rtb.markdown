---
layout: post
title:  Learning from the RTB market
date:   2017-04-24
tag: data-science
categories:
  - data-science
keywords: "python, RTB, machine-learning"
author: memeplex
---

As you might already know, [Jampp][jampp] is a performance marketing platform
that allows companies to promote their mobile applications by leveraging
real-time bidding ([RTB][rtb]) technologies in order to buy digital advertising
from multiple inventory sources and exchanges. During an RTB transaction, an
auction is announced and any interested bidder has to answer with a bid price
within a time constraint of about 100 milliseconds. The bidder that wins the
auction pays the second-highest price and obtains the right to print a creative
(which is just jargon for displaying an ad) on a publisher site. If the banner
is clicked by the user, further goal events might be tracked, e.g. the
application may be installed or opened. Obtaining a goal event is called a
conversion.

One main component of our platform is the machine learning subsystem that feeds
the bidding subsystem with predictive models of conversion rates for different
events of interest (clicks, installs, opens, etc.). A conversion rate for an
event \\(E\\) is the conditional probability \\(p(E|C,T)\\) of getting that
event by printing some creative \\(C\\) in the context of the current RTB
transaction \\(T\\). Why is it so important for our business to have good
estimates of these rates? Simply because we sell conversions, but we pay for
impressions. For example, suppose one client pays us \\($1\\) per install and
we estimate the install conversion rate to be around \\(0.1\\) (just cheating...
real world figures are well under a dismaying \\(0.001\\) **:-(** ). Then, assuming
our creative is going to get printed, we should expect an average profit of
\\($0.1 - c\\), where \\(c\\) is the expected cost of the impression. If our
rate estimates are grossly miscalculated, we lose money by under-evaluating the
expected income (thus missing opportunities with \\(c < $0.1\\)) or by
over-evaluating it (thus buying non-opportunities with \\(c > $0.1\\)) [^risk]. The bottom
line is that our bidder might be able to pick an optimal pair (bid, creative)
for the market transaction in progress from:

1. The estimated conditional conversion rate for the goal event.
2. Our customer valuation of the goal event.
3. The budget constraint for the advertising campaign.
4. A narrow-minded profit maximization behavior.

In order to estimate conversion rates, we implemented a SGD (Stochastic
Gradient Descent) algorithm or, more specifically, [a FTRL-P][ftrlp] (Follow the
Regularized Leader Proximal) algorithm with [Adagrad][adagrad] (Adaptive
Learning Rate) and [ElasticNet][enet] (Lasso and Ridge) regularization. This is
a state-of-the-art algorithm mostly used in online advertising because of its
[convenient trade-off][sgd] between optimization and estimation errors in
scenarios where computational capacity ---and not available data--- is the
real bottleneck. Every day our system is able to learn from an online stream of
tens of millions of messages published by the bidder into a very
lightweight middleware implemented on top of [ZMQ][zmq].

The first step after receiving an event from the stream is to turn it into a
numerical vector that the estimator can consume. Since most of our variables are
categorical and since we consider many interactions between these variables, the
output vector will be a sparse binary array of "dummy" variables. We feed this
vector to a cluster of estimators, each one parameterized according to a grid of
parameters controlling strength of regularization, number of hashing bits (yes,
we take advantage of the [hashing trick][trick] as everybody else does),
estimator memory, etc. Periodically, we evaluate the estimators in the cluster
using a mix of progressive validation and bootstrap validation in order to
select the best performing parameterization. The chosen estimator is then
converted to a tree-like data structure thoroughly optimized for fast model
evaluation and, finally, it's exported to the bidding subsystem.

We now move on to a more detailed description of the FTRL-P algorithm itself,
which is the workhorse of our learning system. Let \\((x,y)\\) denote the input
vector, with \\(x\\) a set of binary features and \\(y\\) a binary response.
Also, let \\(\theta\\) denote the vector of model coefficients. Then our
prediction at time \\(t\\) is computed from the logistic regression model:

$$
\hat{y_t} = \frac{1}{1 + e^{-{\theta_t}^T x_t}}
$$

Of course, the goal of the algorithm is to learn \\(\theta_t\\) from
a succession of input events \\((x_1,y_1), \ldots, (x_t,y_t)\\). For this
we minimize the sum over each previously seen input event of:

1. (The gradient of) the log-likelihood loss, which is a [logloss][] for the
logistic model.
2. A stabilizing term that introduces some strong convexity into the mix.
3. Regularizing terms that combine lasso and ridge regularization.

After filling in the details and translating everything to Greek:

$$
\theta_{t+1} = \underset{\theta}{\operatorname{argmin}}\
{g_{1:t}}^T \theta +
\frac{1}{2\eta_0}\sum_{s=1}^t ||\theta_s-\theta||^2_{A_s - A_{s-1}} +
\lambda_1 ||\theta||_1 + \frac{\lambda_2}{2}||\theta||^2_2
$$

where:

* \\(g_{1:t}\\) is the sum of the previous gradients \\(g_1, \ldots, g_t\\) of
  the loss function.
* \\(A_t = (\sum_{s=1}^t g_s g'_s)^{1/2}\\), which
  [minimizes the regret bound][minregret] over Mahalanobis norms for projected
  gradient descent. That said, in real life we just consider the diagonal matrix
  \\(diag(A_t)\\) for the sake of computation.
* \\(\eta_0\\) is the initial learning step.
* \\(\lambda_1\\) is the strength of the lasso regularization.
* \\(\lambda_2\\) is the strength of the ridge regularization.

Regularization terms aside, this is mostly equivalent to an online gradient
descent formulation with learning rate \\(\eta_t = \eta_0 A_t^{-1}\\), but
solving the minimization in a follow-the-leader fashion allows for an effective
implementation of lasso regularization that produces coefficients which are
exactly zero (and, hence, more sparse models that are cheaper to store and
transfer and, most importantly, way faster to evaluate). Although at first sight
it might seem that implementing the follow-the-leader update step ---which sums
over every previous input--- would be harder than implementing the gradient
descent update step ---which just cares about the last update---, this first
impression turns out to be wrong after a [careful reformulation][trenches] of
the above expression:

$$
\theta_{t+1} = \underset{\theta}{\operatorname{argmin}}\
{z_t}^T \cdot \theta +
\frac{1}{2\eta_0} ||\theta||^2_{A_t} +
\lambda_1 ||\theta||_1 + \frac{\lambda_2}{2}||\theta||^2_2
$$

where \\(z_t = {g_{1:t}} - \frac{1}{\eta_0} \sum_{s=1}^t (A_s -
A_{s-1})\theta_s\\), which can be cheaply calculated in an incremental way as:

$$
z_t = z_{t-1} + g_t + \frac{1}{\eta_0} (A_t - A_{t-1})\theta_t
$$

Now, when \\(A_t\\) is diagonal the closed form of the solution is just:

$$
\theta_{t,i} =
\begin{cases}
0 & \text{if } |z_{t,i}| \le \lambda_1 \\
-\frac{z_{t,i} - \text{sgn}(z_{t,i})\lambda_1}{A_{t,i}/\eta_0 - \lambda_2} & \text{otherwise}
\end{cases}
$$

Glossing over many technicalities like:

* Keeping a huge inverse hash map, in order to recover features from hashes.
* Following a "memory schedule" that weights each input according to the time
  elapsed since its arrival, in order to adapt to ever-changing market
  conditions [^decay].
* Storing frequent checkpoints of the model, in order to resume from valid
  states after expected deployments or unexpected crashes.

...our implementation faithfully follows the update formula above. Given that
the input vectors are sparse, the update step is very efficient (it's \\(O(n)\\)
with \\(n\\) the number of non-zero features) even for high dimensional data
(millions of features). The implementation is pretty generic in the sense that
---besides the logloss and logit link--- custom loss and link functions can be
passed as parameters to the optimizer. We implemented all this using Python
(with patches of C here and there), and we are very happy with our experience
and results.

Currently, we are well on our way to leveraging this technology in order to
model market clearing prices and campaign velocity of spend, which are
paramount to computing the opportunity cost of bidding for a campaign (vs.
bidding for another one) and to establishing a bidding schedule with the right
pacing for each campaign, so stay tuned! **;-)**

## References

- Bottou, Léon. "Large-scale machine learning with stochastic gradient descent."
  Proceedings of COMPSTAT'2010. Physica-Verlag HD, 2010. 177-186.
  [Online][sgd].

- McMahan, H. Brendan. "A unified view of regularized dual averaging and mirror
  descent with implicit updates." arXiv preprint arXiv:1009.3240 (2010).
  [Online][ftrlp].

- Duchi, John, Elad Hazan, and Yoram Singer. "Adaptive subgradient methods for
  online learning and stochastic optimization." Journal of Machine Learning
  Research 12.Jul (2011): 2121-2159.
  [Online][adagrad].

- McMahan, H. Brendan, et al. "Ad click prediction: a view from the trenches."
  Proceedings of the 19th ACM SIGKDD international conference on Knowledge
  discovery and data mining. ACM, 2013.
  [Online][trenches].

[jampp]: http://jampp.com/

[sgd]: http://leon.bottou.org/publications/pdf/compstat-2010.pdf

[ftrlp]: http://www.jmlr.org/proceedings/papers/v15/mcmahan11b/mcmahan11b.pdf

[adagrad]: http://www.jmlr.org/papers/volume12/duchi11a/duchi11a.pdf

[enet]: https://en.wikipedia.org/wiki/Elastic_net_regularization

[zmq]: http://zeromq.org/

[trick]: https://en.wikipedia.org/wiki/Feature_hashing

[trenches]: https://www.eecs.tufts.edu/~dsculley/papers/ad-click-prediction.pdf

[rtb]: https://en.wikipedia.org/wiki/Real-time_bidding

[logloss]: https://www.kaggle.com/wiki/LogarithmicLoss

[minregret]: https://courses.cs.washington.edu/courses/cse547/16sp/slides/adagrad.pdf

[^risk]: Here we assume we have a neutral attitude towards risk so we only care about expected values.

[^decay]: In practice, we implement a simple exponential-decay schedule.
