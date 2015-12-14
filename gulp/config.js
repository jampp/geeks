var src               = '_src',
    build             = 'build',
    development       = 'build/development',
    production        = 'build/production',
    srcAssets         = '_src/_assets',
    developmentAssets = 'build/assets',
    productionAssets  = 'build/production/assets';

module.exports = {
  browsersync: {
    development: {
      server: {
        baseDir: [development, build, src]
      },
      port: 9999,
      files: [
        developmentAssets + '/css/*.css',
        developmentAssets + '/js/*.js',
        developmentAssets + '/images/**',
        developmentAssets + '/svg-icons/**'
      ]
    },
    production: {
      server: {
        baseDir: [production]
      },
      port: 9998
    }
  },
  delete: {
    src: [developmentAssets]
  },
  jekyll: {
    development: {
      src:    src,
      dest:   development,
      config: '_config.yml'
    },
    production: {
      src:    src,
      dest:   production,
      config: '_config.yml,_config-build.yml'
    }
  },
  styles: {
    src:  srcAssets + '/sass/*.sass',
    dest: developmentAssets + '/css',
    options: {
      autoprefixer: {
        browsers: [
          'last 2 versions',
          'safari 5',
          'ie 8',
          'ie 9',
          'opera 12.1',
          'ios 6',
          'android 4'
        ],
        cascade: true
      }
    }
  },
  browserify: {
    // Enable source maps
    debug: true,
    // Additional file extensions to make optional
    extensions: ['.coffee', '.hbs'],
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries:    './' + srcAssets + '/javascripts/app.js',
      dest:       developmentAssets + '/js',
      outputName: 'application.js'
    }, {
      entries:    './' + srcAssets + '/javascripts/head.js',
      dest:       developmentAssets + '/js',
      outputName: 'head.js'
    }]
  },
  images: {
    src:  [
      srcAssets + '/images/**/*',
      srcAssets + '/svg-icons/**/*'
    ],
    dest: developmentAssets + '/images'
  },
  crop: {
    src:  srcAssets + '/images/featured-images-posts/**/*',
    assets: srcAssets,
    dest: developmentAssets + '/images'
  },
  svgSprite: {
      src: srcAssets + '/svg-icons/**/*',
      dest: srcAssets + '/pre-sprites/',
      config: {
        dest: "_src/_assets/pre-sprites",
        log: "info",
        shape: {
          spacing: {
            padding: 1,
            box: "padding"
          }
        },
        mode: {
          css: {
            dest: ".",
            layout: "vertical",
            sprite: "images/sprite.svg",
            bust: false,
            render: {
              scss: {
                template: "./sprite-template/template.scss",
                dest: "sass/_sprite.scss"
              }
            }
          }
        }
      }
      },
  webp: {
    src: productionAssets + '/images/**/*.{jpg,jpeg,png}',
    dest: productionAssets + '/images/',
    options: {}
  },
  gzip: {
    src: production + '/**/*.{html,xml,json,css,js}',
    dest: production,
    options: {}
  },
  watch: {
    jekyll: [
      '_config.yml',
      '_config-build.yml',
      src + '/_data/**/*.{json,yml,csv}',
      src + '/_includes/**/*.{html,xml}',
      src + '/_layouts/*.html',
      src + '/_posts/*.{markdown,md}',
      src + '/**/*.{html,markdown,md,yml,json,txt,xml}',
      src + '/*'
    ],
    styles:  srcAssets + '/sass/**/*.sass',
    scripts: srcAssets + '/javascripts/**/*.js',
    images:  srcAssets + '/images/**/*',
    sprites: srcAssets + '/images/sprites/*.svg',
    crop: srcAssets + '/images/featured-images-posts/**/*'
  },
  base64: {
    src: developmentAssets + '/css/*.css',
    dest: developmentAssets + '/css',
    options: {
      baseDir: build,
      extensions: ['png'],
      maxImageSize: 20 * 1024, // bytes
      debug: false
    }
  },
  jshint: {
    src: srcAssets + '/javascripts/*.js'
  },
  sprites: {
    src: srcAssets + '/images/sprites/icon/*.png',
    dest: {
      css: srcAssets + '/sass/partials/sprites/',
      image: srcAssets + '/images/sprites/'
    },
    options: {
      cssName: '_sprites.sass',
      cssFormat: 'sass',
      cssOpts: {
        cssClass: function (item) {
          // If this is a hover sprite, name it as a hover one (e.g. 'home-hover' -> 'home:hover')
          if (item.name.indexOf('-hover') !== -1) {
            return '.icon-' + item.name.replace('-hover', ':hover');
            // Otherwise, use the name as the selector (e.g. 'home' -> 'home')
          } else {
            return '.icon-' + item.name;
          }
        }
      },
      imgName: 'icon-sprite.png',
      imgPath: '/assets/images/sprites/icon-sprite.png'
    }
  },
  optimize: {
    css: {
      src:  developmentAssets + '/css/*.css',
      dest: productionAssets + '/css/',
      options: {
        keepSpecialComments: 0
      }
    },
    js: {
      src:  developmentAssets + '/js/*.js',
      dest: productionAssets + '/js/',
      options: {}
    },
    images: {
      src:  [
        developmentAssets + '/images/**/*.{jpg,jpeg,png,gif,svg}',
        developmentAssets + '/svg-icons/**/*.{jpg,jpeg,png,gif,svg}',
      ],
      dest: productionAssets + '/images/',
      options: {
        optimizationLevel: 3,
        progessive: true,
        interlaced: true
      }
    },
    html: {
      src: production + '/**/*.html',
      dest: production,
      options: {
        collapseWhitespace: true
      }
    }
  },
  revision: {
    src: {
      assets: [
        // productionAssets + '/css/*.css',
        productionAssets + '/js/*.js',
        productionAssets + '/images/**/*',
        productionAssets + '/svg-icons/**/*',
      ],
      base: production
    },
    dest: {
      assets: production,
      manifest: {
        name: 'manifest.json',
        path: productionAssets
      }
    }
  },
  collect: {
    src: [
      productionAssets + '/manifest.json',
      production + '/**/*.{html,xml,txt,json,css,js}',
      '!' + production + '/feed.xml'
    ],
    dest: production
  },
  s3: {
    src: production + '/**'
  }
};
