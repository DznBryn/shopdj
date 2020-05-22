(function(Analytics, $, undefined) {

  window._learnq = window._learnq || [];
  
  
  Analytics.gaPageView = function(template, state, title) {
    var rebuiltUrl;
    if (template === 'homepage') {
      rebuiltUrl = '/';
    } else {
      rebuiltUrl = '/' + template + '/' + state;
    };
    ga('send', 'pageview', {
      'page': rebuiltUrl,
      'title': title
    });
  };

  Analytics.klavyioPageView = function(productHandle) {
    var product = Products.getProduct(productHandle);
    _learnq.push(['track', 'Viewed Product', {
      Name: product.title,
      ProductID: product.id,
      Categories: Collections.productIsMemberOf(product.id)
    }]);
  };
  
  Analytics.perfectAuidenceProductView = function(productHandle) {
    window._pa = window._pa || {};
    _pa.productId = Products.getProduct(productHandle);
  };
  
  Analytics.init = function() {
    // Impact Radius
    (function() {
	  var s = document.createElement('script'),
	  e = document.getElementsByTagName('script')[0];
	  s.src = '//d3cxv97fi8q177.cloudfront.net/foundation-A161924-9b41-4c2f-99ca-1ea5d2420b441.min.js';
      s.type = 'text/javascript';
      s.async = true;
      s.id="irfOuterTag";
	  e.parentNode.insertBefore(s, e);
	})();
    // Perfect Auidence
    (function() {
      var pa = document.createElement('script');
      pa.type = 'text/javascript';
      pa.async = true;
      pa.src = ('https:' == document.location.protocol ? 'https:' : 'http:') + "//tag.marinsm.com/serve/556e3d664612d2bcec00000c.js";
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(pa, s);
    })();
    // Google Analytics
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','http://www.google-analytics.com/analytics.js','ga');
    // Klaviyo Tracking
    (function () {
      var b = document.createElement('script');
      b.type = 'text/javascript';
      b.async = true;
      b.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'a.klaviyo.com/media/js/analytics/analytics.js';
      var a = document.getElementsByTagName('script')[0];
      a.parentNode.insertBefore(b, a);
    })();
    KlaviyoSubscribe.attachToForms('#email_signup', {
      hide_form_on_success: true
    });
    KlaviyoSubscribe.attachToModalForm('#klaviyo-modal', {
      delay_seconds: 2,
      success: function ($form) {
        $('.klaviyo_inner').find('.klaviyo_close_modal, .email-input, .form-submit').fadeOut('fast', function() {
          $('.klaviyo_form_success_message').fadeIn('fast');
        });
      }
    });
    _learnq.push(['account', 'hiQ7mU']);
    ga('create', 'UA-30968-10', 'auto');
//    ga('send', 'pageview');
  };

}(window.Analytics = window.Analytics || {}, jQuery));

(function(Cart, $, undefined) {

// description: "The product 'Batter Game Shade - Blue' is already sold out."
// message: "Cart Error"d
// status: 422
// statusText: "Unprocessable Entity"

// description: "Cannot find variant"
// message: "Cart Error"
// status: 404
// statusText: "Not Found"

//   "description": "You can only add 8 Messenger Bag to the cart.",
//   "message": "Cart Error",
//   "status": 422,
//   "statusText": "Unprocessable Entity"

  var cartInitialized = false;

  var initializeCartState = function() {
    $.getJSON('/cart.js', function(response) {
      $('.inline-cart-toggle').data('cart-initialized', true);
      $(document).trigger('stateChange', ['cart', response]);
    });
  };

  var updateCartToggleCount = function(count) {
    $('[data-dynamic-count]').html(count);
  };

  var initiateCartTransaction = function(action, quantity, id) {
    $.post('/cart/'+ action +'.js', { 'quantity': quantity, 'id': id }, function() {
      $.getJSON('/cart.js', function(response) {
        $(document).trigger('stateChange', ['cart', response]);
      });
    }, 'json')
    .fail(function(jqXHR) {
      Overlay.showOverlay('.alert', {
        message: 'We\'re sorry, this item is currently out of stock.',
        description:  'Please check again soon.'
      });
    });
  };

  var bindUIActions = function() {
    $('.inline-cart-toggle').on('click', function() {
      Overlay.showOverlay('.inline-cart', State.getState('cart'));
    });
    $(document).on('click', '.inline-cart-continue-shopping, .inline-cart-item-title, .inline-cart-item-image a', function() {
      Overlay.hideOverlay();
    });
    $(document).on('click', '.add-to-cart-button', function() {
      initiateCartTransaction('add', parseInt($('.add-to-cart-quantity').val()), $(this).attr('data-variant-id'));
    });
    $(document).on('click', '.inline-add-to-cart-button', function() {
      initiateCartTransaction('add', 1, $(this).attr('data-variant-id'));
    });
    $(document).on('click', '.inline-cart-item-remove i', function() {
      initiateCartTransaction('change', 0, $(this).attr('data-variant-id'));
    });
  };

  $(document).on('stateUpdated.cart', function(event, freshCart) {
    updateCartToggleCount(freshCart.item_count);
    if (cartInitialized) {
      Overlay.showOverlay('.inline-cart', freshCart);
    } else {
      cartInitialized = true;
    }
  });

// Public
  Cart.init = function() {
    initializeCartState();
    bindUIActions();
  };

}(window.Cart = window.Cart || {}, jQuery));

(function(Collections, $, undefined) {

// Private
  var collections = [];
  
  var getCollections = function() {
    $.get('//sunstaches.com/collections?view=endpoint', function(response) {
      response = JSON.parse(response);
      var deferreds = [];
      $.each(response.handles, function(index, handle) {
        var collectionRequest = $.get('//sunstaches.com/collections/'+ handle +'?view=endpoint', function(response) {
          response = JSON.parse(response);
          collections.push({
            "handle": handle,
            "productsCount": response.products.length,
            "products": response.products
          });
        });
        deferreds.push(collectionRequest);
      });
      $.when.apply($, deferreds).done(function() {
        $(document).trigger('stateChange', ['resources', {collections: 'loaded'}]);
      })
      .fail(function(jqXHR) {
        Overlay.showOverlay('.alert', {
          message: 'There was a problem loading some of the site resources. Please refresh and try loading the page again.',
          description: 'Resource Failed to Load: Collections'
        });
        $(document).trigger('stateChange', ['resources', {collections: 'failed'}]);
      });
    })
  };

// Public
  Collections.getCollectionByHandle = function(handle) {
    var result;
    $.each(collections, function(index, collection) {
      if (collection.handle === handle) {
        result = collection;
        return false;
      }
    });
    return result;
  };

  Collections.productIsMemberOf = function(productId) {
    var collections = [];
    $.each(collections, function(index, collection) {
      if (collection.products.indexOf(productId) !== -1) {
        collections.push(collection.title);
      }
    });
    return collections;
  };

  Collections.init = function() {
    getCollections();
  };

}(window.Collections = window.Collections || {}, jQuery));

(function(Contact, $, undefined) {

  var bindUIActions = function() {
    $('form.contact-form').submit(function(e){
      if (eval($("#question").val()) != $("#answer").val()) {
         $("#answer").css('box-shadow', '0px 0px 7px red');
         e.preventDefault(); 
      } else {
        Overlay.hideOverlay();
        $.post($(this).attr('action'), $(this).serialize(), function() {
          $('form.contact-form')[0].reset();
        });
        return false;
      }
    });
    $(document).on('click', '.contactform-link', function() {
      Overlay.showOverlay('.contact-form');
    });
  };
  
  Contact.init = function() {
    var n1 = Math.round(Math.random() * 10 + 1);
    var n2 = Math.round(Math.random() * 10 + 1);
    bindUIActions();
    $("#question").val(n1 + " + " + n2);
    
  };

}(window.Contact = window.Contact || {}, jQuery));

(function(Content, $, undefined) {

// Private
  var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var getRelatedProducts = function(amount, collection) {
    var randomProducts = [];
    var productIds = Collections.getCollectionByHandle(collection).products;
    while (randomProducts.length < amount && randomProducts.length < productIds.length) {
      var randomInt = getRandomInt(0, productIds.length);
      if (randomProducts.indexOf(productIds[randomInt]) === -1) {
        randomProducts.push(productIds[randomInt]);
      }
    }
    return randomProducts;
  };

  var imageConstructor = function(images) {
    var imageNodes = [];
    $.each(images, function(index, image) {
      imageNodes.push($('<img />', {src: image.src}));
    });
    return imageNodes;
  };

  var variantConstructor = function(variants) {
    var variantNodes = [];
    $.each(variants, function(index, variant) {
      variantNodes.push($('<option />', {'class': 'variant-option', text: variant.option1, 'data-variant-id': variant.id, 'data-variant-in-stock': variant.available, 'data-variant-sku': variant.sku }));
    });
    return variantNodes;
  };

  var initProductImages = function() {
    $('.image-thumbnail').first().addClass('is-active').find('img').clone().appendTo('[data-image-main]');
    if ($('.image-thumbnail').length < 2) {
      $('.image-thumbnails').hide();
    }
  };

  var seedContainer = function($container, data, $insertInto) {
    var images = imageConstructor(data.images);
    $container
      .attr('data-product-in-stock', data.available)
      .find('[data-product-sku]').html(data.variants[0].sku).end()
      .find('[data-product-link]').attr('href', '/products/' + data.handle).end()
      .find('[data-product-title]').html(data.title).end()
      .find('[data-product-description]').html(data.body_html).end()
      .find('[data-product-price]').attr('content', data.variants[0].price).html(data.variants[0].price).end()
      .find('[data-product-image]').attr('src', data.images[0].src).end()
      .find('[data-variant-id]').attr('data-variant-id', data.variants[0].id);
    if (data.variants.length > 1) {
      $container
        .find('[data-variants-select]').html(variantConstructor(data.variants)).end()
        .find('.product-variants-select').show();
    }
    $.each(images, function(index, image) {
      $container.find('[data-image-thumbnails]').append($('<div />', {'class': 'image-thumbnail'}).html(image));
    });
    $container.appendTo($insertInto);
  };

  var updateTemplateState = function(viewState) {
    var items;
    var $insertInto;
    switch (viewState.template) {
      case 'products':
        var productId = Products.getProduct(viewState.templateState).id;
        items = [viewState.templateState];
        $insertInto = $('[data-product-container]');
        Analytics.perfectAuidenceProductView(viewState.templateState);
        Analytics.klavyioPageView(viewState.templateState);
        updateTemplateState({template: 'relatedProducts', relatedProducts: viewState.relatedProducts});
        break;
      case 'collections':
        items = Collections.getCollectionByHandle(viewState.templateState).products;
        $insertInto = $('[data-collection-container]');
        $('.collection-grid-title').html(viewState.templateState.replace(/-/g, ' ').toUpperCase());
        $('.collection-grid-container').append($('<div />', {'class': 'grid-spacer'}));
        break;
      case 'homepage':
        items = Collections.getCollectionByHandle('best-sellers').products;
        $insertInto = $('[data-best-sellers-container]');
        Social.instagramFeed();
        $('.unslider').unslider({
          speed: 100,
          delay: 100,
          dots: false,
          fluid: true
        });
        break;
      case 'pages':
        items = [];
        $insertInto = $('[data-page-container]');
        var subTemplate = Templates.getTemplate(viewState.templateState);
        $insertInto.append(subTemplate);
        break;
      case 'relatedProducts':
        items = getRelatedProducts(4, viewState.relatedProducts);
        $insertInto = $('[data-related-products]');
        break;
      default:
        return false;
    }
    $.each(items, function(index, item) {
      var data = Products.getProduct(item);
      var $container = $(Templates.getTemplate(viewState.template + 'Item'));
      seedContainer($container, data, $insertInto);
    });
    initProductImages();
  };

  var bindUIActions = function() {
// Updates variant ID for add to cart button
    $(document).on('change', '.product-variants-select select', function() {
      $('.add-to-cart-button').attr('data-variant-id', $('option:selected', this).attr('data-variant-id'));
      $('.product-sku [data-product-sku]').html($('option:selected', this).attr('data-variant-sku'));
    });
// Increase or decrease product qty amount
    $(document).on('click', '.incrementor, .decrementer', function() {
      var freshAmount =  parseInt($('.add-to-cart-quantity').val()) + $(this).data('amount')
      $('.add-to-cart-quantity').val(freshAmount);
      if (freshAmount < 1) {
        $('.add-to-cart-quantity').val(1)
      }
    });
// Never let the product qty go below 1
    $(document).on('change', '.add-to-cart-quantity', function() {
      if ($(this).val() < 1) {
        $(this).val(1);
      }
    });
// Update main image and set it's thumbnail to active
    $(document).on('click', '.product-images .image-thumbnail img', function() {
      $('.product-images')
        .find('.image-main').empty().append($(this).clone()).end()
        .find('.image-thumbnail').removeClass('is-active');
      $(this).parent().addClass('is-active');
    });
// FAQ Accordion
    $(document).on('click', '.accordion > dt > a', function() {
      var itemIsVisible = $(this).parent().next().is(':visible') ? true : false;
      $('.accordion > dd').slideUp();
      if (!itemIsVisible) {
        $(this).parent().next().slideDown();
      }
      return false;
    });
    $(document).on('mouseenter', '.collection-grid-item .item-image, .collection-grid-item .inline-add-to-cart-button', function() {
      var $closestGridItem = $(this).closest('.collection-grid-item');
      if ($closestGridItem.data('product-in-stock') === true) {
        $closestGridItem.find('.inline-add-to-cart-button').css('opacity', '1.0');
      }
    });
    $(document).on('mouseleave', '.collection-grid-item .item-image, .collection-grid-item .inline-add-to-cart-button', function() {
    	$(this).closest('.collection-grid-item').find('.inline-add-to-cart-button').css('opacity', '0');
    });
  };

// Non-UI Event Bindings
  $(document).on('stateUpdated.view', function(event, freshState) {
    $('#guts').html(Templates.getTemplate(freshState.template));
    updateTemplateState(freshState);
  });

// Public
  Content.init = function() {
    bindUIActions();
  };

}(window.Content = window.Content || {}, jQuery ));

(function(Navigation, $, undefined) {

// Private
  var parsePath = function(path) {
    var parsedPath = {
      template: path.split('/')[1],
      templateState: path.split('/')[2],
      relatedProducts: populateRelatedProductsProperty(path.split('/')[1])
    };
    parsedPath = parsedPath.template === '' ? {template: 'homepage', templateState: '', relatedProducts: false} : parsedPath;
    return parsedPath;
  };

  var populateRelatedProductsProperty = function(freshTemplate) {
    var oldState = State.getState('view');
    var relatedProducts = false;
    if (freshTemplate === 'products') {
      if (['products', 'collections'].indexOf(oldState.template) !== -1) {
        relatedProducts = oldState.template === 'products' ? oldState.relatedProducts : oldState.templateState;
      } else {
        relatedProducts = 'best-sellers';
      }
    }
    return relatedProducts;
  };

  var prettyPrint = function(text) {
    var prettyText = text.replace(/-/g, ' ').replace(/\b\w/g, function(letter) {return letter.toUpperCase()});
    return prettyText;
  };
  
  var buildTitle = function(freshState) {
    var title = freshState.template === 'homepage' ? 'Sun-Staches | As Seen on Shark Tank' : prettyPrint(freshState.template)+ ' - ' +prettyPrint(freshState.templateState);
    return title;
  };
  
  var updateNavigation = function(freshState) {
    $('.navigation-item').removeClass('is-active').filter('[data-collection-handle="'+ freshState.templateState +'"]').addClass('is-active');
  };

  var bindUIActions = function() {
    $(document).on('click', 'a:not([href^="http"]):not(no-follow)', function() {
      window.scrollTo(0, 0);
      var freshState = parsePath($(this).attr('href'));
      history.pushState(freshState, '', $(this).attr('href'));
      $(document).trigger('stateChange', ['view', freshState]);
      return false;
    });
    $('.navigation-hamburger, .navigation-link:not(.logo-link)').on('click', function() {
      if ($('.navigation-hamburger').is(':visible')) {
        $('.site-topbar, .navigation-items').toggleClass('is-active');
      }
    });
    $('.navigation-link.logo-link').on('click', function() {
      $('.site-topbar, .navigation-items').removeClass('is-active');
    });
  };

// Non-UI Event Bindings
  $(document).on('stateUpdated.resources', function(event, resourceLoadState) {
    for (var resource in resourceLoadState) {
      if (resourceLoadState[resource] !== 'loaded') {
        return false;
      }
    }
    var initialState = parsePath(window.location.pathname);
    $(document).trigger('stateChange', ['view', initialState]).off('stateUpdated.resources');
  });

  $(window).on('popstate', function() {
    $(document).trigger('stateChange', ['view', history.state]);
  });
  
  $(document).on('stateUpdated.view', function(event, freshState) {
    history.replaceState(freshState, '', null);
    updateNavigation(freshState);
    var title = buildTitle(freshState);
    $('title').html(title);
    Analytics.gaPageView(freshState.template, freshState.templateState, title);
  });

// Public
  Navigation.init = function() {
    bindUIActions();
  };

}(window.Navigation = window.Navigation || {}, jQuery));

(function(Overlay, $, undefined) {

// Private
  var seedAlertOverlay = function(data) {
    $('.alert.overlay-container')
      .find('[data-alert-message]').html(data.message).end()
      .find('[data-alert-description]').html(data.description);
  };

  var buildInlineCartItem = function(item) {
    var $itemLink = $('<a />', {'href': '/products/' + item.handle, 'title': item.title});
    var $itemImage = $itemLink.clone().html($('<img />', {'src': item.image, 'alt': item.title}));
    var $itemQuantity = $('<span />', {'class': 'inline-cart-item-price', 'text': item.quantity + ' x '});
    var $itemTitle = $itemLink.text(item.product_title).addClass('inline-cart-item-title');
    var $itemPrice = $('<div />', {'class': 'inline-cart-item-price', 'text': '$' + item.line_price/100});
    var $itemRemove = $('<i />', {'class': 'fa fa-trash-o', 'data-variant-id': item.variant_id});
    return $('<div />', {'class': 'inline-cart-item', 'data-variant-id': item.variant_id})
      .append($('<div />', {'class': 'inline-cart-item-image'}).append($itemImage))
      .append($('<div />', {'class': 'inline-cart-item-information'}).append($itemQuantity, [$itemTitle, $itemPrice]))
      .append($('<div />', {'class': 'inline-cart-item-remove'}).append($itemRemove));
  };

  var buildInlineCartItems = function(freshState) {
    $('.inline-cart-items').empty();
    $.each(freshState.items, function(index, item) {
      buildInlineCartItem(item).appendTo('.inline-cart-items');
    });
    $('.inline-cart [data-inline-cart-subtotal]').html('$' + freshState.total_price/100);
  };

  var bindUIActions = function() {
    $(document).on('click', '.overlay, .overlay [class*="-close"]', function(event) {
      if (event.target === this) {
        Overlay.hideOverlay();
      }
    });
  };

// Public
  Overlay.showOverlay = function(overlayContainer, data) {
    switch (overlayContainer) {
      case '.alert':
        seedAlertOverlay(data);
        break;
      case '.inline-cart':
        buildInlineCartItems(data);
        break;
    }
    $('html').addClass('no-scroll');
    $('.overlay').find(overlayContainer).show().end().fadeIn('300');
  };

  Overlay.hideOverlay = function() {
    $('html').removeClass('no-scroll');
    $('.overlay, .overlay-container').fadeOut('300');
  };

  Overlay.init = function() {
    bindUIActions();
  };

}(window.Overlay = window.Overlay || {}, jQuery));

(function(Products, $, undefined) {

// Private
  var products = [];
  var limit = 250;  // supposed max number of returned items from ghost api
  
  var initializeProduct = function(imageSize, isCached) {
    $.each(products, function(index, product) {
      var inStock;
      $.each(product.variants, function(index, variant) {
        inStock = false;
        if (variant.available === true) {
          inStock = true;
          return false;
        }
      });
      $.each(product.images, function(index, image) {
        image.src = image.src.replace(/(\.jpg|\.jpeg|\.png)/g, '_'+ imageSize +'$1');
        if (isCached) {
          $('<img />', {src: image.src});  // precache all product images (no on mobile?)
        }
      });
      product.available = inStock;
    });
  };

  var getProducts = function() {
    var totalProductCount;
    $.getJSON('//sunstaches.com/collections.json?limit='+ limit, function(response) {
      $.each(response.collections, function(index, collection) {
        if (collection.handle === 'all') {
          totalProductCount = collection.products_count;
          return false;
        }
      });
    })
    .done(function() {
      var deferreds = [];
      for (var i = 0; i < totalProductCount / limit; i++) {
        var productRequest = $.getJSON('//sunstaches.com/products.json?limit='+ limit +'&page='+ i, function(response) {
          $.merge(products, response.products);
        });
        deferreds.push(productRequest);
      }
      $.when.apply($, deferreds).done(function() {
//        initializeProductImages('large', true);  // (image_size, precache_images)
//        initializeProduct('large', true);
          initializeProduct('large', false);
        $(document).trigger('stateChange', ['resources', {products: 'loaded'}]);
      })
      .fail(function(jqXHR) {
        Overlay.showOverlay('.alert', {
          message: 'There was a problem loading some of the site resources. Please refresh and try loading the page again.',
          description: 'Resource Failed to Load: Products'
        });
        $(document).trigger('stateChange', ['resources', {products: 'failed'}]);
      });
    });
  };

// Public
  Products.getProduct = function(query) {
    var queryType = typeof(query) === 'string' ? 'handle' : 'id';
    for (var product in products) {
      if (products[product][queryType] === query) {
        return products[product];
      }
    }
  };

  Products.init = function() {
    getProducts();
  };

}(window.Products = window.Products || {}, jQuery));

(function(Social, $, undefined) {

  (function(d){
    var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
    p.type = 'text/javascript';
    p.async = true;
    p.src = '//assets.pinterest.com/js/pinit.js';
    f.parentNode.insertBefore(p, f);
  }(document));

  var bindUIActions = function() {
    $(document).on('click', '.social-sharing-icon', function() {
      switch($(this).data('network')) {
        case 'facebook':
          window.open('http://www.facebook.com/sharer/sharer.php?u=' + window.location.href, 'Facebook', "width=600, height=400, scrollbars=no");
          break;
        case 'twitter':
          window.open('http://www.twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href), 'Tweet', "width=600, height=400, scrollbars=no");
          break;
        case 'pinterest':
          var url = encodeURIComponent(window.location.href);
          var imgURL = encodeURIComponent($('.image-main img').attr('src'));
          var description = $('.product-description').text();
          window.open('http://pinterest.com/pin/create/button/?url=' + url + '&media=' + imgURL + '&description=' + description, 'Pinterest', "width=600, height=400, scrollbars=no");
          break;
      }
    });
    $(document).on('click', '.instagram-thing-thumbnails a', function() {
      $('.main-image-entry-point').empty().append($(this).clone());;
      return false;
    });
  };

  Social.instagramFeed = function() {
    var instaUrl = 'https://api.instagram.com/v1/users/self/media/recent?access_token=1179155947.1677ed0.676857b0dccd463f82ec080a4e2b8832';
    $.get(instaUrl, function(response) {
      var i = 0;
      $.each(response.data, function(index, media) {
        if (i >= 4) {
          return false;
        }
        if (media.type === "image") { 
          var imgSrc = media.images.standard_resolution.url;
          var $image = $('<img />', { src: imgSrc });
          var $link = $('<a />', { href: media.link, html: $image, target: '_blank' });
          $('.instagram-thing-thumbnails').append($link)
          i++;
        }
      });
      $('.instagram-thing-thumbnails').children().first().clone().appendTo('.main-image-entry-point');
    }, 'jsonp');
  };


  Social.init = function() {
    bindUIActions();
  };

}(window.Social = window.Social || {}, jQuery));

(function(State, $, undefined) {

// Private
  var state = {
    resources: {
      templates: null,
      products: null,
      collections: null
    },
    view: {
      template: null,
      templateState: null,
      relatedProducts: null
    },
    cart: {}
  };

// Non-UI Event Bindings
  $(document).on('stateChange', function(event, property, freshState) {
    if (typeof freshState === 'object') {
      for (var key in freshState) {
        state[property][key] = freshState[key];
      }
      $(document).trigger('stateUpdated.' + property, [state[property]]);
    }
  });

// Public
  State.getState = function(property) {
    if (state.hasOwnProperty(property)) {
      return state[property];
    } else {
      return state;
    }
  };

}(window.State = window.State || {}, jQuery));

  (function(Templates, $, undefined) {

// Private
  var templates = {
    products: {
      location: '/products/template.html',
      data: null
    },
    productsItem: {
      location: '/products/item-template.html',
      data: null
    },
    relatedProductsItem: {
      location: '/collections/item-template.html',
      data: null
    },
    collections: {
      location: '/collections/template.html',
      data: null
    },
    collectionsItem: {
      location: '/collections/item-template.html',
      data: null
    },
    homepage: {
      location: '/index.html?view=template',
      data: null
    },
    homepageItem: {
      location: '/collections/item-template.html',
      data: null
    },
    pages: {
      location: '/pages/template.html',
      data: null
    },
    about: {
      location: '/pages/about.html?view=about-template',
      data: null
    },
    faq: {
      location: '/pages/faq.html?view=faq-template',
      data: null
    },
    retailers: {
      location: '/pages/retailers.html?view=retailers-template',
      data: null
    },
    'privacy-policy': {
      location: '/pages/privacy-policy.html?view=privacy-policy-template',
      data: null
    },
    terms: {
      location: '/pages/terms.html?view=terms-template',
      data: null
    },
    'marvel-products': {
      location: '/pages/marvel-products.html?view=generic-template',
      data: null
  	}
  };


	
  var getTemplates = function() {
    var deferreds = [];
    $.each(templates, function(template, templateInfo) {
      var templateRequest = $.get(templateInfo.location, function(response) {
        templateInfo.data = response;
      });
      deferreds.push(templateRequest);
    });
    $.when.apply($, deferreds).done(function() {
      $(document).trigger('stateChange', ['resources', {templates: 'loaded'}]);
    })
    .fail(function(jqHXR) {
      Overlay.showOverlay('.alert', {
        message: 'There was a problem loading some of the site resources. Please refresh and try loading the page again.',
        description: 'Resource Failed to Load: Templates'
      });
      $(document).trigger('stateChange', ['resources', {templates: 'failed'}]);
    });
  };

// Public
  Templates.getTemplate = function(template) {
    if (templates.hasOwnProperty(template)){
      return templates[template].data;
    }
  };

  Templates.init = function() {
    getTemplates();
  };

}(window.Templates = window.Templates || {}, jQuery));



(function() {

  Analytics.init();
  Collections.init();
  Products.init();
  Templates.init();
  Content.init();
  Navigation.init();
  Overlay.init();
  Cart.init();
  Contact.init();
  Social.init();

})();
