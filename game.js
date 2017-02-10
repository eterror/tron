// xTron by solaris (solargrim@gmail.com)

// in future:
// moving walls
// multiplayer
// highscores (multi)
// player dbase
// single + editor
// custom maps hey hey hey??? etetert

Array.matrix = function(numrows, numcols, initial){
   var arr = [];
   for (var i = 0; i < numrows; ++i){
      var columns = [];
      for (var j = 0; j < numcols; ++j){
         columns[j] = initial;
      }
      arr[i] = columns;
    }
    return arr;
}

// PREDEFINED VALUES
const version = 2.0.4;

const dLeft = 0;
const dRight = 1;
const dUp = 2;
const dDown = 3;
const dFloor = 0;
const dBorder = 10;
const dWall = 2;
const dPlayer = 1;
const dJump = 99;

// objects
function TBoard() {
	this.boardx = 400;
	this.boardy = 400;
	this.borderimg = new Image();
	this.wallimg = new Image();
	this.netimg = new Image();
	this.board = Array.matrix(this.boardx, this.boardy, 0);
}

function TPlayer(X, Y) {
    this.x = X;
    this.y = Y;
    this.id = 1;
    this.direction = dRight;
    this.image = new Image();
    this.boomimg = new Image();
    this.jumpimg = new Image();
    this.life = true;
    this.trubo = false;
    this.tempturbo = false;
    this.cturbo;
    this.jump = false;
    this.cjump;
    this.debugger = true;
    

    this.draw = function(destination) { destination.drawImage(this.image, this.x, this.y) }
    this.die = function() { this.life = false; } 
    this.print = function() { console.log('px: '+this.x + 'py: ' + this.y + '\n' + 'Life?: '+this.life) }

    this.kaboom = function(destination) { 
    	destination.drawImage(this.boomimg, this.x, this.y);
    }

    this.debug = function (destination) { 
    	var dstr;

    	if (!this.debugger) {
    		destination.fillStyle = "white";
    		destination.fillRect(swidth-160, 10, 150, 120);

    		return 0;
    	}

    	if (this.direction == dLeft) dstr="Left"; if (this.direction == dRight) dstr="Right";
    	if (this.direction == dUp) dstr="Up"; if (this.direction == dDown) dstr="Down";

    	destination.fillStyle = "gray";
    	destination.fillRect(swidth-160, 10, 150, 120);
    	destination.fillStyle = "black";
    	destination.font = "15px Arial";
    	destination.fillText('x: '+this.x+' mx: '+Math.floor(this.x/psize), swidth-150, 30);
    	destination.fillText('y: '+this.y+' my: '+Math.floor(this.y/psize), swidth-150, 45);
    	destination.fillText('Direction: '+dstr, swidth-150, 60);
    	destination.fillText('Turbo: '+this.cturbo, swidth-150, 75);
    	destination.fillText('Jump: '+this.cjump, swidth-150, 90);
    	destination.fillText('Life: '+this.life, swidth-150, 105);
    	destination.fillText('Turbo: '+this.tempturbo, swidth-150, 120);
    }
}


// global sets
var swidth = 600;
var sheight = 400;

var c, canvas;

var timer = 60;

var psize = 5;

var pause = false;

var sound = true;
var s_boom = new Audio("sound/crash.mp3");
var s_turbo = new Audio('sound/turbo.mp3');
var s_engine = new Audio("sound/engine.wav");

var player = new TPlayer(1, 1);
var map = new TBoard();


function isOdd(num) { return num % 2;}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
 }

function restart() {
    player.x = (map.boardx) / 2;
    player.y = (map.boardy) / 2;

    if (isOdd(player.x) == 1) player.x+=1;
    if (isOdd(player.y) == 1) player.y+=1;

    player.life = true;
    player.direction = dLeft;
    player.cturbo = 99;
    player.tempturbo = false;
    player.cjump = 99;
    player.jump = false;
    player.turbo = false;

    sleep(500);
    clearMap();
    generateMap();
    drawMap();

    s_engine.play();
    s_engine.volume = .4;
}

function clearMap() {
	for (var i = 0; i < map.boardx; ++i)
     for (var j = 0; j < map.boardy; ++j){
         map.board[i][j] = 0;
     }
}

function generateMap() {
	for (var x = 0; x < map.boardx; ++x) {map.board[x][0] = dBorder; map.board[x][map.boardy-psize] = dBorder; }
	for (var x = 0; x < map.boardx; ++x) {map.board[0][x] = dBorder; map.board[map.boardx-psize][x] = dBorder; }

		for (var x = psize+50; x < map.boardx-psize-50; ++x) { map.board[map.boardx-50][x] = dWall; }
		for (var x = psize+50; x < map.boardx-psize-50; ++x) { map.board[50][x] = dWall; }
}

function drawMap() {
	for (var i = 0; i < map.boardx; i+=5)
      for (var j = 0; j < map.boardy; j+=5){
      	switch (map.board[i][j]) {
      		case dFloor: c.drawImage(map.netimg, i, j); break;
      		case dWall: c.drawImage(map.wallimg, i, j); break;
      		case dBorder: c.drawImage(map.borderimg, i, j); break;
      	}
     }
}


function mapEdit(x, y) {
	var mx = x*5, my = y*5;

	if (mx >= map.boardx || my >= map.boardy) {
		return 0;
	}

	if (map.board[mx][my] == dBorder)
		return 0;

	if (map.board[mx][my] == dWall)
		map.board[mx][my] = dFloor; else
		map.board[mx][my] = dWall;
}

function checkCollision(dir) {
	if (player.x <= 1) { console.debug("Why?"); player.die(); return true; } // ?? :)

	if (map.board[player.x][player.y] != dFloor) {
		player.die();
		return true;
	}
}

// other stuff
function main() {
	drawMap();

	if (pause) {
		c.fillText('PAUSE', swidth/2-20, sheight/2)
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

		c.drawImage(player.jumpimg, player.x, player.y);

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

	player.draw(c);
    	map.board[player.x][player.y] = dPlayer;

	if (player.life == false) {
    	if (sound) {
    		s_engine.pause();
    		s_engine.currentTime = 0;
    		s_boom.play();
    	}

    	player.kaboom(c);

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
		case 37: if (player.direction != dRight) player.direction = dLeft; break;
		case 39: if (player.direction != dLeft) player.direction = dRight; break;
		case 38: if (player.direction != dDown) player.direction = dUp; break;
		case 40: if (player.direction != dUp) player.direction = dDown; break;
		case 88: player.turbo = true; break;
		case 90: player.jump = true; break;
		case 80: pause = !pause; break;
		case 68: player.debugger = !player.debugger; break;
		case 27: restart(); break;
    }
}


function clearCanvas() {
	c.clearRect(0, 0, swidth, sheight);
}


function initGame(canvas) {
    canvas = document.getElementById("game");
    c = canvas.getContext("2d");

    window.addEventListener("keydown", this.eventKey, true);

    canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        mapEdit(Math.trunc(mousePos.x/5), Math.trunc(mousePos.y/5));
      }, false);
    
    canvas.width = swidth;
    canvas.height = sheight;

	$(s_engine).bind('ended', function()  {
    	s_engine.currentTime = 0;
    	s_engine.play();
	});

    map.borderimg.src = "img/border.png";
    map.wallimg.src = "img/wall.png";
    map.netimg.src = "img/net.png";

    player.boomimg.src = "img/boom.png";
    player.jumpimg.src = "img/jump.png";
      
    player.image.onload = function() { c.font="20px Consolas"; c.fillText('loading', 50, 50); clearCanvas(); }
    player.image.src = "img/p1.png";

    restart();
    
    setInterval(main, timer);
}



// something went wrong