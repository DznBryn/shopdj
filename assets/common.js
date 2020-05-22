(function($) {
	$(function() {
		$(function() {
			fixBoxShadowBlur($('*'));
		});

		function fixBoxShadowBlur(jQueryObject) {
			if ($.browser.msie && $.browser.version.substr(0, 1) == '9') {
				jQueryObject.each(function() {
					boxShadow = $(this).css('boxShadow');
					if (boxShadow != 'none') {
						var bsArr = boxShadow.split(' ');
						bsBlur = parseInt(bsArr[2]) || 0;
						bsBlurMeasureType = bsArr[2].substr(('' + bsBlur).length);
						bsArr[2] = bsBlur * 2 + bsBlurMeasureType;
						$(this).css('boxShadow', bsArr.join(' '));
					}
				});
			}
		}

		$(window).scroll(function() {
			if ($(window).scrollTop() >= 181) {
				$('#navWrapper').addClass('fixedNavWrapper');
				$('#topHeader').addClass('fixedNavPadding');
			} else {
				$('#navWrapper').removeClass('fixedNavWrapper');
				$('#topHeader').removeClass('fixedNavPadding');
			}
		});

		$('#searchInput').bind('focus', function() {
			$(this).animate({ width: '130' }, 'fast');
		});
		$('#searchInput').bind('blur', function() {
			if ($(this).val().length === 0) {
				$(this).animate({ width: '100' }, 'fast');
			}
		});

		//cache nav
		var nav = $('#mainNav');

		//add indicators and hovers to submenu parents
		nav.find('li').each(function() {
			if ($(this).find('ul').length > 0) {
				//show subnav on hover
				$(this).mouseenter(function() {
					$(this)
						.addClass('hoveredPage')
						.find('ul')
						.stop(true, true)
						.fadeIn('fast');
				});

				//hide submenus on exit
				$(this).mouseleave(function() {
					$(this)
						.removeClass('hoveredPage')
						.find('ul')
						.stop(true, true)
						.fadeOut('fast');
				});
			}
		});

		// Create the dropdown base
		$('<select />').appendTo('#navWrapper');

		// Create default option "Go to..."
		$('<option />', {
			selected: 'selected',
			value: '',
			text: 'Menu...'
		}).appendTo('#navWrapper select');

		// Populate dropdown with menu items
		$('#navWrapper a').each(function() {
			var el = $(this);
			$('<option />', {
				value: el.attr('href'),
				text: el.text()
			}).appendTo('#navWrapper select');
		});

		// To make dropdown actually work
		$('#navWrapper select').change(function() {
			window.location = $(this)
				.find('option:selected')
				.val();
		});

		// Create the dropdown base
		$('<select />').appendTo('#footerNavWrapper');

		// Create default option "Go to..."
		$('<option />', {
			selected: 'selected',
			value: '',
			text: 'Helpful Links...'
		}).appendTo('#footerNavWrapper select');

		// Populate dropdown with menu items
		$('#footerNavWrapper a').each(function() {
			var el = $(this);
			$('<option />', {
				value: el.attr('href'),
				text: el.text()
			}).appendTo('#footerNavWrapper select');
		});

		// To make dropdown actually work
		$('#footerNavWrapper select').change(function() {
			window.location = $(this)
				.find('option:selected')
				.val();
		});
	});
})(jQuery);
