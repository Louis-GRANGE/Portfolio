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


HideShowChatBot();
function HideShowChatBot() {
  var chatdiv = document.getElementById("chatbot");
  var btn = document.getElementById("chatbotbutton");
  /*if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }*/
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
}



var GamePieces = [];
var myGamePiece;
var myObstacles = [];
var isMovingAllTime = false;
var Target;

function addPiece()
{
	myGamePiece = new component(30, 30, "#07B5A7", RandInt(window.innerWidth/2 + 22.5 - window.innerWidth/4, window.innerWidth/2 + 22.5 + window.innerHeight/4), RandInt(window.innerHeight/2 - window.innerHeight/4, window.innerHeight/2 + window.innerHeight/4));
	myGamePiece.gravity = 0.05;
	myObstacles.push(myGamePiece);
	GamePieces.push(myGamePiece);
}

function startGame() {
    //myGamePiece = new component(30, 30, "red", 10, 120);
    //myGamePiece.gravity = 0.05;
    
    /*myObstacles.push(new component(415, 33, "rgba(0, 0, 0, 0)", 739, 363));
    myGamePiece = new component(30, 30, "#07B5A7", window.innerWidth/2 - 22.5, innerHeight/2 - 22.5);
	myGamePiece.gravity = 0.05;
	SetToAllBaseColor();
	myObstacles.push(myGamePiece);
	GamePieces.push(myGamePiece);
    myGameArea.start();*/
    //GamePieces.push(myGamePiece);
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth - 20;
        this.canvas.height = document.body.scrollHeight + window.innerHeight / 4;//window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.canvas.width != window.innerWidth) {this.canvas.width = window.innerWidth - 20;}
        if (this.canvas.height != window.innerHeight) {this.canvas.height = document.body.scrollHeight + window.innerHeight / 4;}//window.innerHeight;}
    }
}



function component(widthparam, heightparam, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = widthparam;
    this.height = heightparam;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.colorstyle = color;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.heightground = Infinity;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = this.colorstyle;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
    	this.x += this.speedX;
        this.gravitySpeed += this.gravity;
    	if (this.gravity != 0)
        {
        	this.y += this.speedY + this.gravitySpeed;
        }
        
        this.hitBottom();
    }

    this.hitBottomheight = function() {
    	var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);

        for (var i = 0; i < myObstacles.length; i += 1)
        {
        	var otherleft = myObstacles[i].x;
	        var otherright = myObstacles[i].x + (myObstacles[i].width);

	        var othertop = myObstacles[i].y;
	        var otherbottom = myObstacles[i].y + (myObstacles[i].height);
        	if (this != myObstacles[i])
        	{
		        if(Math.abs((myleft - otherleft)) < this.width || Math.abs((myright - otherright)) < myObstacles[i].width && Math.abs((myleft - otherleft)) < myObstacles[i].width || Math.abs((myright - otherright)) < this.width)
		        {
		        	if(Math.abs((mytop - othertop)) < this.height || Math.abs((mybottom - otherbottom)) < this.height)
		        	{
		        		return (othertop - this.height);
		        	}
		        }
		    }
		}
		return (window.innerHeight + window.scrollY - 30)//myGameArea.canvas.height - this.height);

    }

    this.hitBottom = function() {
        var rockbottom = window.innerHeight + window.scrollY - 30;//myGameArea.canvas.height - this.height;
        if(this.heightground > rockbottom)
        	this.heightground = rockbottom;
        else
			this.heightground = this.hitBottomheight();
        

        if (this.y > this.heightground) {
        	this.y = this.heightground;
        	this.gravity = 0.05;
        	this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;

        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright))
            crash = false;

        return crash;
    }
}

function updateGameArea() {
    myGameArea.clear();
    for (var i = 0; i < myObstacles.length; i += 1) {
    	for (var j = 0; j <= GamePieces.length - 1; j++) {
	    	if (GamePieces[j] != myObstacles[i]) {
	    		
	    	}
	    }
	}

    for (var i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].update();
    }

    for (var i = 0; i <= GamePieces.length - 1; i++) {
    	GamePieces[i].newPos();
    	GamePieces[i].update();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}

document.addEventListener('keydown', function(e) {
  	//alert (`You pressed the "${e.key}"`);
  	if (e.key == 'd') {
	  	myGamePiece.speedX = 5;
  	}
  	if (e.key == 'q') {
  		myGamePiece.speedX = -5;
  	}
  	if (e.key == 'z') {
  		accelerate(-0.2)
  	}
  	if (e.key == 'a') {
  		for (var i = 0; i < GamePieces.length; i += 1)
        {
        	if (myGamePiece == GamePieces[i] && i > 0)
        	{
        		myGamePiece.colorstyle = "#068075";
        		myGamePiece = GamePieces[i - 1];
        		myGamePiece.colorstyle = "#07B5A7";
        		return;
		    }
		}
  	}
  	if (e.key == 'e') {
  		for (var i = 0; i < GamePieces.length; i += 1)
        {
        	if (myGamePiece == GamePieces[i] && i < GamePieces.length - 1)
        	{
        		myGamePiece.colorstyle = "#068075";
        		myGamePiece = GamePieces[i + 1];
        		myGamePiece.colorstyle = "#07B5A7";
        		return;
		    }
		}
  	}
  	if (e.key == 'r') {
  		for (var i = 0; i < GamePieces.length; i += 1)
        {
        	if (myGamePiece == GamePieces[i] && i < GamePieces.length - 1)
        	{
        		myGamePiece.colorstyle = "#068075";
        		myGamePiece = GamePieces[i + 1];
        		myGamePiece.colorstyle = "#07B5A7";
        		return;
		    }
		}
  	}

});
document.addEventListener('keyup', function(e) {
  	//alert (`You pressed the "${e.key}"`);
  	if (e.key == 'd') {
  		if (!isMovingAllTime) {myGamePiece.speedX = 0;}
  	}
  	if (e.key == 'q') {
  		if (!isMovingAllTime) {myGamePiece.speedX = 0;}
  	}
  	if (e.key == 'z') {
  		accelerate(0.05)
  	}
});

setInterval(function() {
	if (Target) {
		Target.x = lastMousePosX - Target.width/2;
		Target.y = lastMousePosY - Target.height/2;
		Target.gravity = 0.05;
		Target.gravitySpeed = 0;
	}
}, 5);

function SetPieceToMove(event)
{
	var x = event.clientX;
  	var y = event.clientY + window.scrollY;
  	//console.log("MousePos: ", x, " ", y);
  	if (Target == null)
  	{
	  	for (var i = GamePieces.length - 1; i >= 0; i--) {
	  		if(x >= GamePieces[i].x && y >= GamePieces[i].y && x <= GamePieces[i].x + GamePieces[i].width && y <= GamePieces[i].y + GamePieces[i].height)
	  		{
	  			Target = GamePieces[i];
	  			SetToAllBaseColor();
	  			Target.colorstyle = "#07B5A7";
	  			myGamePiece = Target;
	  		}
	  	}
	}
	else
	{
		Target = null;
	}
}

function SetToAllBaseColor()
{
	for (var i = 0; i < GamePieces.length; i += 1)
    {
       	GamePieces[i].colorstyle = "#068075";
	}
}