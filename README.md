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
    title: A New Era has arrived
    date: 2015-11-25
    tag : news
    categories:
      - jammp
      - info
    image:
      feature: clock.png
    external-related:
      url: "http://jampp.com/product"
      title: Jampp product
    tagline: |
      The way we interact with the web has changed radically in the last few years. Not so long ago, in a galaxy around the corner, our phones were really really dumb.
    keywords: "key1, key2, key3"
    description: Short description of my post.
    ---

- `layout` Always use post
- `title` The page title
- `date` The page date
- `tag` Unique value, can be: `news, insights, product-announcements or best-practices`
- `categories` and array of categories
- `image feature` A featured image, must be 1280x720 or higher. Place those image at `_src/_assets/images/featured-images-posts`
- `external-related` is true will show force a related content on the bottom according to the values in `url` and `title`
- `tagline` is true will show an excerpt on the post
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
