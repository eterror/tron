/*
	TBoard

	map edit, generate, draw, clear etc.
*/

/* Map sprites */
const dFloor = 0;
const dBorder = 10;
const dWall = 2;
const dmWall = 3;
const dPlayer = 1;
const dCoin = 9;
const dmPlayer = 66;
const dJump = 99;

/* map sprites: items */
const diJump = 200;
const diTurbo = 201;
const diRandom = 202;


function TBoard(lengthX, lengthY) {
	this.boardx = lengthX;
	this.boardy = lengthY;
	this.board = Array.matrix(this.boardx, this.boardy, 0);

	this.borderimg = new Image();
	this.wallimg = new Image();
	this.netimg = new Image();
	this.mwallimg = new Image();
	this.coinimg = new Image();

	function TWall() {
		this.x = 1;
		this.y = 1;
		this.show = true;
		this.static = false;
		this.horizon = false;
		this.fall = true;
		this.length = 1;
	}

	this.wall = [];
	this.wallc = 0;

	this.edit = function(x, y) {
		var mx = x*psize, my = y*psize;

		if (mx-mapx >= this.boardx || my-mapy >= this.boardy) {
			return 0;
		}

		if (this.board[mx-mapx][my-mapy] == dBorder)
			return 0;

		if (this.board[mx-mapx][my-mapy] == dWall) {
				this.board[mx-mapx][my-mapy] = dFloor;
			} else
				this.board[mx-mapx][my-mapy] = dWall;
	}
	
	this.moveWalls = function(dest) { moveWalls(dest); }

	this.draw = function(dest) {
		for (var i = 0; i < this.boardx; i+=psize)
      		for (var j = 0; j < this.boardy; j+=psize) {
      			switch (this.board[i][j]) {
      				case dFloor: dest.drawImage(this.netimg, mapx+i, mapy+j); break;
      				case dWall: dest.drawImage(this.wallimg, mapx+i, mapy+j); break;
      				case dmWall: dest.drawImage(this.mwallimg, mapx+i, mapy+j); break;
      				case dBorder: dest.drawImage(this.borderimg, mapx+i, mapy+j); break;
      				case dCoin: dest.drawImage(this.coinimg, mapx+i, mapy+j); break;
      				case dPlayer: dest.drawImage(player.image, mapx+i, mapy+j); break;
      				case dmPlayer: dest.drawImage(mplayer.image, mapx+i, mapy+j); break;
      			}
    		}
	}

	this.clear = function () {
		for (var i = 0; i < this.boardx; ++i)
			for (var j = 0; j < this.boardy; ++j){
      		   	this.board[i][j] = 0;
     		}

     	this.wall = [];
	}

	this.runMap = function(dest) {
		switch (dest) {
			case 0: this.level0(); break;
			case 1: this.level1(); break;
			case 2: this.level2(); break;
			case 3: this.level3(); break;
			case 4: this.level4(); break;
		}
	}

	this.level0 = function() { // TRAINING MAP
		for (var x = 0; x < this.boardx; ++x) {
			this.board[x][0] = dBorder; 
			this.board[x][this.boardy-psize] = dBorder; 
		}

		for (var x = 0; x < this.boardy; ++x) {
			this.board[0][x] = dBorder; 
			this.board[this.boardx-psize][x] = dBorder; 
		}
	}

	this.level1 = function() {
		for (var x = 0; x < this.boardx; ++x) {
			this.board[x][0] = dBorder; 
			this.board[x][this.boardy-psize] = dBorder; 
		}

		for (var x = 0; x < this.boardy; ++x) {
			this.board[0][x] = dBorder; 
			this.board[this.boardx-psize][x] = dBorder; 
		}
	
		for (var x = psize+50; x < this.boardy-psize-50; ++x) { 
			this.board[this.boardx-50][x] = dWall; 
			this.board[50][x] = dWall; 
		}

		this.wallc = 0; this.wall[this.wallc] = new TWall();
		this.wallc = 1; this.wall[this.wallc] = new TWall();
		this.wallc = 2; this.wall[this.wallc] = new TWall();
		this.wallc = 3; this.wall[this.wallc] = new TWall();
		this.wallc = 4; this.wall[this.wallc] = new TWall();
		this.wallc = 5; this.wall[this.wallc] = new TWall();
	
		this.wall[0].x = 50;
		this.wall[0].y = psize;

		this.wall[1].x = this.boardx-50;
		this.wall[1].y = psize;

		this.wall[2].x = 50;
		this.wall[2].y = this.boardy-10;

		this.wall[3].x = this.boardx-50;
		this.wall[3].y = this.boardy-10;
		this.wall[3].fall = false;

		this.wall[4].x = psize+50;
		this.wall[4].y = psize+50;
		this.wall[4].fall = true;
		this.wall[4].horizon = true;

		this.wall[5].x = this.boardx-psize-50;
		this.wall[5].y = this.boardy-50-psize-psize;
		this.wall[5].fall = false;
		this.wall[5].horizon = true;
		this.wall[5].show = true;
	}

	this.level2 = function() {
		for (var x = 0; x < this.boardx; ++x) {
			this.board[x][0] = dBorder; 
			this.board[x][this.boardy-psize] = dBorder; 
		}

		for (var x = 0; x < this.boardy; ++x) {
			this.board[0][x] = dBorder; 
			this.board[this.boardx-psize][x] = dBorder; 
		}

		this.wallc = 0;
		let c = psize;

		for (var k = psize; k < map.boardx; k+=5) {
			this.wall[this.wallc] = new TWall();
			this.wall[this.wallc].x = k;
			this.wall[this.wallc].y = psize;
			this.wall[this.wallc].fall = true;
			this.wall[this.wallc].horizon = false;
			++this.wallc;
		}

		for (var k = psize; k < map.boardx-psize; k+=5) {
			this.wall[this.wallc] = new TWall();
			this.wall[this.wallc].x = psize;
			this.wall[this.wallc].y = k;
			this.wall[this.wallc].fall = true;
			this.wall[this.wallc].horizon = true;
			++this.wallc;
		}
	}

	this.level3 = function() {
		for (var x = 0; x < this.boardx; ++x) {
			this.board[x][0] = dBorder; 
			this.board[x][this.boardy-psize] = dBorder; 
		}

		for (var x = 0; x < this.boardy; ++x) {
			this.board[0][x] = dBorder; 
			this.board[this.boardx-psize][x] = dBorder; 
		}
		for (let y = 50; y < (this.boardy*psize); y+=50) 
			for (let x = psize; x < this.boardx-psize-15; ++x) this.board[x][y] = dWall; 

		for (let y = 25; y < (this.boardy*psize); y+=50) 
			for (let x = psize+15+psize; x < this.boardx-psize; ++x) this.board[x][y] = dBorder; 

		this.board[this.boardx-psize*3][this.boardy-psize*3] = dCoin;

		player.x = this.boardx - psize;
		player.y = psize+psize;
		player.direction = dLeft;
	}

	this.level4 = function() {
		for (var x = 0; x < this.boardx; ++x) {
			this.board[x][0] = dBorder; 
			this.board[x][this.boardy-psize] = dBorder; 
		}

		for (var x = 0; x < this.boardy; ++x) {
			this.board[0][x] = dBorder; 
			this.board[this.boardx-psize][x] = dBorder; 
		}

		player.direction = dRight;
	}

}

function moveWalls(dest) {
	var tx, ty;

	if (dest.wall.length == 0) {
		return 0;
	}

	for (let c = 0; c < dest.wall.length; ++c) {
		tx = dest.wall[c].x;
		ty = dest.wall[c].y;

		// Hidden wall?
		if (!dest.wall[c].show) {
			continue;
		}

		// Static wall
		if (dest.wall[c].static) {
			dest.board[tx][ty] = dmWall;
			continue;
		}

		// move Horizontaly
		if (dest.wall[c].horizon) {
			switch (dest.wall[c].fall) {
				case true:  dest.wall[c].x += psize; break;
				case false: dest.wall[c].x -= psize; break;
			}

			if (dest.board[dest.wall[c].x][dest.wall[c].y] != dFloor) {
				if (dest.wall[c].fall)
					dest.wall[c].x -= psize; else
					dest.wall[c].x += psize;

					dest.wall[c].fall = !dest.wall[c].fall;
					continue;
				}

			if (dest.wall[c].fall) {
				dest.board[dest.wall[c].x-psize][ty] = dFloor;
				dest.board[dest.wall[c].x][ty] = dmWall; 
			} else {
				dest.board[dest.wall[c].x][ty] = dmWall;
				dest.board[dest.wall[c].x+psize][ty] = dFloor; 
			}
		} else {
		// move Verticaly
			switch (dest.wall[c].fall) {
				case true:  dest.wall[c].y += psize; break;
				case false: dest.wall[c].y -= psize; break;
			}
		
			if (dest.board[dest.wall[c].x][dest.wall[c].y] != dFloor) {
				if (dest.wall[c].fall)
					dest.wall[c].y -= psize; else
					dest.wall[c].y += psize;

					dest.wall[c].fall = !dest.wall[c].fall;
					continue;
				}

			if (dest.wall[c].fall) {
				dest.board[tx][dest.wall[c].y-psize] = dFloor;
				dest.board[tx][dest.wall[c].y] = dmWall; 
			} else {
				dest.board[tx][dest.wall[c].y] = dmWall;
				dest.board[tx][dest.wall[c].y+psize] = dFloor; 
			}
		}

	} // for
}
