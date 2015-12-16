# Jampp Framework

## Requirements

-  NodeJs 4.1+
-  NPM 3.3+
-  Bower 1.6+
-  Gulpjs 3.9+
-  Ruby 2.x
-  Jekyll 3

## Environment Setup
`bundle install & npm install & bower install`

## Gulp Tasks

### Default (watch)

`gulp` will watch for assets and fire up the local server for development.

### Publish

`gulp publish` will watch for assets and fire up the local server for production.


### Ready

`gulp ready` generates a production-ready version of the site at /build/production.


## Images

Make sure GraphicsMagick or ImageMagick are installed on your system and properly set up in your `PATH`.

    apt-get install imagemagick
    apt-get install graphicsmagick

Or

    brew install imagemagick
    brew install graphicsmagick


## Authors

Add new authors on `authors.yml` located at `_src/data/`

The default path of author images is `_src/_assets/images/authors`

## Top Navbar

In order to change the order, path o location of the navigation bar you must edit `nav.yml` located at `_src/data/`

To have a structure like `site/slug` we need to create a folder named according to `nav.yml`  data. Inside that folder you need to add an `index.html` with this data:

    ---
    layout: category
    title:  Your New Category - Jampp
    type: your-new-category
    ---


    ## Writing a post

    You can pass several options per post.

    ### YAML Front Matter

        ---
        layout: post
        title: Front-End is new Black
        date: 2015-12-12
        tag: frontend
        categories:
          - jampp
        image:
          feature: clock.png
        keywords: "key1, key2, key3"
        description: Short description of my post.
        author: alexis
        ---

    - `layout` Always use post
    - `title` The page title
    - `date` The page date
    - `tag` Unique value, can be: `data-science, front-end, infrastructure, open-source, python, technology`
    - `categories` and array of categories
    - `image feature` A featured image, must be 640x480 or higher. Place those images at `_src/_assets/images/featured-images-posts`
    - `keywords` An array of related keywords for SEO purposes. Optional
    - `description` Post description for SEO purposes. Optional

### Helpers

**Youtube video**

Add na video with this helper:

    {% youtube ID WITH HEIGHT %}

`WITH HEIGHT` are optional here

**Excerpt**

By default this theme will truncate your content by 40 lines. If you need to add a custom Excerpt just past:

    <!--excerpt.start-->
      My custom Excerpt
    <!--excerpt.end-->

**BlockQuotes**

    {% blockquote CITRE TEXT %}
      "BLOCKQUOTE TEXT"
    {% endblockquote %}

## Shipping to production

Change the values on `confg-build.yml` and run `gulp ready` to compile, lint and optimize assets. Push it!
