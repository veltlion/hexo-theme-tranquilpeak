(function($) {
  'use strict';

  // Fade out the blog and let drop the about card of the author and vice versa

  /**
   * AboutCard
   * @constructor
   */
  var AboutCard = function() {
    this.$openBtn = $('#sidebar, #header').find('a[href*="#about"]');
    this.$closeBtn = $('#about-btn-close');
    this.$blog = $('#blog');
    this.$about = $('#about');
    this.$aboutCard = $('#about-card');
  };

  AboutCard.prototype = {

    /**
     * Run AboutCard feature
     * @return {void}
     */
    run: function() {
      var self = this;
      // Detect click on open button
      self.$openBtn.click(function(e) {
        e.preventDefault();
        self.play();
      });
      // Detect click on close button
      self.$closeBtn.click(function(e) {
        e.preventDefault();
        self.playBack();
      });
    },

    /**
     * Play the animation
     * @return {void}
     */
    play: function() {
      var self = this;
      // Fade out the blog
      self.$blog.fadeOut();
      // Fade in the about card
      self.$about.fadeIn();
      // Small timeout to drop the about card after that
      // the about card fade in and the blog fade out
      setTimeout(function() {
        self.dropAboutCard();
      }, 300);
    },

    /**
     * Play back the animation
     * @return {void}
     */
    playBack: function() {
      var self = this;
      // Lift the about card
      self.liftAboutCard();
      // Fade in the blog after that the about card lifted up
      setTimeout(function() {
        self.$blog.fadeIn();
      }, 500);
      // Fade out the about card after that the about card lifted up
      setTimeout(function() {
        self.$about.fadeOut();
      }, 500);
    },

    /**
     * Slide the card to the middle
     * @return {void}
     */
    dropAboutCard: function() {
      var self = this;
      var aboutCardHeight = self.$aboutCard.innerHeight();
      // default offset from top
      var offsetTop = ($(window).height() / 2) - (aboutCardHeight / 2) + aboutCardHeight;
      // if card is longer than the window
      // scroll is enable
      // and re-define offsetTop
      if (aboutCardHeight + 30 > $(window).height()) {
        offsetTop = aboutCardHeight;
      }
      self.$aboutCard
        .css('top', '0px')
        .css('top', '-' + aboutCardHeight + 'px')
        .show(500, function() {
          self.$aboutCard.animate({
            top: '+=' + offsetTop + 'px'
          });
        });
    },

    /**
     * Slide the card to the top
     * @return {void}
     */
    liftAboutCard: function() {
      var self = this;
      var aboutCardHeight = self.$aboutCard.innerHeight();
      // default offset from top
      var offsetTop = ($(window).height() / 2) - (aboutCardHeight / 2) + aboutCardHeight;
      if (aboutCardHeight + 30 > $(window).height()) {
        offsetTop = aboutCardHeight;
      }
      self.$aboutCard.animate({
        top: '-=' + offsetTop + 'px'
      }, 500, function() {
        self.$aboutCard.hide();
        self.$aboutCard.removeAttr('style');
      });
    }
  };

  $(document).ready(function() {
    var aboutCard = new AboutCard();
    aboutCard.run();
  });
})(jQuery);
;(function($) {
  'use strict';

  // Filter posts by using their date on archives page : `/archives`

  /**
   * ArchivesFilter
   * @param {String} archivesElem
   * @constructor
   */
  var ArchivesFilter = function(archivesElem) {
    this.$form = $(archivesElem).find('#filter-form');
    this.$searchInput = $(archivesElem).find('input[name=date]');
    this.$archiveResult = $(archivesElem).find('.archive-result');
    this.$postsYear = $(archivesElem).find('.archive-year');
    this.$postsMonth = $(archivesElem).find('.archive-month');
    this.$postsDay = $(archivesElem).find('.archive-day');
    this.postsYear = archivesElem + ' .archive-year';
    this.postsMonth = archivesElem + ' .archive-month';
    this.postsDay = archivesElem + ' .archive-day';
    this.messages = {
      zero: this.$archiveResult.data('message-zero'),
      one: this.$archiveResult.data('message-one'),
      other: this.$archiveResult.data('message-other')
    };
  };

  ArchivesFilter.prototype = {

    /**
     * Run ArchivesFilter feature
     * @return {void}
     */
    run: function() {
      var self = this;

      self.$searchInput.keyup(function() {
        self.filter(self.sliceDate(self.getSearch()));
      });

      // Block submit action
      self.$form.submit(function(e) {
        e.preventDefault();
      });
    },

    /**
     * Get Filter entered by user
     * @returns {String} The date entered by the user
     */
    getSearch: function() {
      return this.$searchInput.val().replace(/([\/|.|-])/g, '').toLowerCase();
    },

    /**
     * Slice the date by year, month and day
     * @param {String} date - The date of the post
     * @returns {Array} The date of the post splitted in a list
     */
    sliceDate: function(date) {
      return [
        date.slice(0, 4),
        date.slice(4, 6),
        date.slice(6)
      ];
    },

    /**
     * Show related posts and hide others
     * @param {String} date - The date of the post
     * @returns {void}
     */
    filter: function(date) {
      var numberPosts;

      // Check if the search is empty
      if (date[0] === '') {
        this.showAll();
        this.showResult(-1);
      }
      else {
        numberPosts = this.countPosts(date);

        this.hideAll();
        this.showResult(numberPosts);

        if (numberPosts > 0) {
          this.showPosts(date);
        }
      }
    },

    /**
     * Display results
     * @param {Number} numbPosts - The number of posts found
     * @returns {void}
     */
    showResult: function(numbPosts) {
      if (numbPosts === -1) {
        this.$archiveResult.html('').hide();
      }
      else if (numbPosts === 0) {
        this.$archiveResult.html(this.messages.zero).show();
      }
      else if (numbPosts === 1) {
        this.$archiveResult.html(this.messages.one).show();
      }
      else {
        this.$archiveResult.html(this.messages.other.replace(/\{n\}/, numbPosts)).show();
      }
    },

    /**
     * Count number of posts
     * @param {String} date - The date of the post
     * @returns {Number} The number of posts found
     */
    countPosts: function(date) {
      return $(this.postsDay + '[data-date^=' + date[0] + date[1] + date[2] + ']').length;
    },

    /**
     * Show all posts from a date
     * @param {String} date - The date of the post
     * @returns {void}
     */
    showPosts: function(date) {
      $(this.postsYear + '[data-date^=' + date[0] + ']').show();
      $(this.postsMonth + '[data-date^=' + date[0] + date[1] + ']').show();
      $(this.postsDay + '[data-date^=' + date[0] + date[1] + date[2] + ']').show();
    },

    /**
     * Show all posts
     * @returns {void}
     */
    showAll: function() {
      this.$postsYear.show();
      this.$postsMonth.show();
      this.$postsDay.show();
    },

    /**
     * Hide all posts
     * @returns {void}
     */
    hideAll: function() {
      this.$postsYear.hide();
      this.$postsMonth.hide();
      this.$postsDay.hide();
    }
  };

  $(document).ready(function() {
    if ($('#archives').length) {
      var archivesFilter = new ArchivesFilter('#archives');
      archivesFilter.run();
    }
  });
})(jQuery);
;(function($) {
  'use strict';

  // Filter posts by using their categories on categories page : `/categories`

  /**
   * CategoriesFilter
   * @param {String} categoriesArchivesElem
   * @constructor
   */
  var CategoriesFilter = function(categoriesArchivesElem) {
    this.$form = $(categoriesArchivesElem).find('#filter-form');
    this.$inputSearch = $(categoriesArchivesElem).find('input[name=category]');
    // Element where result of the filter are displayed
    this.$archiveResult = $(categoriesArchivesElem).find('.archive-result');
    this.$posts = $(categoriesArchivesElem).find('.archive');
    this.$categories = $(categoriesArchivesElem).find('.category-anchor');
    this.posts = categoriesArchivesElem + ' .archive';
    this.categories = categoriesArchivesElem + ' .category-anchor';
    // Html data attribute without `data-` of `.archive` element
    // which contains the name of category
    this.dataCategory = 'category';
    // Html data attribute without `data-` of `.archive` element
    // which contains the name of parent's categories
    this.dataParentCategories = 'parent-categories';
    this.messages = {
      zero: this.$archiveResult.data('message-zero'),
      one: this.$archiveResult.data('message-one'),
      other: this.$archiveResult.data('message-other')
    };
  };

  CategoriesFilter.prototype = {

    /**
     * Run CategoriesFilter feature
     * @return {void}
     */
    run: function() {
      var self = this;

      self.$inputSearch.keyup(function() {
        self.filter(self.getSearch());
      });

      // Block submit action
      self.$form.submit(function(e) {
        e.preventDefault();
      });
    },

    /**
     * Get the search entered by user
     * @returns {String} The name of the category
     */
    getSearch: function() {
      return this.$inputSearch.val().toLowerCase();
    },

    /**
     * Show related posts form a category and hide the others
     * @param {string} category - The name of the category
     * @return {void}
     */
    filter: function(category) {
      if (category === '') {
        this.showAll();
        this.showResult(-1);
      }
      else {
        this.hideAll();
        this.showPosts(category);
        this.showResult(this.countCategories(category));
      }
    },

    /**
     * Display results of the search
     * @param {Number} numbCategories - The number of categories found
     * @return {void}
     */
    showResult: function(numbCategories) {
      if (numbCategories === -1) {
        this.$archiveResult.html('').hide();
      }
      else if (numbCategories === 0) {
        this.$archiveResult.html(this.messages.zero).show();
      }
      else if (numbCategories === 1) {
        this.$archiveResult.html(this.messages.one).show();
      }
      else {
        this.$archiveResult.html(this.messages.other.replace(/\{n\}/, numbCategories)).show();
      }
    },

    /**
     * Count number of categories
     * @param {String} category - The name of theThe date of the post category
     * @returns {Number} The number of categories found
     */
    countCategories: function(category) {
      return $(this.posts + '[data-' + this.dataCategory + '*=\'' + category + '\']').length;
    },

    /**
     * Show all posts from a category
     * @param {String} category - The name of the category
     * @return {void}
     */
    showPosts: function(category) {
      var self = this;
      var parents;
      var categories = self.categories + '[data-' + self.dataCategory + '*=\'' + category + '\']';
      var posts = self.posts + '[data-' + self.dataCategory + '*=\'' + category + '\']';

      if (self.countCategories(category) > 0) {
        // Check if selected categories have parents
        if ($(categories + '[data-' + self.dataParentCategories + ']').length) {
          // Get all categories that matches search
          $(categories).each(function() {
            // Get all its parents categories name
            parents = $(this).attr('data-' + self.dataParentCategories).split(',');
            // Show only the title of the parents's categories and hide their posts
            parents.forEach(function(parent) {
              var dataAttr = '[data-' + self.dataCategory + '=\'' + parent + '\']';
              $(self.categories + dataAttr).show();
              $(self.posts + dataAttr).show();
              $(self.posts + dataAttr + ' > .archive-posts > .archive-post').hide();
            });
          });
        }
      }
      // Show categories and related posts found
      $(categories).show();
      $(posts).show();
      $(posts + ' > .archive-posts > .archive-post').show();
    },

    /**
     * Show all categories and all posts
     * @return {void}
     */
    showAll: function() {
      this.$categories.show();
      this.$posts.show();
      $(this.posts + ' > .archive-posts > .archive-post').show();
    },

    /**
     * Hide all categories and all posts
     * @return {void}
     */
    hideAll: function() {
      this.$categories.hide();
      this.$posts.hide();
    }
  };

  $(document).ready(function() {
    if ($('#categories-archives').length) {
      var categoriesFilter = new CategoriesFilter('#categories-archives');
      categoriesFilter.run();
    }
  });
})(jQuery);
;(function($) {
  'use strict';

  // Resize code blocks to fit the screen width

  /**
   * Code block resizer
   * @param {String} elem
   * @constructor
   */
  var CodeBlockResizer = function(elem) {
    this.$codeBlocks = $(elem);
  };

  CodeBlockResizer.prototype = {
    /**
     * Run main feature
     * @return {void}
     */
    run: function() {
      var self = this;
      // resize all codeblocks
      self.resize();
      // resize codeblocks when window is resized
      $(window).smartresize(function() {
        self.resize();
      });
    },

    /**
     * Resize codeblocks
     * @return {void}
     */
    resize: function() {
      var self = this;
      self.$codeBlocks.each(function() {
        var $gutter = $(this).find('.gutter');
        var $code = $(this).find('.code');
        // get padding of code div
        var codePaddings = $code.width() - $code.innerWidth();
        // code block div width with padding - gutter div with padding + code div padding
        var width = $(this).outerWidth() - $gutter.outerWidth() + codePaddings;
        // apply new width
        $code.css('width', width);
        $code.children('pre').css('width', width);
      });
    }
  };

  $(document).ready(function() {
    // register jQuery function to check if an element has an horizontal scroll bar
    $.fn.hasHorizontalScrollBar = function() {
      return this.get(0).scrollWidth > this.innerWidth();
    };
    var resizer = new CodeBlockResizer('figure.highlight');
    resizer.run();
  });
})(jQuery);
;(function($) {
  'use strict';

  // Run fancybox feature

  $(document).ready(function() {
    /**
     * Configure and run Fancybox plugin
     * @returns {void}
     */
    function fancyFox() {
      var thumbs = false;

      // disable navigation arrows and display thumbs on medium and large screens
      if ($(window).height() > 480) {
        thumbs = true;
      }

      $('.fancybox').fancybox({
        buttons: [
          'fullScreen',
          'thumbs',
          'share',
          'download',
          'zoom',
          'close'
        ],
        thumbs: {
          autoStart: thumbs,
          axis: 'x'
        }
      });
    }

    fancyFox();

    $(window).smartresize(function() {
      fancyFox();
    });
  });
})(jQuery);
;(function($) {
  'use strict';

  // Hide the header when the user scrolls down, and show it when he scrolls up

  /**
   * Header
   * @constructor
   */
  var Header = function() {
    this.$header = $('#header');
    this.headerHeight = this.$header.height();
    // CSS class located in `source/_css/layout/_header.scss`
    this.headerUpCSSClass = 'header-up';
    this.delta = 15;
    this.lastScrollTop = 0;
  };

  Header.prototype = {

    /**
     * Run Header feature
     * @return {void}
     */
    run: function() {
      var self = this;
      var didScroll;

      // Detect if the user is scrolling
      $(window).scroll(function() {
        didScroll = true;
      });

      // Check if the user scrolled every 250 milliseconds
      setInterval(function() {
        if (didScroll) {
          self.animate();
          didScroll = false;
        }
      }, 250);
    },

    /**
     * Animate the header
     * @return {void}
     */
    animate: function() {
      var scrollTop = $(window).scrollTop();

      // Check if the user scrolled more than `delta`
      if (Math.abs(this.lastScrollTop - scrollTop) <= this.delta) {
        return;
      }

      // Checks if the user has scrolled enough down and has past the navbar
      if ((scrollTop > this.lastScrollTop) && (scrollTop > this.headerHeight)) {
        this.$header.addClass(this.headerUpCSSClass);
      }
      else if (scrollTop + $(window).height() < $(document).height()) {
        this.$header.removeClass(this.headerUpCSSClass);
      }

      this.lastScrollTop = scrollTop;
    }
  };

  $(document).ready(function() {
    var header = new Header();
    header.run();
  });
})(jQuery);
;(function($) {
  'use strict';

  // Resize all images of an image-gallery

  /**
   * ImageGallery
   * @constructor
   */
  var ImageGallery = function() {
    // CSS class located in `source/_css/components/_image-gallery.scss`
    this.photosBox = '.photo-box';
    this.$images = $(this.photosBox + ' img');
  };
  ImageGallery.prototype = {

    /**
     * Run ImageGallery feature
     * @return {void}
     */
    run: function() {
      var self = this;

      // Resize all images at the loading of the page
      self.resizeImages();

      // Resize all images when the user is resizing the page
      $(window).smartresize(function() {
        self.resizeImages();
      });
    },

    /**
     * Resize all images of an image gallery
     * @return {void}
     */
    resizeImages: function() {
      var photoBoxWidth;
      var photoBoxHeight;
      var imageWidth;
      var imageHeight;
      var imageRatio;
      var $image;

      this.$images.each(function() {
        $image = $(this);
        photoBoxWidth = $image.parent().parent().width();
        photoBoxHeight = $image.parent().parent().innerHeight();
        imageWidth = $image.width();
        imageHeight = $image.height();

        // Checks if image height is smaller than his box
        if (imageHeight < photoBoxHeight) {
          imageRatio = (imageWidth / imageHeight);
          // Resize image with the box height
          $image.css({
            height: photoBoxHeight,
            width: (photoBoxHeight * imageRatio)
          });
          // Center image in his box
          $image.parent().css({
            left: '-' + (((photoBoxHeight * imageRatio) / 2) - (photoBoxWidth / 2)) + 'px'
          });
        }

        // Update new values of height and width
        imageWidth = $image.width();
        imageHeight = $image.height();

        // Checks if image width is smaller than his box
        if (imageWidth < photoBoxWidth) {
          imageRatio = (imageHeight / imageWidth);

          $image.css({
            width: photoBoxWidth,
            height: (photoBoxWidth * imageRatio)
          });
          // Center image in his box
          $image.parent().css({
            top: '-' + (((imageHeight) / 2) - (photoBoxHeight / 2)) + 'px'
          });
        }

        // Checks if image height is larger than his box
        if (imageHeight > photoBoxHeight) {
          // Center image in his box
          $image.parent().css({
            top: '-' + (((imageHeight) / 2) - (photoBoxHeight / 2)) + 'px'
          });
        }
      });
    }
  };

  $(document).ready(function() {
    if ($('.image-gallery').length) {
      var imageGallery = new ImageGallery();

      // Small timeout to wait the loading of all images.
      setTimeout(function() {
        imageGallery.run();
      }, 500);
    }
  });
})(jQuery);
;(function($) {
  'use strict';

  // Hide the post bottom bar when the post footer is visible by the user,
  // and show it when the post footer isn't visible by the user

  /**
   * PostBottomBar
   * @constructor
   */
  var PostBottomBar = function() {
    this.$postBottomBar = $('.post-bottom-bar');
    this.$postFooter = $('.post-actions-wrap');
    this.$header = $('#header');
    this.delta = 15;
    this.lastScrollTop = 0;
    this.lastScrollDownPos = 0;
    this.lastScrollUpPos = 0;
  };

  PostBottomBar.prototype = {

    /**
     * Run PostBottomBar feature
     * @return {void}
     */
    run: function() {
      var self = this;
      var didScroll;
      // Run animation for first time
      self.swipePostBottomBar();
      // Detects if the user is scrolling
      $(window).scroll(function() {
        didScroll = true;
      });
      // Check if the user scrolled every 250 milliseconds
      setInterval(function() {
        if (didScroll) {
          self.swipePostBottomBar();
          didScroll = false;
        }
      }, 250);
    },

    /**
     * Swipe the post bottom bar
     * @return {void}
     */
    swipePostBottomBar: function() {
      var scrollTop = $(window).scrollTop();
      var postFooterOffsetTop = this.$postFooter.offset().top;

      // scrolling up
      if (this.lastScrollTop > scrollTop) {
        // show bottom bar
        // if the user scrolled upwards more than `delta`
        // and `post-footer` div isn't visible
        if (Math.abs(this.lastScrollDownPos - scrollTop) > this.delta &&
          (postFooterOffsetTop + this.$postFooter.height() > scrollTop + $(window).height() ||
            postFooterOffsetTop < scrollTop + this.$header.height())) {
          this.$postBottomBar.slideDown();
          this.lastScrollUpPos = scrollTop;
        }
      }

      // scrolling down
      if (scrollTop > this.lastScrollUpPos + this.delta) {
        this.$postBottomBar.slideUp();
        this.lastScrollDownPos = scrollTop;
      }

      this.lastScrollTop = scrollTop;
    }
  };

  $(document).ready(function() {
    if ($('.post-bottom-bar').length) {
      var postBottomBar = new PostBottomBar();
      postBottomBar.run();
    }
  });
})(jQuery);
;(function($) {
  'use strict';

  /**
   * Search modal with Algolia
   * @constructor
   */
  var SearchModal = function() {
    this.$openButton = $('.open-algolia-search');
    this.$searchModal = $('#algolia-search-modal');
    this.$closeButton = this.$searchModal.find('.close-button');
    this.$searchForm = $('#algolia-search-form');
    this.$searchInput = $('#algolia-search-input');
    this.$results = this.$searchModal.find('.results');
    this.$noResults = this.$searchModal.find('.no-result');
    this.$resultsCount = this.$searchModal.find('.results-count');
    this.algolia = algoliaIndex;
  };

  SearchModal.prototype = {
    /**
     * Run feature
     * @returns {void}
     */
    run: function() {
      var self = this;

      // open modal when open button is clicked
      self.$openButton.click(function() {
        self.open();
      });

      // open modal when `s` button is pressed
      $(document).keyup(function(event) {
        var target = event.target || event.srcElement;
        // exit if user is focusing an input or textarea
        var tagName = target.tagName.toUpperCase();
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
          return;
        }

        if (event.keyCode === 83 && !self.$searchModal.is(':visible')) {
          self.open();
        }
      });

      // close button when overlay is clicked
      self.$searchModal.click(function(e) {
        if (e.target === this) {
          self.close();
        }
      });

      // close modal when close button is clicked
      self.$closeButton.click(function() {
        self.close();
      });

      // close modal when `ESC` button is pressed
      $(document).keyup(function(e) {
        if (e.keyCode === 27 && self.$searchModal.is(':visible')) {
          self.close();
        }
      });

      // send search when form is submitted
      self.$searchForm.submit(function(event) {
        event.preventDefault();
        self.search(self.$searchInput.val());
      });
    },

    /**
     * Open search modal and display overlay
     * @returns {void}
     */
    open: function() {
      this.showSearchModal();
      this.showOverlay();
      this.$searchInput.focus();
    },

    /**
     * Close search modal and overlay
     * @returns {void}
     */
    close: function() {
      this.hideSearchModal();
      this.hideOverlay();
      this.$searchInput.blur();
    },

    /**
     * Search with Algolia API and display results
     * @param {String} search
     * @returns {void}
     */
    search: function(search) {
      var self = this;
      this.algolia.search(search, function(err, content) {
        if (!err) {
          self.showResults(content.hits);
          self.showResultsCount(content.nbHits);
        }
      });
    },

    /**
     * Display results
     * @param {Array} posts
     * @returns {void}
     */
    showResults: function(posts) {
      var html = '';
      posts.forEach(function(post) {
        var lang = window.navigator.userLanguage || window.navigator.language || post.lang;

        html += '<div class="media">';
        if (post.thumbnailImageUrl) {
          html += '<div class="media-left">';
          html += '<a class="link-unstyled" href="' + (post.link || post.permalink) + '">';
          html += '<img class="media-image" ' +
            'src="' + post.thumbnailImageUrl + '" ' +
            'width="90" height="90"/>';
          html += '</a>';
          html += '</div>';
        }

        html += '<div class="media-body">';
        html += '<a class="link-unstyled" href="' + (post.link || post.permalink) + '">';
        html += '<h3 class="media-heading">' + post.title + '</h3>';
        html += '</a>';
        html += '<span class="media-meta">';
        html += '<span class="media-date text-small">';
        html += moment(post.date).locale(lang).format('ll');
        html += '</span>';
        html += '</span>';
        html += '<div class="media-content hide-xs font-merryweather">' + post.excerpt + '</div>';
        html += '</div>';
        html += '<div style="clear:both;"></div>';
        html += '<hr>';
        html += '</div>';
      });
      this.$results.html(html);
    },

    /**
     * Show search modal
     * @returns {void}
     */
    showSearchModal: function() {
      this.$searchModal.fadeIn();
    },

    /**
     * Hide search modal
     * @returns {void}
     */
    hideSearchModal: function() {
      this.$searchModal.fadeOut();
    },

    /**
     * Display messages and counts of results
     * @param {Number} count
     * @returns {void}
     */
    showResultsCount: function(count) {
      var string = '';
      if (count < 1) {
        string = this.$resultsCount.data('message-zero');
        this.$noResults.show();
      }
      else if (count === 1) {
        string = this.$resultsCount.data('message-one');
        this.$noResults.hide();
      }
      else if (count > 1) {
        string = this.$resultsCount.data('message-other').replace(/\{n\}/, count);
        this.$noResults.hide();
      }
      this.$resultsCount.html(string);
    },

    /**
     * Show overlay
     * @returns {void}
     */
    showOverlay: function() {
      $('body').append('<div class="overlay"></div>');
      $('.overlay').fadeIn();
      $('body').css('overflow', 'hidden');
    },

    /**
     * Hide overlay
     * @returns {void}
     */
    hideOverlay: function() {
      $('.overlay').fadeOut(function() {
        $(this).remove();
        $('body').css('overflow', 'auto');
      });
    }
  };

  $(document).ready(function() {
    // launch feature only if there is an Algolia index available
    if (typeof algoliaIndex !== 'undefined') {
      var searchModal = new SearchModal();
      searchModal.run();
    }
  });
})(jQuery);
;(function($) {
  'use strict';
  
  // Open and close the share options bar
  
  /**
   * ShareOptionsBar
   * @constructor
   */
  var ShareOptionsBar = function() {
    this.$shareOptionsBar = $('#share-options-bar');
    this.$openBtn = $('.btn-open-shareoptions');
    this.$closeBtn = $('#btn-close-shareoptions');
    this.$body = $('body');
  };
  
  ShareOptionsBar.prototype = {
    
    /**
     * Run ShareOptionsBar feature
     * @return {void}
     */
    run: function() {
      var self = this;
      
      // Detect the click on the open button
      self.$openBtn.click(function() {
        if (!self.$shareOptionsBar.hasClass('opened')) {
          self.openShareOptions();
          self.$closeBtn.show();
        }
      });
      
      // Detect the click on the close button
      self.$closeBtn.click(function() {
        if (self.$shareOptionsBar.hasClass('opened')) {
          self.closeShareOptions();
          self.$closeBtn.hide();
        }
      });
    },
    
    /**
     * Open share options bar
     * @return {void}
     */
    openShareOptions: function() {
      var self = this;
      
      // Check if the share option bar isn't opened
      // and prevent multiple click on the open button with `.processing` class
      if (!self.$shareOptionsBar.hasClass('opened') &&
        !this.$shareOptionsBar.hasClass('processing')) {
        // Open the share option bar
        self.$shareOptionsBar.addClass('processing opened');
        self.$body.css('overflow', 'hidden');
        
        setTimeout(function() {
          self.$shareOptionsBar.removeClass('processing');
        }, 250);
      }
    },
    
    /**
     * Close share options bar
     * @return {void}
     */
    closeShareOptions: function() {
      var self = this;
      
      // Check if the share options bar is opened
      // and prevent multiple click on the close button with `.processing` class
      if (self.$shareOptionsBar.hasClass('opened') &&
        !this.$shareOptionsBar.hasClass('processing')) {
        // Close the share option bar
        self.$shareOptionsBar.addClass('processing').removeClass('opened');
        
        setTimeout(function() {
          self.$shareOptionsBar.removeClass('processing');
          self.$body.css('overflow', '');
        }, 250);
      }
    }
  };
  
  $(document).ready(function() {
    var shareOptionsBar = new ShareOptionsBar();
    shareOptionsBar.run();
  });
})(jQuery);
;(function($) {
  'use strict';

  // Open and close the sidebar by swiping the sidebar and the blog and vice versa

  /**
   * Sidebar
   * @constructor
   */
  var Sidebar = function() {
    this.$sidebar = $('#sidebar');
    this.$openBtn = $('#btn-open-sidebar');
    // Elements where the user can click to close the sidebar
    this.$closeBtn = $('#header, #main, .post-header-cover');
    // Elements affected by the swipe of the sidebar
    // The `pushed` class is added to each elements
    // Each element has a different behavior when the sidebar is opened
    this.$blog = $('.post-bottom-bar, #header, #main, .post-header-cover');
    // If you change value of `mediumScreenWidth`,
    // you have to change value of `$screen-min: (md-min)` too
    // in `source/_css/utils/variables.scss`
    this.$body = $('body');
    this.mediumScreenWidth = 768;
  };

  Sidebar.prototype = {
    /**
     * Run Sidebar feature
     * @return {void}
     */
    run: function() {
      var self = this;
      // Detect the click on the open button
      this.$openBtn.click(function() {
        if (!self.$sidebar.hasClass('pushed')) {
          self.openSidebar();
        }
      });
      // Detect the click on close button
      this.$closeBtn.click(function() {
        if (self.$sidebar.hasClass('pushed')) {
          self.closeSidebar();
        }
      });
      // Detect resize of the windows
      $(window).resize(function() {
        // Check if the window is larger than the minimal medium screen value
        if ($(window).width() > self.mediumScreenWidth) {
          self.resetSidebarPosition();
          self.resetBlogPosition();
        }
        else {
          self.closeSidebar();
        }
      });
    },

    /**
     * Open the sidebar by swiping to the right the sidebar and the blog
     * @return {void}
     */
    openSidebar: function() {
      this.swipeBlogToRight();
      this.swipeSidebarToRight();
    },

    /**
     * Close the sidebar by swiping to the left the sidebar and the blog
     * @return {void}
     */
    closeSidebar: function() {
      this.swipeSidebarToLeft();
      this.swipeBlogToLeft();
    },

    /**
     * Reset sidebar position
     * @return {void}
     */
    resetSidebarPosition: function() {
      this.$sidebar.removeClass('pushed');
    },

    /**
     * Reset blog position
     * @return {void}
     */
    resetBlogPosition: function() {
      this.$blog.removeClass('pushed');
    },

    /**
     * Swipe the sidebar to the right
     * @return {void}
     */
    swipeSidebarToRight: function() {
      var self = this;
      // Check if the sidebar isn't swiped
      // and prevent multiple click on the open button with `.processing` class
      if (!this.$sidebar.hasClass('pushed') && !this.$sidebar.hasClass('processing')) {
        // Swipe the sidebar to the right
        this.$sidebar.addClass('processing pushed');
        // add overflow on body to remove horizontal scroll
        this.$body.css('overflow-x', 'hidden');
        setTimeout(function() {
          self.$sidebar.removeClass('processing');
        }, 250);
      }
    },

    /**
     * Swipe the sidebar to the left
     * @return {void}
     */
    swipeSidebarToLeft: function() {
      // Check if the sidebar is swiped
      // and prevent multiple click on the close button with `.processing` class
      if (this.$sidebar.hasClass('pushed') && !this.$sidebar.hasClass('processing')) {
        // Swipe the sidebar to the left
        this.$sidebar.addClass('processing').removeClass('pushed processing');
        // go back to the default overflow
        this.$body.css('overflow-x', 'auto');
      }
    },

    /**
     * Swipe the blog to the right
     * @return {void}
     */
    swipeBlogToRight: function() {
      var self = this;
      // Check if the blog isn't swiped
      // and prevent multiple click on the open button with `.processing` class
      if (!this.$blog.hasClass('pushed') && !this.$blog.hasClass('processing')) {
        // Swipe the blog to the right
        this.$blog.addClass('processing pushed');

        setTimeout(function() {
          self.$blog.removeClass('processing');
        }, 250);
      }
    },

    /**
     * Swipe the blog to the left
     * @return {void}
     */
    swipeBlogToLeft: function() {
      var self = this;
      // Check if the blog is swiped
      // and prevent multiple click on the close button with `.processing` class
      if (self.$blog.hasClass('pushed') && !this.$blog.hasClass('processing')) {
        // Swipe the blog to the left
        self.$blog.addClass('processing').removeClass('pushed');

        setTimeout(function() {
          self.$blog.removeClass('processing');
        }, 250);
      }
    }
  };

  $(document).ready(function() {
    var sidebar = new Sidebar();
    sidebar.run();
  });
})(jQuery);
;(function($, sr) {
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function(func, threshold, execAsap) {
    var timeout;

    return function debounced() {
      var obj = this;
      var args = arguments;

      function delayed() {
        if (!execAsap) {
          func.apply(obj, args);
        }

        timeout = null;
      }

      if (timeout) {
        clearTimeout(timeout);
      }
      else if (execAsap) {
        func.apply(obj, args);
      }

      timeout = setTimeout(delayed, threshold || 100);
    };
  };

  jQuery.fn[sr] = function(fn) {
    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
  };
})(jQuery, 'smartresize');
;(function($) {
  'use strict';

  // Animate tabs of tabbed code blocks

  /**
   * TabbedCodeBlock
   * @param {String} elems
   * @constructor
   */
  var TabbedCodeBlock = function(elems) {
    this.$tabbedCodeBlocs = $(elems);
  };

  TabbedCodeBlock.prototype = {
    /**
     * Run TabbedCodeBlock feature
     * @return {void}
     */
    run: function() {
      var self = this;
      self.$tabbedCodeBlocs.find('.tab').click(function() {
        var $codeblock = $(this).parent().parent().parent();
        var $tabsContent = $codeblock.find('.tabs-content').children('pre, .highlight');
        // remove `active` css class on all tabs
        $(this).siblings().removeClass('active');
        // add `active` css class on the clicked tab
        $(this).addClass('active');
        // hide all tab contents
        $tabsContent.hide();
        // show only the right one
        $tabsContent.eq($(this).index()).show();
      });
    }
  };

  $(document).ready(function() {
    var tabbedCodeBlocks = new TabbedCodeBlock('.codeblock--tabbed');
    tabbedCodeBlocks.run();
  });
})(jQuery);
;(function($) {
  'use strict';

  // Filter posts by using their categories on categories page : `/categories`

  /**
   * TagsFilter
   * @param {String} tagsArchivesElem
   * @constructor
   */
  var TagsFilter = function(tagsArchivesElem) {
    this.$form = $(tagsArchivesElem).find('#filter-form');
    this.$inputSearch = $(tagsArchivesElem + ' #filter-form input[name=tag]');
    this.$archiveResult = $(tagsArchivesElem).find('.archive-result');
    this.$tags = $(tagsArchivesElem).find('.tag');
    this.$posts = $(tagsArchivesElem).find('.archive');
    this.tags = tagsArchivesElem + ' .tag';
    this.posts = tagsArchivesElem + ' .archive';
    // Html data attribute without `data-` of `.archive` element which contains the name of tag
    this.dataTag = 'tag';
    this.messages = {
      zero: this.$archiveResult.data('message-zero'),
      one: this.$archiveResult.data('message-one'),
      other: this.$archiveResult.data('message-other')
    };
  };

  TagsFilter.prototype = {
    /**
     * Run TagsFilter feature
     * @return {void}
     */
    run: function() {
      var self = this;

      // Detect keystroke of the user
      self.$inputSearch.keyup(function() {
        self.filter(self.getSearch());
      });

      // Block submit action
      self.$form.submit(function(e) {
        e.preventDefault();
      });
    },

    /**
     * Get the search entered by user
     * @returns {String} the name of tag entered by the user
     */
    getSearch: function() {
      return this.$inputSearch.val().toLowerCase();
    },

    /**
     * Show related posts form a tag and hide the others
     * @param {String} tag - name of a tag
     * @return {void}
     */
    filter: function(tag) {
      if (tag === '') {
        this.showAll();
        this.showResult(-1);
      }
      else {
        this.hideAll();
        this.showPosts(tag);
        this.showResult(this.countTags(tag));
      }
    },

    /**
     * Display results of the search
     * @param {Number} numbTags - Number of tags found
     * @return {void}
     */
    showResult: function(numbTags) {
      if (numbTags === -1) {
        this.$archiveResult.html('').hide();
      }
      else if (numbTags === 0) {
        this.$archiveResult.html(this.messages.zero).show();
      }
      else if (numbTags === 1) {
        this.$archiveResult.html(this.messages.one).show();
      }
      else {
        this.$archiveResult.html(this.messages.other.replace(/\{n\}/, numbTags)).show();
      }
    },

    /**
     * Count number of tags
     * @param {String} tag
     * @returns {Number}
     */
    countTags: function(tag) {
      return $(this.posts + '[data-' + this.dataTag + '*=\'' + tag + '\']').length;
    },

    /**
     * Show all posts from a tag
     * @param {String} tag - name of a tag
     * @return {void}
     */
    showPosts: function(tag) {
      $(this.tags + '[data-' + this.dataTag + '*=\'' + tag + '\']').show();
      $(this.posts + '[data-' + this.dataTag + '*=\'' + tag + '\']').show();
    },

    /**
     * Show all tags and all posts
     * @return {void}
     */
    showAll: function() {
      this.$tags.show();
      this.$posts.show();
    },

    /**
     * Hide all tags and all posts
     * @return {void}
     */
    hideAll: function() {
      this.$tags.hide();
      this.$posts.hide();
    }
  };

  $(document).ready(function() {
    if ($('#tags-archives').length) {
      var tagsFilter = new TagsFilter('#tags-archives');
      tagsFilter.run();
    }
  });
})(jQuery);
;!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Valine",[],t):"object"==typeof exports?exports.Valine=t():e.Valine=t()}(window,function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=12)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=["(⌒▽⌒)","（￣▽￣）","(=・ω・=)","(｀・ω・´)","(〜￣△￣)〜","(･∀･)","(°∀°)ﾉ","(￣3￣)","╮(￣▽￣)╭","_(:3」∠)_","( ´_ゝ｀)","←_←","→_→","(&lt;_&lt;)","(&gt;_&gt;)","(;¬_¬)",'("▔□▔)/',"(ﾟДﾟ≡ﾟдﾟ)!?","Σ(ﾟдﾟ;)","Σ( ￣□￣||)","(´；ω；`)","（/TДT)/","(^・ω・^ )","(｡･ω･｡)","(●￣(ｴ)￣●)","ε=ε=(ノ≧∇≦)ノ","(´･_･`)","(-_-#)","（￣へ￣）","(￣ε(#￣) Σ","ヽ(`Д´)ﾉ","（#-_-)┯━┯","(╯°口°)╯(┴—┴","←◡←","( ♥д♥)","Σ&gt;―(〃°ω°〃)♡→","⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄","(╬ﾟдﾟ)▄︻┻┳═一","･*･:≡(　ε:)","(汗)","(苦笑)"]},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e,t){for(var r=e.toString();r.length<t;)r="0"+r;return r},a=function(e){var t=n(e.getDate(),2),r=n(e.getMonth()+1,2);return n(e.getFullYear(),2)+"-"+r+"-"+t},i={on:function(e,t,r){var n=arguments.length>3&&void 0!==arguments[3]&&arguments[3];t.addEventListener?t.addEventListener(e,r,n):t.attachEvent?t.attachEvent("on"+e,r):t["on"+e]=r},off:function(e,t,r){var n=arguments.length>3&&void 0!==arguments[3]&&arguments[3];t.removeEventListener?t.removeEventListener(e,r,n):t.detachEvent?t.detachEvent("on"+e,r):t["on"+e]=null}},o=document.createElement("div");t.dateFormat=a,t.timeAgo=function(e){var t=e.getTime(),r=(new Date).getTime()-t,n=Math.floor(r/864e5);if(0===n){var i=r%864e5,o=Math.floor(i/36e5);if(0===o){var s=i%36e5,l=Math.floor(s/6e4);if(0===l){var c=s%6e4;return Math.round(c/1e3)+" 秒前"}return l+" 分钟前"}return o+" 小时前"}return n<0?"刚刚":n<8?n+" 天前":a(e)},t.getLink=function(e){return e||"javascript:void(0);"},t.Checker={mail:function(e){return{k:/[\w-\.]+@([\w-]+\.)+[a-z]{2,3}/.test(e),v:e}},link:function(e){return e=e.length>0&&(/^(http|https)/.test(e)?e:"http://"+e),{k:/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(e),v:e}}},t.padWithZeros=n,t.Event=i,t.encodeHTML=function(e){return o.innerText=e,o.innerHTML},t.decodeHTML=function(e){return o.innerHTML=e,o.innerText}},function(e,t,r){"use strict";var n=window||{},a=navigator||{};e.exports=function(e){return new function(e){var t=e||a.userAgent,r={Trident:t.indexOf("Trident")>-1||t.indexOf("NET CLR")>-1,Presto:t.indexOf("Presto")>-1,WebKit:t.indexOf("AppleWebKit")>-1,Gecko:t.indexOf("Gecko/")>-1,Safari:t.indexOf("Safari")>-1,Chrome:t.indexOf("Chrome")>-1||t.indexOf("CriOS")>-1,IE:t.indexOf("MSIE")>-1||t.indexOf("Trident")>-1,Edge:t.indexOf("Edge")>-1,Firefox:t.indexOf("Firefox")>-1||t.indexOf("FxiOS")>-1,"Firefox Focus":t.indexOf("Focus")>-1,Chromium:t.indexOf("Chromium")>-1,Opera:t.indexOf("Opera")>-1||t.indexOf("OPR")>-1,Vivaldi:t.indexOf("Vivaldi")>-1,Yandex:t.indexOf("YaBrowser")>-1,Kindle:t.indexOf("Kindle")>-1||t.indexOf("Silk/")>-1,360:t.indexOf("360EE")>-1||t.indexOf("360SE")>-1,UC:t.indexOf("UC")>-1||t.indexOf(" UBrowser")>-1,QQBrowser:t.indexOf("QQBrowser")>-1,QQ:t.indexOf("QQ/")>-1,Baidu:t.indexOf("Baidu")>-1||t.indexOf("BIDUBrowser")>-1,Maxthon:t.indexOf("Maxthon")>-1,Sogou:t.indexOf("MetaSr")>-1||t.indexOf("Sogou")>-1,LBBROWSER:t.indexOf("LBBROWSER")>-1,"2345Explorer":t.indexOf("2345Explorer")>-1,TheWorld:t.indexOf("TheWorld")>-1,XiaoMi:t.indexOf("MiuiBrowser")>-1,Quark:t.indexOf("Quark")>-1,Qiyu:t.indexOf("Qiyu")>-1,Wechat:t.indexOf("MicroMessenger")>-1,Taobao:t.indexOf("AliApp(TB")>-1,Alipay:t.indexOf("AliApp(AP")>-1,Weibo:t.indexOf("Weibo")>-1,Douban:t.indexOf("com.douban.frodo")>-1,Suning:t.indexOf("SNEBUY-APP")>-1,iQiYi:t.indexOf("IqiyiApp")>-1,Windows:t.indexOf("Windows")>-1,Linux:t.indexOf("Linux")>-1||t.indexOf("X11")>-1,"Mac OS":t.indexOf("Macintosh")>-1,Android:t.indexOf("Android")>-1||t.indexOf("Adr")>-1,Ubuntu:t.indexOf("Ubuntu")>-1,FreeBSD:t.indexOf("FreeBSD")>-1,Debian:t.indexOf("Debian")>-1,"Windows Phone":t.indexOf("IEMobile")>-1||t.indexOf("Windows Phone")>-1,BlackBerry:t.indexOf("BlackBerry")>-1||t.indexOf("RIM")>-1,MeeGo:t.indexOf("MeeGo")>-1,Symbian:t.indexOf("Symbian")>-1,iOS:t.indexOf("like Mac OS X")>-1,"Chrome OS":t.indexOf("CrOS")>-1,WebOS:t.indexOf("hpwOS")>-1,Mobile:t.indexOf("Mobi")>-1||t.indexOf("iPh")>-1||t.indexOf("480")>-1,Tablet:t.indexOf("Tablet")>-1||t.indexOf("Pad")>-1||t.indexOf("Nexus 7")>-1};r.Mobile?r.Mobile=!(t.indexOf("iPad")>-1):n.showModalDialog&&n.chrome&&(r[360]=!0);var i,o={engine:["WebKit","Trident","Gecko","Presto"],browser:["Safari","Chrome","Edge","IE","Firefox","Firefox Focus","Chromium","Opera","Vivaldi","Yandex","Kindle","360","UC","QQBrowser","QQ","Baidu","Maxthon","Sogou","LBBROWSER","2345Explorer","TheWorld","XiaoMi","Quark","Qiyu","Wechat","Taobao","Alipay","Weibo","Douban","Suning","iQiYi"],os:["Windows","Linux","Mac OS","Android","Ubuntu","FreeBSD","Debian","iOS","Windows Phone","BlackBerry","MeeGo","Symbian","Chrome OS","WebOS"],device:["Mobile","Tablet"]};for(var s in this.device="PC",this.language=((i=(a.browserLanguage||a.language).split("-"))[1]&&(i[1]=i[1].toUpperCase()),i.join("_")),o)for(var l=0;l<o[s].length;l++){var c=o[s][l];r[c]&&(this[s]=c)}var p={Windows:function(){var e=t.replace(/^.*Windows NT ([\d.]+);.*$/,"$1");return{6.4:"10",6.3:"8.1",6.2:"8",6.1:"7","6.0":"Vista",5.2:"XP",5.1:"XP","5.0":"2000"}[e]||e},Android:function(){return t.replace(/^.*Android ([\d.]+);.*$/,"$1")},iOS:function(){return t.replace(/^.*OS ([\d_]+) like.*$/,"$1").replace(/_/g,".")},Debian:function(){return t.replace(/^.*Debian\/([\d.]+).*$/,"$1")},"Windows Phone":function(){return t.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/,"$2")},"Mac OS":function(){return t.replace(/^.*Mac OS X ([\d_]+).*$/,"$1").replace(/_/g,".")},WebOS:function(){return t.replace(/^.*hpwOS\/([\d.]+);.*$/,"$1")}};this.osVersion="",p[this.os]&&(this.osVersion=p[this.os](),this.osVersion==t&&(this.osVersion=""));var d={Safari:function(){return t.replace(/^.*Version\/([\d.]+).*$/,"$1")},Chrome:function(){return t.replace(/^.*Chrome\/([\d.]+).*$/,"$1").replace(/^.*CriOS\/([\d.]+).*$/,"$1")},IE:function(){return t.replace(/^.*MSIE ([\d.]+).*$/,"$1").replace(/^.*rv:([\d.]+).*$/,"$1")},Edge:function(){return t.replace(/^.*Edge\/([\d.]+).*$/,"$1")},Firefox:function(){return t.replace(/^.*Firefox\/([\d.]+).*$/,"$1").replace(/^.*FxiOS\/([\d.]+).*$/,"$1")},"Firefox Focus":function(){return t.replace(/^.*Focus\/([\d.]+).*$/,"$1")},Chromium:function(){return t.replace(/^.*Chromium\/([\d.]+).*$/,"$1")},Opera:function(){return t.replace(/^.*Opera\/([\d.]+).*$/,"$1").replace(/^.*OPR\/([\d.]+).*$/,"$1")},Vivaldi:function(){return t.replace(/^.*Vivaldi\/([\d.]+).*$/,"$1")},Yandex:function(){return t.replace(/^.*YaBrowser\/([\d.]+).*$/,"$1")},Kindle:function(){return t.replace(/^.*Version\/([\d.]+).*$/,"$1")},Maxthon:function(){return t.replace(/^.*Maxthon\/([\d.]+).*$/,"$1")},QQBrowser:function(){return t.replace(/^.*QQBrowser\/([\d.]+).*$/,"$1")},QQ:function(){return t.replace(/^.*QQ\/([\d.]+).*$/,"$1")},Baidu:function(){return t.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/,"$1")},UC:function(){return t.replace(/^.*UC?Browser\/([\d.]+).*$/,"$1")},Sogou:function(){return t.replace(/^.*SE ([\d.X]+).*$/,"$1").replace(/^.*SogouMobileBrowser\/([\d.]+).*$/,"$1")},"2345Explorer":function(){return t.replace(/^.*2345Explorer\/([\d.]+).*$/,"$1")},TheWorld:function(){return t.replace(/^.*TheWorld ([\d.]+).*$/,"$1")},XiaoMi:function(){return t.replace(/^.*MiuiBrowser\/([\d.]+).*$/,"$1")},Quark:function(){return t.replace(/^.*Quark\/([\d.]+).*$/,"$1")},Qiyu:function(){return t.replace(/^.*Qiyu\/([\d.]+).*$/,"$1")},Wechat:function(){return t.replace(/^.*MicroMessenger\/([\d.]+).*$/,"$1")},Taobao:function(){return t.replace(/^.*AliApp\(TB\/([\d.]+).*$/,"$1")},Alipay:function(){return t.replace(/^.*AliApp\(AP\/([\d.]+).*$/,"$1")},Weibo:function(){return t.replace(/^.*weibo__([\d.]+).*$/,"$1")},Douban:function(){return t.replace(/^.*com.douban.frodo\/([\d.]+).*$/,"$1")},Suning:function(){return t.replace(/^.*SNEBUY-APP([\d.]+).*$/,"$1")},iQiYi:function(){return t.replace(/^.*IqiyiVersion\/([\d.]+).*$/,"$1")}};this.version="",d[this.browser]&&(this.version=d[this.browser](),this.version==t&&(this.version="")),"Edge"==this.browser?this.engine="EdgeHTML":"Chrome"==this.browser&&parseInt(this.version)>27?this.engine="Blink":"Opera"==this.browser&&parseInt(this.version)>12?this.engine="Blink":"Yandex"==this.browser?this.engine="Blink":void 0==this.browser&&(this.browser="Unknow App")}(e)}},function(e,t){var r;r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(r=window)}e.exports=r},function(e,t,r){(function(t){!function(t){"use strict";var r={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:g,hr:/^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,nptable:g,blockquote:/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:"^ {0,3}(?:<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?\\?>\\n*|<![A-Z][\\s\\S]*?>\\n*|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$))",def:/^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,table:g,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,paragraph:/^([^\n]+(?:\n(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)*)/,text:/^[^\n]+/};function n(e){this.tokens=[],this.tokens.links={},this.options=e||b.defaults,this.rules=r.normal,this.options.pedantic?this.rules=r.pedantic:this.options.gfm&&(this.options.tables?this.rules=r.tables:this.rules=r.gfm)}r._label=/(?!\s*\])(?:\\[\[\]]|[^\[\]])+/,r._title=/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/,r.def=d(r.def).replace("label",r._label).replace("title",r._title).getRegex(),r.bullet=/(?:[*+-]|\d+\.)/,r.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,r.item=d(r.item,"gm").replace(/bull/g,r.bullet).getRegex(),r.list=d(r.list).replace(/bull/g,r.bullet).replace("hr","\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def","\\n+(?="+r.def.source+")").getRegex(),r._tag="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",r._comment=/<!--(?!-?>)[\s\S]*?-->/,r.html=d(r.html,"i").replace("comment",r._comment).replace("tag",r._tag).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),r.paragraph=d(r.paragraph).replace("hr",r.hr).replace("heading",r.heading).replace("lheading",r.lheading).replace("tag",r._tag).getRegex(),r.blockquote=d(r.blockquote).replace("paragraph",r.paragraph).getRegex(),r.normal=v({},r),r.gfm=v({},r.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/}),r.gfm.paragraph=d(r.paragraph).replace("(?!","(?!"+r.gfm.fences.source.replace("\\1","\\2")+"|"+r.list.source.replace("\\1","\\3")+"|").getRegex(),r.tables=v({},r.gfm,{nptable:/^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,table:/^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/}),r.pedantic=v({},r.normal,{html:d("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment",r._comment).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/}),n.rules=r,n.lex=function(e,t){return new n(t).lex(e)},n.prototype.lex=function(e){return e=e.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n"),this.token(e,!0)},n.prototype.token=function(e,t){var n,a,i,o,s,l,c,p,d,u,f,h,g;for(e=e.replace(/^ +$/gm,"");e;)if((i=this.rules.newline.exec(e))&&(e=e.substring(i[0].length),i[0].length>1&&this.tokens.push({type:"space"})),i=this.rules.code.exec(e))e=e.substring(i[0].length),i=i[0].replace(/^ {4}/gm,""),this.tokens.push({type:"code",text:this.options.pedantic?i:i.replace(/\n+$/,"")});else if(i=this.rules.fences.exec(e))e=e.substring(i[0].length),this.tokens.push({type:"code",lang:i[2],text:i[3]||""});else if(i=this.rules.heading.exec(e))e=e.substring(i[0].length),this.tokens.push({type:"heading",depth:i[1].length,text:i[2]});else if(t&&(i=this.rules.nptable.exec(e))&&(l={type:"table",header:m(i[1].replace(/^ *| *\| *$/g,"")),align:i[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:i[3]?i[3].replace(/\n$/,"").split("\n"):[]}).header.length===l.align.length){for(e=e.substring(i[0].length),p=0;p<l.align.length;p++)/^ *-+: *$/.test(l.align[p])?l.align[p]="right":/^ *:-+: *$/.test(l.align[p])?l.align[p]="center":/^ *:-+ *$/.test(l.align[p])?l.align[p]="left":l.align[p]=null;for(p=0;p<l.cells.length;p++)l.cells[p]=m(l.cells[p],l.header.length);this.tokens.push(l)}else if(i=this.rules.hr.exec(e))e=e.substring(i[0].length),this.tokens.push({type:"hr"});else if(i=this.rules.blockquote.exec(e))e=e.substring(i[0].length),this.tokens.push({type:"blockquote_start"}),i=i[0].replace(/^ *> ?/gm,""),this.token(i,t),this.tokens.push({type:"blockquote_end"});else if(i=this.rules.list.exec(e)){for(e=e.substring(i[0].length),f=(o=i[2]).length>1,this.tokens.push({type:"list_start",ordered:f,start:f?+o:""}),n=!1,u=(i=i[0].match(this.rules.item)).length,p=0;p<u;p++)c=(l=i[p]).length,~(l=l.replace(/^ *([*+-]|\d+\.) +/,"")).indexOf("\n ")&&(c-=l.length,l=this.options.pedantic?l.replace(/^ {1,4}/gm,""):l.replace(new RegExp("^ {1,"+c+"}","gm"),"")),this.options.smartLists&&p!==u-1&&(o===(s=r.bullet.exec(i[p+1])[0])||o.length>1&&s.length>1||(e=i.slice(p+1).join("\n")+e,p=u-1)),a=n||/\n\n(?!\s*$)/.test(l),p!==u-1&&(n="\n"===l.charAt(l.length-1),a||(a=n)),g=void 0,(h=/^\[[ xX]\] /.test(l))&&(g=" "!==l[1],l=l.replace(/^\[[ xX]\] +/,"")),this.tokens.push({type:a?"loose_item_start":"list_item_start",task:h,checked:g}),this.token(l,!1),this.tokens.push({type:"list_item_end"});this.tokens.push({type:"list_end"})}else if(i=this.rules.html.exec(e))e=e.substring(i[0].length),this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&("pre"===i[1]||"script"===i[1]||"style"===i[1]),text:i[0]});else if(t&&(i=this.rules.def.exec(e)))e=e.substring(i[0].length),i[3]&&(i[3]=i[3].substring(1,i[3].length-1)),d=i[1].toLowerCase().replace(/\s+/g," "),this.tokens.links[d]||(this.tokens.links[d]={href:i[2],title:i[3]});else if(t&&(i=this.rules.table.exec(e))&&(l={type:"table",header:m(i[1].replace(/^ *| *\| *$/g,"")),align:i[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:i[3]?i[3].replace(/(?: *\| *)?\n$/,"").split("\n"):[]}).header.length===l.align.length){for(e=e.substring(i[0].length),p=0;p<l.align.length;p++)/^ *-+: *$/.test(l.align[p])?l.align[p]="right":/^ *:-+: *$/.test(l.align[p])?l.align[p]="center":/^ *:-+ *$/.test(l.align[p])?l.align[p]="left":l.align[p]=null;for(p=0;p<l.cells.length;p++)l.cells[p]=m(l.cells[p].replace(/^ *\| *| *\| *$/g,""),l.header.length);this.tokens.push(l)}else if(i=this.rules.lheading.exec(e))e=e.substring(i[0].length),this.tokens.push({type:"heading",depth:"="===i[2]?1:2,text:i[1]});else if(t&&(i=this.rules.paragraph.exec(e)))e=e.substring(i[0].length),this.tokens.push({type:"paragraph",text:"\n"===i[1].charAt(i[1].length-1)?i[1].slice(0,-1):i[1]});else if(i=this.rules.text.exec(e))e=e.substring(i[0].length),this.tokens.push({type:"text",text:i[0]});else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0));return this.tokens};var a={escape:/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,autolink:/^<(scheme:[^\s\x00-\x1f<>]*|email)>/,url:g,tag:"^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",link:/^!?\[(label)\]\(href(?:\s+(title))?\s*\)/,reflink:/^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,nolink:/^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,strong:/^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)|^__([^\s])__(?!_)|^\*\*([^\s])\*\*(?!\*)/,em:/^_([^\s][\s\S]*?[^\s_])_(?!_)|^_([^\s_][\s\S]*?[^\s])_(?!_)|^\*([^\s][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*][\s\S]*?[^\s])\*(?!\*)|^_([^\s_])_(?!_)|^\*([^\s*])\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`]?)\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:g,text:/^[\s\S]+?(?=[\\<!\[`*]|\b_| {2,}\n|$)/};function i(e,t){if(this.options=t||b.defaults,this.links=e,this.rules=a.normal,this.renderer=this.options.renderer||new o,this.renderer.options=this.options,!this.links)throw new Error("Tokens array requires a `links` property.");this.options.pedantic?this.rules=a.pedantic:this.options.gfm&&(this.options.breaks?this.rules=a.breaks:this.rules=a.gfm)}function o(e){this.options=e||b.defaults}function s(){}function l(e){this.tokens=[],this.token=null,this.options=e||b.defaults,this.options.renderer=this.options.renderer||new o,this.renderer=this.options.renderer,this.renderer.options=this.options}function c(e,t){return e.replace(t?/&/g:/&(?!#?\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function p(e){return e.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,function(e,t){return"colon"===(t=t.toLowerCase())?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""})}function d(e,t){return e=e.source||e,t=t||"",{replace:function(t,r){return r=(r=r.source||r).replace(/(^|[^\[])\^/g,"$1"),e=e.replace(t,r),this},getRegex:function(){return new RegExp(e,t)}}}function u(e,t){return f[" "+e]||(/^[^:]+:\/*[^/]*$/.test(e)?f[" "+e]=e+"/":f[" "+e]=e.replace(/[^/]*$/,"")),e=f[" "+e],"//"===t.slice(0,2)?e.replace(/:[\s\S]*/,":")+t:"/"===t.charAt(0)?e.replace(/(:\/*[^/]*)[\s\S]*/,"$1")+t:e+t}a._escapes=/\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g,a._scheme=/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/,a._email=/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,a.autolink=d(a.autolink).replace("scheme",a._scheme).replace("email",a._email).getRegex(),a._attribute=/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,a.tag=d(a.tag).replace("comment",r._comment).replace("attribute",a._attribute).getRegex(),a._label=/(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?/,a._href=/\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?)/,a._title=/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/,a.link=d(a.link).replace("label",a._label).replace("href",a._href).replace("title",a._title).getRegex(),a.reflink=d(a.reflink).replace("label",a._label).getRegex(),a.normal=v({},a),a.pedantic=v({},a.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,link:d(/^!?\[(label)\]\((.*?)\)/).replace("label",a._label).getRegex(),reflink:d(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",a._label).getRegex()}),a.gfm=v({},a.normal,{escape:d(a.escape).replace("])","~|])").getRegex(),url:d(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("email",a._email).getRegex(),_backpedal:/(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:d(a.text).replace("]|","~]|").replace("|","|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&'*+/=?^_`{\\|}~-]+@|").getRegex()}),a.breaks=v({},a.gfm,{br:d(a.br).replace("{2,}","*").getRegex(),text:d(a.gfm.text).replace("{2,}","*").getRegex()}),i.rules=a,i.output=function(e,t,r){return new i(t,r).output(e)},i.prototype.output=function(e){for(var t,r,n,a,o,s="";e;)if(o=this.rules.escape.exec(e))e=e.substring(o[0].length),s+=o[1];else if(o=this.rules.autolink.exec(e))e=e.substring(o[0].length),n="@"===o[2]?"mailto:"+(r=c(this.mangle(o[1]))):r=c(o[1]),s+=this.renderer.link(n,null,r);else if(this.inLink||!(o=this.rules.url.exec(e))){if(o=this.rules.tag.exec(e))!this.inLink&&/^<a /i.test(o[0])?this.inLink=!0:this.inLink&&/^<\/a>/i.test(o[0])&&(this.inLink=!1),e=e.substring(o[0].length),s+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(o[0]):c(o[0]):o[0];else if(o=this.rules.link.exec(e))e=e.substring(o[0].length),this.inLink=!0,n=o[2],this.options.pedantic?(t=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(n))?(n=t[1],a=t[3]):a="":a=o[3]?o[3].slice(1,-1):"",n=n.trim().replace(/^<([\s\S]*)>$/,"$1"),s+=this.outputLink(o,{href:i.escapes(n),title:i.escapes(a)}),this.inLink=!1;else if((o=this.rules.reflink.exec(e))||(o=this.rules.nolink.exec(e))){if(e=e.substring(o[0].length),t=(o[2]||o[1]).replace(/\s+/g," "),!(t=this.links[t.toLowerCase()])||!t.href){s+=o[0].charAt(0),e=o[0].substring(1)+e;continue}this.inLink=!0,s+=this.outputLink(o,t),this.inLink=!1}else if(o=this.rules.strong.exec(e))e=e.substring(o[0].length),s+=this.renderer.strong(this.output(o[4]||o[3]||o[2]||o[1]));else if(o=this.rules.em.exec(e))e=e.substring(o[0].length),s+=this.renderer.em(this.output(o[6]||o[5]||o[4]||o[3]||o[2]||o[1]));else if(o=this.rules.code.exec(e))e=e.substring(o[0].length),s+=this.renderer.codespan(c(o[2].trim(),!0));else if(o=this.rules.br.exec(e))e=e.substring(o[0].length),s+=this.renderer.br();else if(o=this.rules.del.exec(e))e=e.substring(o[0].length),s+=this.renderer.del(this.output(o[1]));else if(o=this.rules.text.exec(e))e=e.substring(o[0].length),s+=this.renderer.text(c(this.smartypants(o[0])));else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0))}else o[0]=this.rules._backpedal.exec(o[0])[0],e=e.substring(o[0].length),"@"===o[2]?n="mailto:"+(r=c(o[0])):(r=c(o[0]),n="www."===o[1]?"http://"+r:r),s+=this.renderer.link(n,null,r);return s},i.escapes=function(e){return e?e.replace(i.rules._escapes,"$1"):e},i.prototype.outputLink=function(e,t){var r=t.href,n=t.title?c(t.title):null;return"!"!==e[0].charAt(0)?this.renderer.link(r,n,this.output(e[1])):this.renderer.image(r,n,c(e[1]))},i.prototype.smartypants=function(e){return this.options.smartypants?e.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…"):e},i.prototype.mangle=function(e){if(!this.options.mangle)return e;for(var t,r="",n=e.length,a=0;a<n;a++)t=e.charCodeAt(a),Math.random()>.5&&(t="x"+t.toString(16)),r+="&#"+t+";";return r},o.prototype.code=function(e,t,r){if(this.options.highlight){var n=this.options.highlight(e,t);null!=n&&n!==e&&(r=!0,e=n)}return t?'<pre><code class="'+this.options.langPrefix+c(t,!0)+'">'+(r?e:c(e,!0))+"</code></pre>\n":"<pre><code>"+(r?e:c(e,!0))+"</code></pre>"},o.prototype.blockquote=function(e){return"<blockquote>\n"+e+"</blockquote>\n"},o.prototype.html=function(e){return e},o.prototype.heading=function(e,t,r){return this.options.headerIds?"<h"+t+' id="'+this.options.headerPrefix+r.toLowerCase().replace(/[^\w]+/g,"-")+'">'+e+"</h"+t+">\n":"<h"+t+">"+e+"</h"+t+">\n"},o.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"},o.prototype.list=function(e,t,r){var n=t?"ol":"ul";return"<"+n+(t&&1!==r?' start="'+r+'"':"")+">\n"+e+"</"+n+">\n"},o.prototype.listitem=function(e){return"<li>"+e+"</li>\n"},o.prototype.checkbox=function(e){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"'+(this.options.xhtml?" /":"")+"> "},o.prototype.paragraph=function(e){return"<p>"+e+"</p>\n"},o.prototype.table=function(e,t){return t&&(t="<tbody>"+t+"</tbody>"),"<table>\n<thead>\n"+e+"</thead>\n"+t+"</table>\n"},o.prototype.tablerow=function(e){return"<tr>\n"+e+"</tr>\n"},o.prototype.tablecell=function(e,t){var r=t.header?"th":"td";return(t.align?"<"+r+' align="'+t.align+'">':"<"+r+">")+e+"</"+r+">\n"},o.prototype.strong=function(e){return"<strong>"+e+"</strong>"},o.prototype.em=function(e){return"<em>"+e+"</em>"},o.prototype.codespan=function(e){return"<code>"+e+"</code>"},o.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"},o.prototype.del=function(e){return"<del>"+e+"</del>"},o.prototype.link=function(e,t,r){if(this.options.sanitize){try{var n=decodeURIComponent(p(e)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return r}if(0===n.indexOf("javascript:")||0===n.indexOf("vbscript:")||0===n.indexOf("data:"))return r}this.options.baseUrl&&!h.test(e)&&(e=u(this.options.baseUrl,e));try{e=encodeURI(e).replace(/%25/g,"%")}catch(e){return r}var a='<a href="'+c(e)+'"';return t&&(a+=' title="'+t+'"'),a+=">"+r+"</a>"},o.prototype.image=function(e,t,r){this.options.baseUrl&&!h.test(e)&&(e=u(this.options.baseUrl,e));var n='<img src="'+e+'" alt="'+r+'"';return t&&(n+=' title="'+t+'"'),n+=this.options.xhtml?"/>":">"},o.prototype.text=function(e){return e},s.prototype.strong=s.prototype.em=s.prototype.codespan=s.prototype.del=s.prototype.text=function(e){return e},s.prototype.link=s.prototype.image=function(e,t,r){return""+r},s.prototype.br=function(){return""},l.parse=function(e,t){return new l(t).parse(e)},l.prototype.parse=function(e){this.inline=new i(e.links,this.options),this.inlineText=new i(e.links,v({},this.options,{renderer:new s})),this.tokens=e.reverse();for(var t="";this.next();)t+=this.tok();return t},l.prototype.next=function(){return this.token=this.tokens.pop()},l.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0},l.prototype.parseText=function(){for(var e=this.token.text;"text"===this.peek().type;)e+="\n"+this.next().text;return this.inline.output(e)},l.prototype.tok=function(){switch(this.token.type){case"space":return"";case"hr":return this.renderer.hr();case"heading":return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,p(this.inlineText.output(this.token.text)));case"code":return this.renderer.code(this.token.text,this.token.lang,this.token.escaped);case"table":var e,t,r,n,a="",i="";for(r="",e=0;e<this.token.header.length;e++)r+=this.renderer.tablecell(this.inline.output(this.token.header[e]),{header:!0,align:this.token.align[e]});for(a+=this.renderer.tablerow(r),e=0;e<this.token.cells.length;e++){for(t=this.token.cells[e],r="",n=0;n<t.length;n++)r+=this.renderer.tablecell(this.inline.output(t[n]),{header:!1,align:this.token.align[n]});i+=this.renderer.tablerow(r)}return this.renderer.table(a,i);case"blockquote_start":for(i="";"blockquote_end"!==this.next().type;)i+=this.tok();return this.renderer.blockquote(i);case"list_start":i="";for(var o=this.token.ordered,s=this.token.start;"list_end"!==this.next().type;)i+=this.tok();return this.renderer.list(i,o,s);case"list_item_start":for(i="",this.token.task&&(i+=this.renderer.checkbox(this.token.checked));"list_item_end"!==this.next().type;)i+="text"===this.token.type?this.parseText():this.tok();return this.renderer.listitem(i);case"loose_item_start":for(i="";"list_item_end"!==this.next().type;)i+=this.tok();return this.renderer.listitem(i);case"html":return this.renderer.html(this.token.text);case"paragraph":return this.renderer.paragraph(this.inline.output(this.token.text));case"text":return this.renderer.paragraph(this.parseText())}};var f={},h=/^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;function g(){}function v(e){for(var t,r,n=1;n<arguments.length;n++)for(r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}function m(e,t){var r=e.replace(/([^\\])\|/g,"$1 |").split(/ +\| */),n=0;if(r.length>t)r.splice(t);else for(;r.length<t;)r.push("");for(;n<r.length;n++)r[n]=r[n].replace(/\\\|/g,"|");return r}function b(e,t,r){if(void 0===e||null===e)throw new Error("marked(): input parameter is undefined or null");if("string"!=typeof e)throw new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected");if(r||"function"==typeof t){r||(r=t,t=null);var a,i,o=(t=v({},b.defaults,t||{})).highlight,s=0;try{a=n.lex(e,t)}catch(e){return r(e)}i=a.length;var p=function(e){if(e)return t.highlight=o,r(e);var n;try{n=l.parse(a,t)}catch(t){e=t}return t.highlight=o,e?r(e):r(null,n)};if(!o||o.length<3)return p();if(delete t.highlight,!i)return p();for(;s<a.length;s++)!function(e){"code"!==e.type?--i||p():o(e.text,e.lang,function(t,r){return t?p(t):null==r||r===e.text?--i||p():(e.text=r,e.escaped=!0,void(--i||p()))})}(a[s])}else try{return t&&(t=v({},b.defaults,t)),l.parse(n.lex(e,t),t)}catch(e){if(e.message+="\nPlease report this to https://github.com/markedjs/marked.",(t||b.defaults).silent)return"<p>An error occurred:</p><pre>"+c(e.message+"",!0)+"</pre>";throw e}}g.exec=g,b.options=b.setOptions=function(e){return v(b.defaults,e),b},b.getDefaults=function(){return{baseUrl:null,breaks:!1,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:new o,sanitize:!1,sanitizer:null,silent:!1,smartLists:!1,smartypants:!1,tables:!0,xhtml:!1}},b.defaults=b.getDefaults(),b.Parser=l,b.parser=l.parse,b.Renderer=o,b.TextRenderer=s,b.Lexer=n,b.lexer=n.lex,b.InlineLexer=i,b.inlineLexer=i.output,b.parse=b,e.exports=b}(this||"undefined"!=typeof window&&window)}).call(this,r(3))},function(e,t,r){var n;!function(a){"use strict";function i(e,t){var r=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(r>>16)<<16|65535&r}function o(e,t,r,n,a,o){return i((s=i(i(t,e),i(n,o)))<<(l=a)|s>>>32-l,r);var s,l}function s(e,t,r,n,a,i,s){return o(t&r|~t&n,e,t,a,i,s)}function l(e,t,r,n,a,i,s){return o(t&n|r&~n,e,t,a,i,s)}function c(e,t,r,n,a,i,s){return o(t^r^n,e,t,a,i,s)}function p(e,t,r,n,a,i,s){return o(r^(t|~n),e,t,a,i,s)}function d(e,t){var r,n,a,o,d;e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t;var u=1732584193,f=-271733879,h=-1732584194,g=271733878;for(r=0;r<e.length;r+=16)n=u,a=f,o=h,d=g,f=p(f=p(f=p(f=p(f=c(f=c(f=c(f=c(f=l(f=l(f=l(f=l(f=s(f=s(f=s(f=s(f,h=s(h,g=s(g,u=s(u,f,h,g,e[r],7,-680876936),f,h,e[r+1],12,-389564586),u,f,e[r+2],17,606105819),g,u,e[r+3],22,-1044525330),h=s(h,g=s(g,u=s(u,f,h,g,e[r+4],7,-176418897),f,h,e[r+5],12,1200080426),u,f,e[r+6],17,-1473231341),g,u,e[r+7],22,-45705983),h=s(h,g=s(g,u=s(u,f,h,g,e[r+8],7,1770035416),f,h,e[r+9],12,-1958414417),u,f,e[r+10],17,-42063),g,u,e[r+11],22,-1990404162),h=s(h,g=s(g,u=s(u,f,h,g,e[r+12],7,1804603682),f,h,e[r+13],12,-40341101),u,f,e[r+14],17,-1502002290),g,u,e[r+15],22,1236535329),h=l(h,g=l(g,u=l(u,f,h,g,e[r+1],5,-165796510),f,h,e[r+6],9,-1069501632),u,f,e[r+11],14,643717713),g,u,e[r],20,-373897302),h=l(h,g=l(g,u=l(u,f,h,g,e[r+5],5,-701558691),f,h,e[r+10],9,38016083),u,f,e[r+15],14,-660478335),g,u,e[r+4],20,-405537848),h=l(h,g=l(g,u=l(u,f,h,g,e[r+9],5,568446438),f,h,e[r+14],9,-1019803690),u,f,e[r+3],14,-187363961),g,u,e[r+8],20,1163531501),h=l(h,g=l(g,u=l(u,f,h,g,e[r+13],5,-1444681467),f,h,e[r+2],9,-51403784),u,f,e[r+7],14,1735328473),g,u,e[r+12],20,-1926607734),h=c(h,g=c(g,u=c(u,f,h,g,e[r+5],4,-378558),f,h,e[r+8],11,-2022574463),u,f,e[r+11],16,1839030562),g,u,e[r+14],23,-35309556),h=c(h,g=c(g,u=c(u,f,h,g,e[r+1],4,-1530992060),f,h,e[r+4],11,1272893353),u,f,e[r+7],16,-155497632),g,u,e[r+10],23,-1094730640),h=c(h,g=c(g,u=c(u,f,h,g,e[r+13],4,681279174),f,h,e[r],11,-358537222),u,f,e[r+3],16,-722521979),g,u,e[r+6],23,76029189),h=c(h,g=c(g,u=c(u,f,h,g,e[r+9],4,-640364487),f,h,e[r+12],11,-421815835),u,f,e[r+15],16,530742520),g,u,e[r+2],23,-995338651),h=p(h,g=p(g,u=p(u,f,h,g,e[r],6,-198630844),f,h,e[r+7],10,1126891415),u,f,e[r+14],15,-1416354905),g,u,e[r+5],21,-57434055),h=p(h,g=p(g,u=p(u,f,h,g,e[r+12],6,1700485571),f,h,e[r+3],10,-1894986606),u,f,e[r+10],15,-1051523),g,u,e[r+1],21,-2054922799),h=p(h,g=p(g,u=p(u,f,h,g,e[r+8],6,1873313359),f,h,e[r+15],10,-30611744),u,f,e[r+6],15,-1560198380),g,u,e[r+13],21,1309151649),h=p(h,g=p(g,u=p(u,f,h,g,e[r+4],6,-145523070),f,h,e[r+11],10,-1120210379),u,f,e[r+2],15,718787259),g,u,e[r+9],21,-343485551),u=i(u,n),f=i(f,a),h=i(h,o),g=i(g,d);return[u,f,h,g]}function u(e){var t,r="",n=32*e.length;for(t=0;t<n;t+=8)r+=String.fromCharCode(e[t>>5]>>>t%32&255);return r}function f(e){var t,r=[];for(r[(e.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;var n=8*e.length;for(t=0;t<n;t+=8)r[t>>5]|=(255&e.charCodeAt(t/8))<<t%32;return r}function h(e){var t,r,n="";for(r=0;r<e.length;r+=1)t=e.charCodeAt(r),n+="0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t);return n}function g(e){return unescape(encodeURIComponent(e))}function v(e){return function(e){return u(d(f(e),8*e.length))}(g(e))}function m(e,t){return function(e,t){var r,n,a=f(e),i=[],o=[];for(i[15]=o[15]=void 0,a.length>16&&(a=d(a,8*e.length)),r=0;r<16;r+=1)i[r]=909522486^a[r],o[r]=1549556828^a[r];return n=d(i.concat(f(t)),512+8*t.length),u(d(o.concat(n),640))}(g(e),g(t))}function b(e,t,r){return t?r?m(t,e):h(m(t,e)):r?v(e):h(v(e))}void 0===(n=function(){return b}.call(t,r,t,e))||(e.exports=n)}()},function(e,t,r){"use strict";var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),a=c(r(5)),i=c(r(4)),o=c(r(2)),s=r(1),l=c(r(0));function c(e){return e&&e.__esModule?e:{default:e}}var p={cdn:"https://gravatar.loli.net/avatar/",get:function(e,t){var r=t?'<span class="vicon auth" title="认证用户"></span>':"";return'<img class="vimg" src="'+(this.cdn+(0,a.default)(e)+this.params)+'">'+r}},d={comment:"",rid:"",nick:"tourist",mail:"",link:"",ua:navigator.userAgent,url:"",auth:!1,title:""},u=function(e){return e.trim().replace(/>\s+</g,"><")},f=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);this.version="v1.2.0-beta4",this.md5=a.default,this.store=localStorage,t&&this.init(t)}return n(e,[{key:"init",value:function(e){var t=this,r="[object HTMLDivElement]"===Object.prototype.toString.call(e.el)?e.el:document.querySelector(e.el);if("[object HTMLDivElement]"!=Object.prototype.toString.call(r))throw"The target element was not found.";t.el=r,t.el.classList.add("valine"),t.placeholder=e.placeholder||"";var n=u('\n      <div class="vwrap">\n        <div class="vheader item3">\n          <div class="vsign vsno">\n            <input name="nonick" placeholder="称呼" class="vnick vinput" type="text">\n            <input name="nomail" placeholder="邮箱" class="vmail vinput" type="email">\n            <input name="nolink" placeholder="网址 (https://)" class="vlink vinput" type="vlink">\n            <button class="vbtn vsinbtn">登录</button>\n            <button class="vbtn vsupbtn">注册</button>\n          </div>\n          <div class="vsign vsin">\n            <input name="innick" placeholder="邮箱或称呼" class="vnick vinput" type="text">\n            <input name="inpass" placeholder="密码" class="vpass vinput" type="password">\n            <button class="vbtn vsinbtn active">登录</button>\n            <button class="vbtn vbckbtn">取消</button>\n          </div>\n          <div class="vsign vsup">\n            <input name="upnick" placeholder="称呼" class="vnick vinput" type="text">\n            <input name="uppass" placeholder="密码" class="vpass vinput" type="password">\n            <input name="upmail" placeholder="邮箱" class="vmail vinput" type="email">\n            <input name="uplink" placeholder="网址 (https://)" class="vlink vinput" type="text">\n            <button class="vbtn vsupbtn active">注册</button>\n            <button class="vbtn vbckbtn">取消</button>\n          </div>\n          <div class="vsigned">\n            <div class="vleftdiv"></div>\n            <button class="vbtn vlogout">登出</button>\n          </div>\n        </div>\n        <div class="vedit">\n          <textarea class="veditor vinput" placeholder="'+t.placeholder+'"></textarea>\n        </div>\n        <div class="vcontrol">\n          <div class="col col-60">\n            <a title="Markdown is supported" target="_blank"><svg class="markdown" viewBox="0 0 16 16" version="1.1" height="20" aria-hidden="true"><path fill-rule="evenodd" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"></path></svg></a>\n            <a href="javascript:;" title="_(:3 」∠ )_" id="emoji-btn">(〃∀〃)</a>\n          </div>\n          <div class="col col-40 text-right">\n            \x3c!--label><input type="checkbox" id="vpr">私人回复</label--\x3e\n            <button type="button" class="vsubmit vbtn">　送出　</button>\n          </div>\n        </div>\n        <div class="vemoji">\n        </div>\n      </div>\n      <div class="info">\n        <div class="count col"></div>\n      </div>\n      <div class="vloading"></div>\n      <div class="vempty" style="display:none;"></div>\n      <ul class="vlist"></ul>\n    ');t.el.innerHTML=n,t.el.querySelector(".vemoji").innerHTML=l.default.map(function(e,t){return'<a href="javascript:;" title="'+(0,s.decodeHTML)(e).replace('"','\\"')+'" class="vemoji-item" style="animation-delay: '+.01*t+'s">'+e+"</a>"}).join("");var a=t.el.querySelector(".vempty");t.nodata={show:function(e){a.innerHTML=e,a.style.display="block"},hide:function(){a.style.display="none"}};var i=u('\n      <div class="spinner">\n        <div class="r1"></div>\n        <div class="r2"></div>\n        <div class="r3"></div>\n        <div class="r4"></div>\n        <div class="r5"></div>\n      </div>\n    '),o=t.el.querySelector(".vloading");o.innerHTML=i,t.loading={show:function(){o.style.display="block",t.nodata.hide()},hide:function(){o.style.display="none",0===t.el.querySelectorAll(".vcard").length&&t.nodata.show("目前尚未有评论")}},p.params="?d="+e.avatar;var c=e.av||AV,f=e.app_id||e.appId,h=e.app_key||e.appKey;if(!f||!h)throw t.loading.hide(),"Appid and appkey is required.";c.applicationId=null,c.init(f,h),t.v=c,d.url=(e.path||location.pathname).replace(/index\.html?$/,""),t.bind(e)}},{key:"bind",value:function(e){var t=this,r=function(e){if(e.get("private")){if(!t.user)return;var r=e.get("auth")&&t.user.get("username")===e.get("nick"),n=t.user.get("admin");if(!r&&!n)return}var a=!!e.get("rid"),i=t.el.querySelector(".vlist");if(a){var l=e.get("rid"),c=document.getElementById(l);if(!c)return;var d=c.querySelector("section");if(d.querySelector("ul"))(i=d.querySelector("ul")).classList.add("vlist");else{d.querySelector(".vfooter");i=document.createElement("ul"),d.appendChild(i)}}var f=(0,o.default)(e.get("ua")),h=document.createElement("li");h.setAttribute("class","vcard"),h.setAttribute("id",e.id),h.innerHTML=u("\n        "+p.get(e.get("mail"),e.get("auth"))+'\n        <section>\n          <div class="vhead">\n            <a rel="nofollow" href="'+(0,s.getLink)(e.get("link"))+'" target="_blank" >\n              '+e.get("nick")+'\n            </a>\n            <span class="vtag">'+f.browser+" "+f.version+'</span>\n            <span class="vtag">'+f.os+" "+f.osVersion+"</span>\n            "+(e.get("title")?'<span class="vtag">'+e.get("title")+"</span>":"")+"\n            "+(e.get("private")?'<span class="vtag">[Private Reply]</span>':"")+'\n          </div>\n          <div class="vcontent">\n            '+e.get("comment")+'\n          </div>\n          <div class="vfooter">\n            <span class="vtime">\n              '+(0,s.timeAgo)(e.get("createdAt"))+'\n            </span>\n            <span rid="'+e.id+'" at="@'+e.get("nick")+'" class="vat">回复</span>\n          <div>\n        </section>\n      ');for(var g=i.querySelectorAll("li"),v=h.querySelector(".vat"),m=h.querySelectorAll("a"),b=0,x=m.length;b<x;b++){var k=m[b];k&&"at"!=k.getAttribute("class")&&(k.setAttribute("target","_blank"),k.setAttribute("rel","nofollow"))}a?i.appendChild(h):i.insertBefore(h,g[0]);var w,Y=h.querySelector(".vcontent");(w=Y).offsetHeight>180&&(w.classList.add("expand"),s.Event.on("click",w,function(e){w.setAttribute("class","vcontent")})),y(v)};!function(){t.loading.show();var e=new t.v.Query("Comment");e.equalTo("url",d.url),e.descending("createdAt"),e.limit("1000"),e.find().then(function(e){e.reverse();var n=e.length;n&&(t.el.querySelector(".vlist").innerHTML="",e.forEach(r),t.el.querySelector(".count").innerHTML='评论(<span class="num">'+n+"</span>)"),t.loading.hide()}).catch(function(e){t.loading.hide()})}();var n={comment:t.el.querySelector(".veditor"),nick:t.el.querySelector(".vsno .vnick"),mail:t.el.querySelector(".vsno .vmail"),link:t.el.querySelector(".vsno .vlink")},a=t.el.querySelector(".vheader"),l=function(e){Array.from(e).map(function(e){e.removeAttribute("tabindex")})},c=function(e){Array.from(e).map(function(e){e.setAttribute("tabindex",-1)})},f=function(e){a.scrollTo({top:40*e,behavior:"smooth"}),c(a.querySelectorAll("input")),l(a.children[e].querySelectorAll("input")),e<3&&a.children[e].children[0].select()};c(a.querySelectorAll("button, input")),l(a.children[0].querySelectorAll("input"));var h=function(e){t.user=e,d.auth=!0,d.title=e.get("title"),d.nick=e.get("username"),d.mail=e.get("email"),d.link=e.get("link");var r=a.querySelector(".vleftdiv");r.innerHTML=u("\n        "+p.get(e.get("email"))+'\n        <span class="vintro">'+e.get("username")+"</span>\n      "),r.setAttribute("title","User: "+e.get("username")+"\n("+e.get("email")+")"),f(3)},g=function(){t.user=null,d.auth=!1,d.title="",f(0)},v=function(){var e=a.querySelector(".vsin .vnick").value,r=a.querySelector(".vsin .vpass").value;try{(function(e,r){return t.v.User.logIn(e,r)})(e,r).then(h).catch(function(e){alert("登录失败\n"+e.message)})}catch(e){alert("登录失败\n"+e.message)}},m=function(){var e=a.querySelector(".vsup .vnick").value,r=a.querySelector(".vsup .vpass").value,n=a.querySelector(".vsup .vmail").value,i=a.querySelector(".vsup .vlink").value;try{(function(e,r,n,a){return t.v.User.signUp(e,r,{email:n,link:a,ACL:k()})})(e,r,n,i).then(h).catch(function(e){alert("注册失败\n"+e.message)})}catch(e){alert("注册失败\n"+e.message)}};if(s.Event.on("click",a.querySelector(".vsno .vsinbtn"),function(){return f(1)}),s.Event.on("click",a.querySelector(".vsno .vsupbtn"),function(){return f(2)}),s.Event.on("change",a.querySelector(".vsin .vpass"),v),s.Event.on("click",a.querySelector(".vsin .vsinbtn"),v),s.Event.on("click",a.querySelector(".vsin .vbckbtn"),function(){return f(0)}),s.Event.on("change",a.querySelector(".vsup .vlink"),m),s.Event.on("click",a.querySelector(".vsup .vsupbtn"),m),s.Event.on("click",a.querySelector(".vsup .vbckbtn"),function(){return f(0)}),s.Event.on("click",a.querySelector(".vlogout"),function(){t.v.User.logOut().then(g).catch(function(e){alert("登出失败\n"+e.message)})}),t.user=t.v.User.current(),t.user)h(t.user);else{var b=t.store&&JSON.parse(t.store.getItem("ValineCache"));b&&(n.nick.value=b.nick,n.mail.value=b.mail,n.link.value=b.link)}var x=t.el.querySelector(".vsubmit");s.Event.on("click",x,function(e){var r=n.comment.value;if(r){if(!t.user){var a=n.nick.value||"tourist",o=n.mail.value,l=n.link.value;d.nick=a;var c=s.Checker.mail(o),p=s.Checker.link(l);d.mail=c.k?c.v:"",d.link=p.k?p.v:"",("tourist"!==a||o||l)&&function(e,r,n){t.store&&t.store.setItem("ValineCache",JSON.stringify({nick:e,mail:r,link:n}))}(a,o,l)}d.comment=(0,i.default)(r,{sanitize:!0}),d.private=t.el.querySelector("#vpr").checked,w()}}),s.Event.on("keydown",n.comment,function(e){e.ctrlKey&&13==e.keyCode&&x.click()});var k=function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],r=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=new t.v.ACL;return n.setPublicReadAccess(e),n.setPublicWriteAccess(r),n},w=function(){x.setAttribute("disabled",!0),t.loading.show();var e=new(t.v.Object.extend("Comment"))(d);e.setACL(k()),e.save().then(function(e){var a=t.el.querySelector(".num"),i=1;a?(i=Number(a.innerText)+1,a.innerText=i):t.el.querySelector(".count").innerHTML='评论(<span class="num">1</span>)',r(e),x.removeAttribute("disabled"),t.loading.hide(),n.comment.value="",n.comment.setAttribute("placeholder",t.placeholder),d.rid=""}).catch(function(e){t.loading.hide(),t.nodata.show("提交失败\n"+e.message),setTimeout(t.nodata.hide,2e3)})},y=function(e){s.Event.on("click",e,function(t){var r=e.getAttribute("at"),a=e.getAttribute("rid");e.getAttribute("mail");d.rid=a,n.comment.setAttribute("placeholder","回复 "+r+" 的评论..."),n.comment.scrollIntoView({block:"center",behavior:"smooth"}),n.comment.select()})},Y=!1,S=t.el.querySelector("#emoji-btn"),$=t.el.querySelector(".vemoji");s.Event.on("click",S,function(e){Y=!Y,$.style.display=Y?"block":"none",S.classList.toggle("active")}),$.querySelectorAll(".vemoji-item").forEach(function(e){s.Event.on("click",e,function(t){n.comment.value+=e.innerText,n.comment.focus()})})}}]),e}();e.exports=f},function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var r=t.protocol+"//"+t.host,n=r+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,t){var a,i=t.trim().replace(/^"(.*)"$/,function(e,t){return t}).replace(/^'(.*)'$/,function(e,t){return t});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(i)?e:(a=0===i.indexOf("//")?i:0===i.indexOf("/")?r+i:n+i.replace(/^\.\//,""),"url("+JSON.stringify(a)+")")})}},function(e,t,r){var n,a,i={},o=(n=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===a&&(a=n.apply(this,arguments)),a}),s=function(e){var t={};return function(e){return void 0===t[e]&&(t[e]=function(e){return document.querySelector(e)}.call(this,e)),t[e]}}(),l=null,c=0,p=[],d=r(7);function u(e,t){for(var r=0;r<e.length;r++){var n=e[r],a=i[n.id];if(a){a.refs++;for(var o=0;o<a.parts.length;o++)a.parts[o](n.parts[o]);for(;o<n.parts.length;o++)a.parts.push(b(n.parts[o],t))}else{var s=[];for(o=0;o<n.parts.length;o++)s.push(b(n.parts[o],t));i[n.id]={id:n.id,refs:1,parts:s}}}}function f(e,t){for(var r=[],n={},a=0;a<e.length;a++){var i=e[a],o=t.base?i[0]+t.base:i[0],s={css:i[1],media:i[2],sourceMap:i[3]};n[o]?n[o].parts.push(s):r.push(n[o]={id:o,parts:[s]})}return r}function h(e,t){var r=s(e.insertInto);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var n=p[p.length-1];if("top"===e.insertAt)n?n.nextSibling?r.insertBefore(t,n.nextSibling):r.appendChild(t):r.insertBefore(t,r.firstChild),p.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");r.appendChild(t)}}function g(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=p.indexOf(e);t>=0&&p.splice(t,1)}function v(e){var t=document.createElement("style");return e.attrs.type="text/css",m(t,e.attrs),h(e,t),t}function m(e,t){Object.keys(t).forEach(function(r){e.setAttribute(r,t[r])})}function b(e,t){var r,n,a,i;if(t.transform&&e.css){if(!(i=t.transform(e.css)))return function(){};e.css=i}if(t.singleton){var o=c++;r=l||(l=v(t)),n=w.bind(null,r,o,!1),a=w.bind(null,r,o,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(r=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",m(t,e.attrs),h(e,t),t}(t),n=function(e,t,r){var n=r.css,a=r.sourceMap,i=void 0===t.convertToAbsoluteUrls&&a;(t.convertToAbsoluteUrls||i)&&(n=d(n));a&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */");var o=new Blob([n],{type:"text/css"}),s=e.href;e.href=URL.createObjectURL(o),s&&URL.revokeObjectURL(s)}.bind(null,r,t),a=function(){g(r),r.href&&URL.revokeObjectURL(r.href)}):(r=v(t),n=function(e,t){var r=t.css,n=t.media;n&&e.setAttribute("media",n);if(e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}.bind(null,r),a=function(){g(r)});return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t)}else a()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=o()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var r=f(e,t);return u(r,t),function(e){for(var n=[],a=0;a<r.length;a++){var o=r[a];(s=i[o.id]).refs--,n.push(s)}e&&u(f(e,t),t);for(a=0;a<n.length;a++){var s;if(0===(s=n[a]).refs){for(var l=0;l<s.parts.length;l++)s.parts[l]();delete i[s.id]}}}};var x,k=(x=[],function(e,t){return x[e]=t,x.filter(Boolean).join("\n")});function w(e,t,r,n){var a=r?"":n.css;if(e.styleSheet)e.styleSheet.cssText=k(t,a);else{var i=document.createTextNode(a),o=e.childNodes;o[t]&&e.removeChild(o[t]),o.length?e.insertBefore(i,o[t]):e.appendChild(i)}}},function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var r=function(e,t){var r=e[1]||"",n=e[3];if(!n)return r;if(t&&"function"==typeof btoa){var a=(o=n,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */"),i=n.sources.map(function(e){return"/*# sourceURL="+n.sourceRoot+e+" */"});return[r].concat(i).concat([a]).join("\n")}var o;return[r].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+r+"}":r}).join("")},t.i=function(e,r){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},a=0;a<this.length;a++){var i=this[a][0];"number"==typeof i&&(n[i]=!0)}for(a=0;a<e.length;a++){var o=e[a];"number"==typeof o[0]&&n[o[0]]||(r&&!o[2]?o[2]=r:r&&(o[2]="("+o[2]+") and ("+r+")"),t.push(o))}},t}},function(e,t,r){(e.exports=r(9)(void 0)).push([e.i,'.valine *{box-sizing:border-box;font-family:miranafont,Hiragino Sans GB,STXihei,Microsoft YaHei,SimSun,sans-serif;line-height:1.42857143;color:#555;transition:all .3s ease}.valine .vinput{border:none;resize:none;outline:none;padding:10px 0;font-size:1.32858rem;min-width:0}.valine .vwrap{border:1px solid #ccc;border-radius:4px;background:hsla(0,0%,100%,.5);margin-bottom:10px;position:relative;padding:10px}.valine .vwrap input{background:transparent}.valine .vwrap .vheader{height:40px;overflow:hidden;scroll-behavior:smooth}.valine .vwrap .vheader .vsupbtn{display:none}.valine .vwrap .vheader .vinput{border-bottom:1px dashed #dedede}.valine .vwrap .vheader .vinput:focus{border-bottom-color:#33b1ff}.valine .vwrap .vheader .vsign{height:40px;display:flex}.valine .vwrap .vheader .vsign .vinput{flex:1}.valine .vwrap .vheader .vsign button{margin-left:10px}.valine .vwrap .vheader .vsign button.active{background-color:#33b1ff;color:#fff}.valine .vwrap .vheader .vsign button.active:hover{background-color:#fff;color:#33b1ff}.valine .vwrap .vheader .vsigned{height:40px}.valine .vwrap .vheader .vsigned .vleftdiv{border-radius:20px;display:inline-block;background:rgba(0,0,0,.1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.valine .vwrap .vheader .vsigned .vleftdiv .vimg{border-radius:50%;vertical-align:middle;height:40px}.valine .vwrap .vheader .vsigned .vleftdiv .vintro{margin-left:10px;margin-right:15px;height:40px;vertical-align:middle;line-height:40px;font-size:14px}.valine .vwrap .vheader .vsigned button{float:right}.valine .vwrap .vheader .vsigned:after{content:"";display:block;clear:both}.valine .vwrap .vcontrol{font-size:0}.valine .vwrap .vcontrol .col{display:inline-block;font-size:1.24287rem;vertical-align:middle;color:#ccc}.valine .vwrap .vcontrol .col.text-right{text-align:right}.valine .vwrap .vcontrol .col svg{margin-right:2px;overflow:hidden;fill:currentColor;vertical-align:middle}.valine .vwrap .vcontrol .col.col-40{width:40%}.valine .vwrap .vcontrol .col.col-60{width:60%}.valine .vwrap .vcontrol .col a{margin-right:20px;display:inline-block;transition:color .3s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.valine .vwrap .vcontrol .col a:hover{color:#33b1ff;transition:color .3s;-webkit-animation:b 5s infinite ease-in-out;animation:b 5s infinite ease-in-out}.valine .vwrap .vcontrol .col a.active{color:#33b1ff;transition:color .3s}.valine .vwrap .vcontrol .col label{display:inline-block;margin-right:5.1429rem;cursor:pointer;font-size:1.37144rem}.valine .vwrap .vcontrol .col label input[type=checkbox]{cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;width:1.7143rem;height:1.7143rem;border:1px solid #ccc;box-sizing:border-box;vertical-align:middle;margin-right:1.28573rem;position:relative;border-radius:25%;transition:border-color .2s}.valine .vwrap .vcontrol .col label input[type=checkbox]:focus{outline:none}.valine .vwrap .vcontrol .col label input[type=checkbox]:before{content:"";border-radius:25%;position:absolute;left:.34286rem;top:.25714rem;width:.855rem;height:.855rem;background:#33b1ff;-webkit-transform:scale(0);transform:scale(0);transition:-webkit-transform .2s;transition:transform .2s;transition:transform .2s,-webkit-transform .2s}.valine .vwrap .vcontrol .col label input[type=checkbox]:checked{border-color:#33b1ff;transition:border-color .2s}.valine .vwrap .vcontrol .col label input[type=checkbox]:checked:before{-webkit-transform:scale(1);transform:scale(1);transition:-webkit-transform .2s;transition:transform .2s;transition:transform .2s,-webkit-transform .2s}.valine .vwrap .vcontrol .col label:hover input{border-color:#33b1ff;transition:border-color .2s}.valine .vwrap .vemoji{display:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.valine .vwrap .vemoji .vemoji-item{display:inline-block;margin:5px 10px;padding:2px 4px;box-shadow:0 0 5px #666;transition:all .1s;border-radius:5px;-webkit-animation:c .5s;animation:c .5s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;-webkit-transform:scale(0);transform:scale(0)}.valine .vwrap .vemoji .vemoji-item:hover{box-shadow:0 0 7px #222;color:#33b1ff;transition:all .1s}.valine .power{color:#999}.valine .power,.valine .power a{font-size:1.28573rem}.valine .info{font-size:0;padding:5px}.valine .info .col{font-size:1.5rem;display:inline-block;width:50%;vertical-align:middle}.valine .info .count .num{font-weight:600;font-size:2.14288rem}.valine a{text-decoration:none;color:#555}.valine a:hover{color:#222}.valine li,.valine ul{list-style:none;margin:0 auto;padding:0}.valine .txt-center{text-align:center}.valine .txt-right{text-align:right}.valine .pd5{padding:5px}.valine .pd10{padding:10px}.valine .veditor{width:100%;height:15.00012rem;font-size:1.5rem;background:url(/img/plbj.png) bottom 10px right 8px no-repeat}.valine .vbtn{transition-duration:.4s;text-align:center;color:#33b1ff;border:1px solid #33b1ff;border-radius:3.25717rem;background-color:hsla(0,0%,100%,.5);display:inline-block;background:hsla(0,0%,100%,.5);margin-bottom:0;font-weight:400;vertical-align:middle;touch-action:manipulation;cursor:pointer;white-space:nowrap;padding:.855rem 2.14288rem;font-size:1.5rem;line-height:1.42857143;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:none}.valine .vbtn+.vbtn{margin-left:2.14288rem}.valine .vbtn:active,.valine .vbtn:hover{color:#fff;border-color:#33b1ff;background-color:#33b1ff}.valine .vempty{padding:1.25px;text-align:center;color:#999}.valine .vlist{width:100%}.valine .vlist .vcard{padding-top:1.855rem;position:relative;display:block}.valine .vlist .vcard:after{content:"";clear:both;display:block}.valine .vlist .vcard .vimg{width:2.855rem;height:2.855rem;float:left;border-radius:50%;margin-right:1.29001rem}.valine .vlist .vcard .vhead{line-height:1;margin-bottom:1.07144rem;margin-top:0}.valine .vlist .vcard .vhead a{font-size:1.39458rem;font-weight:700;color:#2c2020;margin-right:1.5rem}.valine .vlist .vcard .vhead a:hover{color:#d7191a}.valine .vlist .vcard .vhead .vtag{display:inline-block;padding:.34286rem .855rem;background:#ededed;color:#b3b1b1;font-size:1.28573rem;border-radius:.34286rem;margin-right:.51429rem}.valine .vlist .vcard section{overflow:hidden;padding-bottom:1.855rem;border-bottom:1px solid #f5f5f5}.valine .vlist .vcard section section{padding-bottom:0;border-bottom:none}.valine .vlist .vcard section .vfooter{position:relative}.valine .vlist .vcard section .vfooter .vtime{color:#b3b3b3;font-size:1.28573rem;margin-right:1.5rem}.valine .vlist .vcard section .vfooter .vat{font-size:1.39287rem;color:#33b1ff;cursor:pointer}.valine .vlist .vcard .vcontent{word-wrap:break-word;word-break:break-all;text-align:justify;color:#4a4a4a;font-size:1.5rem;line-height:2;position:relative;margin-bottom:1.28573rem}.valine .vlist .vcard .vcontent a{font-size:1.5rem;color:#708090;-webkit-text-decoration:double;text-decoration:double}.valine .vlist .vcard .vcontent a:hover{color:#d7191a}.valine .vlist .vcard .vcontent .code,.valine .vlist .vcard .vcontent code,.valine .vlist .vcard .vcontent pre{overflow:auto;padding:2px 6px;word-wrap:break-word;color:#555;background:#f5f2f2;border-radius:3px;font-size:1.5rem;margin:5px 0;display:inline}.valine .vlist .vcard .vcontent.expand{cursor:pointer;max-height:19.28588rem;overflow:hidden}.valine .vlist .vcard .vcontent.expand:before{display:block;content:"";position:absolute;width:100%;left:0;top:0;bottom:5.40004rem;pointer-events:none;background:linear-gradient(180deg,hsla(0,0%,100%,0),hsla(0,0%,100%,.9))}.valine .vlist .vcard .vcontent.expand:after{display:block;content:"Click on expand";text-align:center;color:#828586;position:absolute;width:100%;height:5.40004rem;line-height:5.40004rem;left:0;bottom:0;pointer-events:none;background:hsla(0,0%,100%,.9)}.valine .vpage{padding:.6rem}.valine .vpage i{display:inline-block;padding:.08571rem 1.1143rem;font-size:1.34573rem;border:1px solid #f0f0f0;font-style:normal;cursor:pointer}.valine .vpage i+i{margin-left:.6rem}.valine .vpage i.active{border:none;color:#ccc;cursor:default}.valine .clear{content:"";display:block;clear:both}.valine .spinner{margin:1.07144rem auto;width:5.40004rem;height:11.5rem;text-align:center;font-size:10px}.valine .spinner>div{background-color:#9c9c9c;height:100%;width:.64286rem;margin-right:.32572rem;display:inline-block;-webkit-animation:a 1.2s infinite ease-in-out;animation:a 1.2s infinite ease-in-out}.valine .vicon{display:block;background:url(https://s1.hdslb.com/bfs/static/jinkela/space/images/user-auth.png);position:absolute;left:24px;top:48px}.valine .vicon.auth{width:18px;height:18px;background-position:-39px -82px}.valine .spinner .r2{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.valine .spinner .r3{-webkit-animation-delay:-1s;animation-delay:-1s}.valine .spinner .r4{-webkit-animation-delay:-.9s;animation-delay:-.9s}.valine .spinner .r5{-webkit-animation-delay:-.8s;animation-delay:-.8s}@-webkit-keyframes a{0%,40%,to{-webkit-transform:scaleY(.4)}20%{-webkit-transform:scaleY(1)}}@keyframes a{0%,40%,to{transform:scaleY(.4);-webkit-transform:scaleY(.4)}20%{transform:scaleY(1);-webkit-transform:scaleY(1)}}@-webkit-keyframes b{2%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}4%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}6%{-webkit-transform:translateY(1.5px) rotate(-1.5deg);transform:translateY(1.5px) rotate(-1.5deg)}8%{-webkit-transform:translateY(-1.5px) rotate(-1.5deg);transform:translateY(-1.5px) rotate(-1.5deg)}10%{-webkit-transform:translateY(2.5px) rotate(1.5deg);transform:translateY(2.5px) rotate(1.5deg)}12%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}14%{-webkit-transform:translateY(-1.5px) rotate(1.5deg);transform:translateY(-1.5px) rotate(1.5deg)}16%{-webkit-transform:translateY(-.5px) rotate(-1.5deg);transform:translateY(-.5px) rotate(-1.5deg)}18%{-webkit-transform:translateY(.5px) rotate(-1.5deg);transform:translateY(.5px) rotate(-1.5deg)}20%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}22%{-webkit-transform:translateY(.5px) rotate(-1.5deg);transform:translateY(.5px) rotate(-1.5deg)}24%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}26%{-webkit-transform:translateY(.5px) rotate(.5deg);transform:translateY(.5px) rotate(.5deg)}28%{-webkit-transform:translateY(.5px) rotate(1.5deg);transform:translateY(.5px) rotate(1.5deg)}30%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}32%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}34%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}36%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}38%{-webkit-transform:translateY(1.5px) rotate(-1.5deg);transform:translateY(1.5px) rotate(-1.5deg)}40%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}42%{-webkit-transform:translateY(2.5px) rotate(-1.5deg);transform:translateY(2.5px) rotate(-1.5deg)}44%{-webkit-transform:translateY(1.5px) rotate(.5deg);transform:translateY(1.5px) rotate(.5deg)}46%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}48%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}50%{-webkit-transform:translateY(.5px) rotate(.5deg);transform:translateY(.5px) rotate(.5deg)}52%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}54%{-webkit-transform:translateY(-1.5px) rotate(1.5deg);transform:translateY(-1.5px) rotate(1.5deg)}56%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}58%{-webkit-transform:translateY(.5px) rotate(2.5deg);transform:translateY(.5px) rotate(2.5deg)}60%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}62%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}64%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}66%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}68%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}70%{-webkit-transform:translateY(1.5px) rotate(.5deg);transform:translateY(1.5px) rotate(.5deg)}72%{-webkit-transform:translateY(2.5px) rotate(1.5deg);transform:translateY(2.5px) rotate(1.5deg)}74%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}76%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}78%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}80%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}82%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}84%{-webkit-transform:translateY(1.5px) rotate(2.5deg);transform:translateY(1.5px) rotate(2.5deg)}86%{-webkit-transform:translateY(-1.5px) rotate(-1.5deg);transform:translateY(-1.5px) rotate(-1.5deg)}88%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}90%{-webkit-transform:translateY(2.5px) rotate(-.5deg);transform:translateY(2.5px) rotate(-.5deg)}92%{-webkit-transform:translateY(.5px) rotate(-.5deg);transform:translateY(.5px) rotate(-.5deg)}94%{-webkit-transform:translateY(2.5px) rotate(.5deg);transform:translateY(2.5px) rotate(.5deg)}96%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}98%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}0%,to{-webkit-transform:translate(0) rotate(0deg);transform:translate(0) rotate(0deg)}}@keyframes b{2%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}4%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}6%{-webkit-transform:translateY(1.5px) rotate(-1.5deg);transform:translateY(1.5px) rotate(-1.5deg)}8%{-webkit-transform:translateY(-1.5px) rotate(-1.5deg);transform:translateY(-1.5px) rotate(-1.5deg)}10%{-webkit-transform:translateY(2.5px) rotate(1.5deg);transform:translateY(2.5px) rotate(1.5deg)}12%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}14%{-webkit-transform:translateY(-1.5px) rotate(1.5deg);transform:translateY(-1.5px) rotate(1.5deg)}16%{-webkit-transform:translateY(-.5px) rotate(-1.5deg);transform:translateY(-.5px) rotate(-1.5deg)}18%{-webkit-transform:translateY(.5px) rotate(-1.5deg);transform:translateY(.5px) rotate(-1.5deg)}20%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}22%{-webkit-transform:translateY(.5px) rotate(-1.5deg);transform:translateY(.5px) rotate(-1.5deg)}24%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}26%{-webkit-transform:translateY(.5px) rotate(.5deg);transform:translateY(.5px) rotate(.5deg)}28%{-webkit-transform:translateY(.5px) rotate(1.5deg);transform:translateY(.5px) rotate(1.5deg)}30%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}32%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}34%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}36%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}38%{-webkit-transform:translateY(1.5px) rotate(-1.5deg);transform:translateY(1.5px) rotate(-1.5deg)}40%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}42%{-webkit-transform:translateY(2.5px) rotate(-1.5deg);transform:translateY(2.5px) rotate(-1.5deg)}44%{-webkit-transform:translateY(1.5px) rotate(.5deg);transform:translateY(1.5px) rotate(.5deg)}46%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}48%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}50%{-webkit-transform:translateY(.5px) rotate(.5deg);transform:translateY(.5px) rotate(.5deg)}52%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}54%{-webkit-transform:translateY(-1.5px) rotate(1.5deg);transform:translateY(-1.5px) rotate(1.5deg)}56%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}58%{-webkit-transform:translateY(.5px) rotate(2.5deg);transform:translateY(.5px) rotate(2.5deg)}60%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}62%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}64%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}66%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}68%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}70%{-webkit-transform:translateY(1.5px) rotate(.5deg);transform:translateY(1.5px) rotate(.5deg)}72%{-webkit-transform:translateY(2.5px) rotate(1.5deg);transform:translateY(2.5px) rotate(1.5deg)}74%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}76%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}78%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}80%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}82%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}84%{-webkit-transform:translateY(1.5px) rotate(2.5deg);transform:translateY(1.5px) rotate(2.5deg)}86%{-webkit-transform:translateY(-1.5px) rotate(-1.5deg);transform:translateY(-1.5px) rotate(-1.5deg)}88%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}90%{-webkit-transform:translateY(2.5px) rotate(-.5deg);transform:translateY(2.5px) rotate(-.5deg)}92%{-webkit-transform:translateY(.5px) rotate(-.5deg);transform:translateY(.5px) rotate(-.5deg)}94%{-webkit-transform:translateY(2.5px) rotate(.5deg);transform:translateY(2.5px) rotate(.5deg)}96%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}98%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}0%,to{-webkit-transform:translate(0) rotate(0deg);transform:translate(0) rotate(0deg)}}@-webkit-keyframes c{0%{-webkit-transform:scale(0);transform:scale(0)}to{-webkit-transform:scale(1);transform:scale(1)}}@keyframes c{0%{-webkit-transform:scale(0);transform:scale(0)}to{-webkit-transform:scale(1);transform:scale(1)}}',""])},function(e,t,r){var n=r(10);"string"==typeof n&&(n=[[e.i,n,""]]);var a={transform:void 0};r(8)(n,a);n.locals&&(e.exports=n.locals)},function(e,t,r){r(11),e.exports=r(6)}])});