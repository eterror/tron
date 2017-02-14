/*
    xTron by solaris (solargrim@gmail.com)

    some description

    Ideas for new release:
     -> multiplayer
     -> singleplayer (custom maps + timer + floating objects)
     -> menu
     -> half of fame
*/


// PREDEFINED VALUES
const version = "2.3";

// misc.js
// board.js
// player.js

/////////////////////////////////////////////////////////////////////////////////////
var swidth = 864;
var sheight = 675;

var mapx;
var mapy;

var c, canvas;

var timer = 65;

var psize = 5;

var pause = false;

var sound = true;
var s_boom = new Audio("sound/crash.mp3");
var s_turbo = new Audio('sound/turbo.mp3');
var s_engine = new Audio("sound/engine.wav");

var player = new TPlayer();
var mplayer = new TPlayer();

var hud = new THud();

var multiplayer = false;

var map = new TBoard(420, 400);

/////////////////////////////////////////////////////////////////////////////////////


function restart() {
    player.x = (map.boardx) / 2;
    player.y = (map.boardy) / 2;

    if (isOdd(player.x) == 1) player.x+=1;
    if (isOdd(player.y) == 1) player.y+=1;

    player.life = true;
    player.direction = dLeft;

    player.tempturbo = false;
    player.turbo = false;
    player.maxturbo = 19;
    player.cturbo  = player.maxturbo;

    player.maxjump = 39;
    player.cjump = player.maxjump;
    player.jump = false;
    
    sleep(300);
    map.clear();
    map.pwall.length = 1;
    map.level2();

    s_engine.play();
    s_engine.volume = .1;
}

function restartMP() {
	map.clear();
    map.level1();

    player.x = (map.boardx) / 2;
    player.y = (map.boardy) / 2;
    player.life = true;
    player.cturbo = 10;
    player.cjump = 10;
    player.direction = dLeft;

    mplayer.x = player.x;
    mplayer.y = player.y-50;
    mplayer.life = true;
    mplayer.cturbo = 10;
    mplayer.cjump = 10;
    mplayer.direction = dRight;
}

function checkCollision(dir) {
	if (map.board[player.x][player.y] != dFloor) {
		player.die();
		return true;
	}

	if (multiplayer && map.board[mplayer.x][mplayer.y] != dFloor) {
		mplayer.die();
		return true;
	}
}

// other stuff
function main() {
	if (menu) return 0;

	hud.draw(c);
	map.draw(c);

	if (pause) {
		c.font="50px Roboto";
		c.fillText('PAUSE', swidth/2 - 100, sheight/2);
		c.font="15px Roboto";
		return 0;
	}

	// Jump!
	if (player.jump && player.cjump >= 1) {

		switch (player.direction) {
			case dLeft: player.x-=(1*psize); break;
			case dRight: player.x+=(1*psize); break;
			case dUp: player.y-=(1*psize); break;
			case dDown: player.y+=(1*psize); break;
		}

		c.drawImage(player.jumpimg, player.x+mapx, player.y+mapy);

		player.jump = false;
		player.cjump-=1;
	}

	// Turbo!
	if (player.turbo && player.cturbo >= 1) {
		s_turbo.play();
		player.cturbo-=1;
		player.turbo = false;
		player.tempturbo = true;

		for (var i = 1; i <= 9; i++) {
			switch (player.direction) {
				case dLeft: player.x-=psize; break;
				case dRight: player.x+=psize; break;
				case dUp: player.y-=psize;break;
				case dDown: player.y+=psize; break;
			}

			if (checkCollision()) {
				break;
			};
		
			map.board[player.x][player.y] = dPlayer;
            player.draw(c);
		}
	}

	// Move!
	if (player.tempturbo == false) {
		switch (player.direction) {
			case dLeft: player.x-=psize; break;
			case dRight: player.x+=psize;  break;
			case dUp: player.y-=psize; break;
			case dDown: player.y+=psize; break;
		} 
	}

	if (!player.tempturbo)
		checkCollision();

	map.moveWalls();

    map.board[player.x][player.y] = dPlayer;
    player.draw(c);
    
    if (multiplayer) {
    	sPositionUpdate(player);
    	drawMPlayer();
    }

	if (player.life == false) {
    	if (sound) {
    		s_engine.pause();
    		s_engine.currentTime = 0;
    		s_boom.play();
    	}

    	player.kaboom(c);

    	if (multiplayer)
    		setTimeout(function(){restartMP()}, 0); else 
    		setTimeout(function(){restart()}, 0);
   	}

    // debug mode
    player.debug(c);

    player.tempturbo = false;
}

function getMousePos(canv, evt) {
	var rect = canv.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
}

function eventKey(k) {
	var key = k.keyCode;

    switch (key) {
    	// Move
		case 37: if (player.direction != dRight) player.direction = dLeft; break;
		case 39: if (player.direction != dLeft) player.direction = dRight; break;
		case 38: if (player.direction != dDown) player.direction = dUp; break;
		case 40: if (player.direction != dUp) player.direction = dDown; break;
		// Stuff
		case 88: player.turbo = true; break;
		case 90: player.jump = true; break;
		case 80: pause = !pause; break;
		case 82: if (multiplayer) restartMP(); else restart(); break;
		case 27: if (pause) pause = false; else pause = true; menu = !menu; break;
		// -------DEBUG
		case 81: player.debugger = !player.debugger; break;  // Q
		case 68: /*clearCanvas();*/ mapx+=psize; /*map.draw();*/ break;
		case 65: /*clearCanvas();*/ mapx-=psize; /*map.draw();*/ break;
		case 87: /*clearCanvas();*/ mapy-=psize; /*map.draw();*/ break;
		case 83: /*clearCanvas();*/ mapy+=psize; /*map.draw();*/ break;
		case 107: map.boardx+=20; map.boardy+=20; map.board = Array.matrix(map.boardx, map.boardy, 0); /*clearCanvas();*/ restart(); break;
		case 109: map.boardx-=20; map.boardy-=20; map.board = Array.matrix(map.boardx, map.boardy, 0); /*clearCanvas();*/ restart(); break;
		// -------DEBUG
    }

    if (menu) {
       switch (key) {
			case 38: menuUp(); break;
			case 40: menuDown(); break;	
			case 13: menuEnter(); break;
    	}
    }
}

function startSP() {
	console.debug('Starting singleplayer');
	multiplayer = false;
	restart();
	setInterval(main, timer);
}

function startMP() {
	multiplayer = true;
	sConnect();
    sInit();
    sPing();
    
    restartMP();

    setInterval(main, timer);
}

function initGame(canvas) {
    canvas = document.getElementById("game");
    c = canvas.getContext("2d");

    //event.preventDefault();

    window.addEventListener("keydown", this.eventKey, true);

    canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        map.edit(Math.trunc(mousePos.x/5), Math.trunc(mousePos.y/5));
      }, false);

    //event.preventDefault();
    
    canvas.width = swidth;
    canvas.height = sheight;

    c.font="15px Roboto";

	$(s_engine).bind('ended', function()  {
    	s_engine.currentTime = 0;
    	s_engine.play();
	});

	hud.load();

	mapx = 350;
	mapy = 130;

    map.borderimg.src = "img/border.png";
    map.wallimg.src = "img/wall.png";
    map.netimg.src = "img/net.png";
    map.mwallimg.src = "img/mwall.png";

    player.boomimg.src = "img/boom.png";
    player.jumpimg.src = "img/jump.png";

    mplayer.image.src = 'img/mp.png';

    player.image.onload = function() { c.fillText('loading', 50, 50); clearCanvas(); }
    player.image.src = "img/p1.png";

    initMenu();
    setInterval(drawMenu, 10);
}



// something went wrong