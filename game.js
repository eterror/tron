/*
    xTron by solaris (solargrim@gmail.com)

    a next tron game clone ;)

    Ideas for new release:
     -> multiplayer (head2head, head2cpu, online)
     -> singleplayer (custom maps + timer + floating objects)
     -> menu
     -> half of fame
*/

const version = "1.0.9";

// misc.js
// board.js
// player.js
// multiplayer.js
// menu.js
// mission.js

/////////////////////////////////////////////////////////////////////////////////////
var swidth = 864;
var sheight = 675;

var map = new TBoard(420, 400);
var mapx, mapy;

var c, canvas;

var timer = 50;

var psize = 5;

var pause = false;
var multiplayer = false;

var sound = true;
var s_boom = new Audio("sound/crash.mp3");
var s_turbo = new Audio('sound/turbo.mp3');
var s_engine = new Audio("sound/engine.wav");
var s_win = new Audio("sound/win.wav");
var s_jump = new Audio("sound/jump.wav");

var player = new TPlayer();
var mplayer = new TPlayer();

var hud = new THud();

var mission = [];

var counter;
var mtime;
var tgame;
var tmenu;
var tres;

//var fps = new FPSMeter();

/////////////////////////////////////////////////////////////////////////////////////
function missionTime() {
	if (menu)
		return;

	if (mission.current != 0)
		mtime-=1;

	if (mtime <= 0) {
		if (mission[mission.current].goal == dmCollect) {
			console.debug('Timeout!');
			player.die();
			return;
		} else {
			if (sound)
				s_win.play();

			player.win(c);
			mission.current+=1;

			if (mission.current >= mission.length)
				mission.current=0;

			player.die();
		}

		return;	
	}
}

function restart() {
    player.x = (map.boardx) / 2;
    player.y = (map.boardy) / 2;

    if (isOdd(player.x) == 1) player.x+=1;
    if (isOdd(player.y) == 1) player.y+=1;

    player.life = true;
    player.direction = dLeft;

    player.tempturbo = false;
    player.turbo = false;
    player.maxturbo = mission[mission.current].turbos;
    player.cturbo  = player.maxturbo;

    player.maxjump = mission[mission.current].jumps;
    player.cjump = player.maxjump;
    player.jump = false;

    s_engine.play();
    s_engine.volume = .1;

    map.clear();
	map.runMap(mission.current);

	mtime = mission[mission.current].timer;
	counter = setInterval(missionTime, 1000);
}

function restartMulti() {
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

    mission.current = 0;

    map.clear();
    map.runMap(0);
}

function checkCollision(dir) {
	if (map.board[player.x][player.y] != dFloor) {

		if (mission[mission.current].goal == dmCollect && map.board[player.x][player.y] == dCoin) {
			console.debug('YOU WIN!');
			s_win.play();
			player.win(c);
			mission.current+=1;

			if (mission.current >= mission.length) {
				console.debug("No more levels");
				mission.current = 0;
				player.die();

				return;
			}

			return;
		}

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
	//fps.tickStart();

	if (menu)
		return 0;

	hud.draw(c);
	map.draw(c);

	s_engine.volume = .1;

	if (pause) {
		c.font="50px Roboto";
		c.fillStyle = "red";
		c.strokeStyle = "white";
		c.strokeText('PAUSE', swidth/2 - 100, sheight/2);
		c.fillText('PAUSE', swidth/2 - 100, sheight/2);
		c.font="15px Roboto";
		c.fillStyle = "white";
		return 0;
	}

	/* Mission types */
	if (mission[mission.current].goal == dmArmageddon) {
		let rx = getRandom(psize, map.boardx/5-psize);
		let ry = getRandom(psize, map.boardx/5-psize-psize);

		rx*=psize;
		ry*=psize;

		if (rx != player.x && ry != player.y)
			if (map.board[rx][ry] != dPlayer) 
				map.board[rx][ry] = dWall;
	}

	// Jump!
	if (player.jump && player.cjump >= 1) {

		if (sound)
			s_jump.play();

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

	map.moveWalls(map);

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

    		if (!player.won)
    			s_boom.play();

    		player.won = false;
    	}

    	player.kaboom(c);

    	if (multiplayer) 
    		startSingle(mission.current); else
    		startMulti();

    	return;
   	}

    // debug mode
    player.debug(c);

    player.tempturbo = false;

    //fps.tick();
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

	//k.preventDefault()

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
		case 82: if (multiplayer) restartMulti(); else restart(); break;
		case 27: menu = !menu; break;
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
       s_engine.volume = 0;
       tmenu = setInterval(drawMenu, 1);

       switch (key) {
			case 38: menuUp(); break;
			case 40: menuDown(); break;	
			case 13: menuEnter(); break;
			case 37: menuLeft(); break;
			case 39: menuRight(); break;
    	}
    }
}

function startSingle(level) {
	if (tgame != null)
		clearInterval(tgame);

	if (tmenu != null)
		clearInterval(tmenu);

	if (counter != null)
		clearInterval(counter);

	console.debug('Starting :: '+level+" ("+mission[level].name+")");
	mission.current = level;
	restart();
	tgame = setInterval(main, timer);
}

function startMulti() {
	if (tgame != null)
		clearInterval(tgame);

	if (tmenu != null)
		clearInterval(tmenu);

	console.debug('Starting Multiplayer');
	multiplayer = true;
	
	sConnect();
    sInit();
    sPing();
    
    restartMulti();

    tgame = setInterval(main, timer);
}

function startHead2Head() {
	console.debug('Starting Head 2 Head');

	tgame = setInterval(main, timer);
	return;
}

function initGame(canvas) {
    canvas = document.getElementById("game");
    c = canvas.getContext("2d");

    window.addEventListener("keydown", this.eventKey, true);

    canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        if (!menu) 
        	map.edit(Math.trunc(mousePos.x/5), Math.trunc(mousePos.y/5));
      }, false);
    
    canvas.width = swidth;
    canvas.height = sheight;

    c.font="15px Roboto";

	$(s_engine).bind('ended', function()  {
    	s_engine.currentTime = 0;
    	s_engine.play();
	});

	mapx = 350;
	mapy = 130;

    player.boomimg.src = "img/boom.png";
    player.jumpimg.src = "img/jump.png";
    player.image.onload = function() { c.fillText('loading', 50, 50); clearCanvas(); }
    player.image.src = "img/p1.png";

    map.borderimg.src = "img/border.png";
    map.wallimg.src = "img/wall.png";
    map.netimg.src = "img/floor.png";
    map.mwallimg.src = "img/mwall.png";
    map.coinimg.src = "img/coin.png";

    mplayer.image.src = 'img/mp.png';

    hud.load();

    mission[0] = new TMission("Training", "Training", dmTraining, 999, 999, 999);
	mission[1] = new TMission('WARM-UP', "You have to survive in the designated Time!", dmSurvive, 10, 5, 5);
	mission[2] = new TMission("ENEMY", "You have to survive in the designated Time!", dmSurvive, 15, 10, 1);
	mission[3] = new TMission("LABIRYNTH", "Collect this coin fast as you can! Use Turbo!", dmCollect, 45, 99, 0);
	mission[4] = new TMission("ARMAGEDDON", "Run away!", dmArmageddon, 15, 10, 0);

    initMenu();
    tmenu = setInterval(drawMenu, 1);
    /* level testing */ // menu = false; startSingle(4);
}



// something went wrong