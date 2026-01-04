/*
	Overflow by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
(function($) {

	var	$window = $(window),
		$body = $('body'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 10

		};

	// Breakpoints.
		breakpoints({
			wide:    [ '1081px',  '1680px' ],
			normal:  [ '841px',   '1080px' ],
			narrow:  [ '737px',   '840px'  ],
			mobile:  [ null,      '736px'  ]
		});

	// Mobile?
		if (browser.mobile)
			$body.addClass('is-scroll');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly-middle').scrolly({
			speed: 1000,
			anchor: 'middle'
		});

		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() { return (breakpoints.active('<=mobile') ? 70 : 190); }
		});

	// Parallax background.

		// Disable parallax on IE/Edge (smooth scrolling is jerky), and on mobile platforms (= better performance).
			if (browser.name == 'ie'
			||	browser.name == 'edge'
			||	browser.mobile)
				settings.parallax = false;

		if (settings.parallax) {

			var $dummy = $(), $bg;

			$window
				.on('scroll.overflow_parallax', function() {

					// Adjust background position.
						$bg.css('background-position', 'center ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');

				})
				.on('resize.overflow_parallax', function() {

					// If we're in a situation where we need to temporarily disable parallax, do so.
						if (breakpoints.active('<=narrow')) {

							$body.css('background-position', '');
							$bg = $dummy;

						}

					// Otherwise, continue as normal.
						else
							$bg = $body;

					// Trigger scroll handler.
						$window.triggerHandler('scroll.overflow_parallax');

				})
				.trigger('resize.overflow_parallax');

		}

	// Poptrox.
		$('.gallery').poptrox({
			useBodyOverflow: false,
			usePopupEasyClose: false,
			overlayColor: '#0a1919',
			overlayOpacity: 0.75,
			usePopupDefaultStyling: false,
			usePopupCaption: true,
			popupLoaderText: '',
			windowMargin: 10,
			usePopupNav: true
		});

})(jQuery);


window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetCard = document.querySelector(hash);
        if (targetCard) {
            // Small timeout ensures the page is fully ready before scrolling/clicking
            setTimeout(() => {
                targetCard.scrollIntoView({ behavior: 'smooth' });
                targetCard.click();
            }, 100);
        }
    }
});

// Safety check: only add listener if the close button exists
const closeBtn = document.querySelector('.close');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        // Removes the #hash from the URL without reloading the page
        history.replaceState(null, null, window.location.pathname);
    });
}
/*
HideShowChatBot();
function HideShowChatBot() {
  var chatdiv = document.getElementById("chatbot");
  var btn = document.getElementById("chatbotbutton");

  if (chatdiv.style.height === "5vh") {
  	btn.firstChild.data = "CLOSE";

  	chatdiv.style.resize = "both";
    chatdiv.style.width = "15vw";
	chatdiv.style.height = "40vh";
  } else {
  	btn.firstChild.data = "OPEN";

  	chatdiv.style.resize = "none";
    chatdiv.style.width = "10vw";
	chatdiv.style.height = "5vh";
  }
}*/