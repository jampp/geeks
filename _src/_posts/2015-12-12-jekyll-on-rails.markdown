---
layout: post
title:  Jekyll on Rails
date:   2015-12-12
tag: news
categories:
  - jammp
  - rails
author: alexis
---

<!--excerpt.start-->
We can all appreciate the power that Ruby on Rails gives us to rapidly build great web applications. We can also appreciate Jekyll’s amazing ability to turn Markdown and templating into a beautiful static site.
<!--excerpt.end-->

![jekyll_on_Rails.svg](http://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2015/04/1428750609jekyll_on_Rails.svg.png)

_What if we could combine these two?_ In this article, I’m going to do just that.

## Why?

The most practical scenario to combine Jekyll and Rails is when you don’t want to separate your main app from your blog. You _shouldn’t_ do this if you just want to add some dynamic-ness to your site ([Middleman](https://middlemanapp.com/) is better suited for this). But whatever the reason may be, let’s get started!

## Step 1: The App

In the most likely scenario, you probably already have an app and you’d like to add a blog. However, for the sake of uniformity, let’s generate one for our purposes:

{% highlight shell %}
    $ rails new jekyll-on-rails
    $ cd jekyll-on-rails
{% endhighlight %}

Now that we’re in the app, we need to set it up for our Jekyll blog. First, we should add Jekyll to the app:

{% highlight shell %}
    # 'Gemfile'
    gem 'jekyll', '2.5.3'

    # Terminal
    $ bundle install
{% endhighlight %}

Once this command is complete, we can begin adding our blog to Jekyll.

## Step 2: The Blog

Hypothetically, all Jekyll needs to run is a template file and a Markdown file. But we have blogs that are more complicated than that. Every blog is (and should be) different, but we need a uniform blog to demonstrate with, so let’s use the default.

First, let’s have Jekyll generate our blog.

{% highlight shell %}
    $ bundle exec jekyll new blog
{% endhighlight %}

This creates a simple blog example with this file structure:

We’ll leave most of these where they are, but we’re going to move `_config.yml` into the Rails `config` directory and rename it something more specific:


This is where the fun really begins, **configuring the blog!**

## Step 3: Configuring the Blog

If you try going into the blog right now and running `jekyll serve`, it will still work, but you’ll get an error that there is no configuration file. This is obviously because we just moved it, so we’ll have to use special configuration when generating our blog.

We want the Jekyll site to be built every time that our Rails app is regenerated, so we need to add an initializer to our app:

{% highlight ruby %}
    #config/initializers/blog.rb

    Rails.application.config.after_initialize do
      Rails.logger = Logger.new(STDOUT)
      begin
        # make a spot for the site
        dest = Rails.root.join('public/blog')

        # generate the site
        Jekyll::Site.new(
          Jekyll.configuration({
            "config" => Rails.root.join('config', 'jekyll.yml').to_s,
            "source" => Rails.root.join('blog').to_s,
            "destination" => dest.to_s
          })
        ).process

                    # the strange codes give the output color
        Rails.logger.info "\e[0;32;49mJekyll site built!\e[0m]]"
      rescue => e
        Rails.logger.error "\e[0;31;49mJekyll site build failed.\e[0m\n\e[0;33;49mError:\e[0m #{e}"
      end
    end

{% endhighlight %}

This code does a few things for us:  
* It generates the Jekyll site when the Rails application starts  
* It defines a path for the site to be at (`http://localhost:3000/blog/`) – to change this path, modify the `dest` variable  
* It uses smart error handling to ensure that we know when the site build succeeds and when it fails. This also ensures that, even if the site build fails, the application will not fail, allowing for a separation of code bugs between Jekyll and Rails

This file tells Jekyll to take our site (in `blog/`) and move it to (`public/blog/`). This only works because Rails hosts static files in its `public/` directory.

Now we can finally start our Rails app and see how this worked!
{% highlight shell %}

    $ bundle exec rails server
    => Booting WEBrick
    => Rails 4.2.0 application starting in development on http://localhost:3000
    => Run `rails server -h` for more startup options
    => Ctrl-C to shutdown server
    Configuration file: /Users/jesseherrick/Dropbox/Drafts/jekyll-on-rails/config/jekyll.yml
    I, [2015-03-27T16:08:02.591221 #56341]  INFO -- : Jekyll site built!
    [2015-03-27 16:08:02] INFO  WEBrick 1.3.1
    [2015-03-27 16:08:02] INFO  ruby 2.2.0 (2014-12-25) [x86_64-darwin14]
    [2015-03-27 16:08:02] INFO  WEBrick::HTTPServer#start: pid=56341 port=3000

{% endhighlight %}

## Extra: Using Rails-like Assets

Unfortunately, there isn’t a way at the moment to link Rails assets into Jekyll easily. But if you still like the Rails asset pipeline (come on, who doesn’t?), [there’s a plugin for that!](https://github.com/jekyll-assets/jekyll-assets)

Jekyll-Assets is a fantastic Jekyll plugin that can do a lot of things for you, like:

* Compile CoffeeScript, SCSS/Sass, Less, and ERB  
* Require dependencies from inside assets (using Sprockets)  
* Hard and soft cache busting (`main-bbd8a1c8b716f90cfaf9493cbb3868dc.css` vs `main.css?cb=bbd8a1c8b716f90cfaf9493cbb3868dc`)  
* Compress your assets  
* And a few other things

That’s pretty awesome, right? Let’s add it to our Jekyll site.

First, we add `gem 'jekyll-assets'` to our `Gemfile` and `bundle install`. Next, we need to make sure that Jekyll includes this plugin when generating the site. To do this we just add `jekyll-assets` to our list of plugins in `config/jekyll.yml`, like so:

{% highlight shell %}
    # 'config/jekyll.yml`
    plugins:
      - jekyll-assets

    # ... other config ...

{% endhighlight %}


Now, if we reload the page, we get a nice big responsive heading:


## Extra: Automation

You probably noticed that we have to keep restarting Rails every time we want to preview the site. That’s fine if we’re just making a few changes to the Jekyll site, but if we’re doing web design, it can get pretty annoying. Luckily we can automate this!

First, generate a new Rake task for Rails.

{% highlight shell %}
    $ rails generate task jekyll
{% endhighlight %}

This command creates a file called `lib/tasks/jekyll.rake`. Using Jekyll’s API, we can programmatically build the site and serve it at the same time (using threads).

{% highlight shell %}
    namespace :jekyll do
      dest = Rails.root.join('public/blog')

      options = {
        'baseurl' => '/blog',
        'config' => Rails.root.join('config', 'jekyll.yml').to_s,
        'watch' => true,
        'port' => 3000,
        'source' => Rails.root.join('blog').to_s,
        'destination' => dest.to_s
      }

      build = Thread.new { Jekyll::Commands::Build.process(options) }
      serve = Thread.new { Jekyll::Commands::Serve.process(options) }

      commands = [build, serve]
      commands.each { |c| c.join }
    end
{% endhighlight %}

Now, `rake jekyll`, will start the server at `http://localhost:3000/blog/` and reload itself whenever file changes are detected.
