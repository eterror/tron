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

var timer = 60;

var psize = 5;

var pause = false;
var multiplayer = false;

var sound = true;
var s_boom = new Audio("sound/crash.mp3");
var s_turbo = new Audio('sound/turbo.mp3');
var s_engine = new Audio("sound/engine.wav");
var s_win = new Audio("sound/win.wav");

var player = new TPlayer();
var mplayer = new TPlayer();

var hud = new THud();

var mission = [];
var cmission = 0;

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

	if (cmission != 0)
		mtime-=1;

	if (mtime <= 0) {
		if (mission[cmission].goal == dmCollect) {
			console.debug('Timeout!');
			player.die();
		} else {
			s_win.play();
			player.win(c);
			cmission+=1;
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
    player.maxturbo = mission[cmission].turbos;
    player.cturbo  = player.maxturbo;

    player.maxjump = mission[cmission].jumps;
    player.cjump = player.maxjump;
    player.jump = false;

    s_engine.play();
    s_engine.volume = .1;

    map.clear();
	map.runMap(cmission);

	mtime = mission[cmission].timer;
	counter = setInterval(missionTime, 1000);
}

function restartMP() {
	map.clear();
    map.level0();

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

		if (mission[cmission].goal == dmCollect && map.board[player.x][player.y] == dCoin) {
			console.debug('YOU WIN!');
			s_win.play();
			player.win(c);
			cmission+=1;

			if (cmission >= mission.length) {
				console.debug("No more levels");
				cmission = 0;
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

	map.moveWalls(map);

    map.board[player.x][player.y] = dPlayer;
    player.draw(c);
    
    if (multiplayer) {
    	sPositionUpdate(player);
    	drawMPlayer();
    }

	if (player.life == false) {
    	if (sound && !player.won) {
    		s_engine.pause();
    		s_engine.currentTime = 0;
    		s_boom.play();
    		player.won = false;
    	}

    	player.kaboom(c);

    	startSingle(cmission);
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
		case 82: if (multiplayer) restartMP(); else restart(); break;
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
	cmission = level;
	restart();
	tgame = setInterval(main, timer);
}

function startMulti() {
	console.debug('Starting Multiplayer');
	multiplayer = true;
	sConnect();
    sInit();
    sPing();
    
    restartMP();

    tgame = setInterval(main, timer);
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

    cmission = 0;

    mission[0] = new TMission();
    mission[0].description = "Training";
    mission[0].name = "Training";
    mission[0].timer = 999;
    mission[0].goal = dmTraining;
    mission[0].turbos = 999;
    mission[0].jumps = 999;

	mission[1] = new TMission();
	mission[1].id = 1;
	mission[1].description = "You have to survive in the designated Time!";
	mission[1].name = 'WARM-UP';
	mission[1].goal = dmSurvive;
	mission[1].timer = 10;
	mission[1].turbos = 5;
	mission[1].jumps = 5;

	mission[2] = new TMission();
	mission[2].id = 2;
	mission[2].description = "You have to survive in the designated Time!";
	mission[2].name = "ENEMY";
	mission[2].goal = dmSurvive;
	mission[2].timer = 15;
	mission[2].turbos = 10;
	mission[2].jumps = 1;

	mission[3] = new TMission();
	mission[3].id = 3;
	mission[3].description = "Collect this coin fast as you can! Use Turbo!";
	mission[3].name = "LABIRYNTH";
	mission[3].goal = dmCollect;
	mission[3].timer = 45;
	mission[3].turbos = 99;
	mission[3].jumps = 0;

    initMenu();
    tmenu = setInterval(drawMenu, 1);
    /* level testing */ // menu = false; cmission = 1; startSingle(1);
}



// something went wrong