/*
	TBoard

	map edit, generate, draw, clear etc.
*/

const dFloor = 0;
const dBorder = 10;
const dWall = 2;
const dmWall = 3;
const dPlayer = 1;
const dJump = 99;


function TBoard(lengthX, lengthY) {
	this.boardx = lengthX;
	this.boardy = lengthY;
	this.borderimg = new Image();
	this.wallimg = new Image();
	this.netimg = new Image();
	this.mwallimg = new Image();
	this.board = Array.matrix(this.boardx, this.boardy, 0);

	function TWall() {
		this.x = 1;
		this.y = 1;
		this.show = true;
		this.fall = true;
		this.length = 1;
	}

	this.wall = new TWall();
	this.pwall = [];

	this.edit = function(x, y) { mapEdit(x, y) }
	
	this.moveWalls = function() { moveWalls(); }

	this.draw = function() {
		for (var i = 0; i < map.boardx; i+=psize)
      		for (var j = 0; j < map.boardy; j+=psize) {
      			switch (map.board[i][j]) {
      				case dFloor: c.drawImage(map.netimg, mapx+i, mapy+j); break;
      				case dWall: c.drawImage(map.wallimg, mapx+i, mapy+j); break;
      				case dmWall: c.drawImage(map.mwallimg, mapx+i, mapy+j); break;
      				case dBorder: c.drawImage(map.borderimg, mapx+i, mapy+j); break;
      				case dPlayer: c.drawImage(player.image, mapx+i, mapy+j); break;
      				//default dFloor: c.drawImage(map.netimg, i, j); break;
      			}
    		}
	}

	this.clear = function () {
		for (var i = 0; i < this.boardx; ++i)
			for (var j = 0; j < this.boardy; ++j){
      		   	this.board[i][j] = 0;
     		}
	}

	this.generate = function() {
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

		this.pwall[0] = new TWall();
		this.pwall[1] = new TWall();
		this.pwall[2] = new TWall();
		this.pwall[3] = new TWall();
	
		this.pwall[0].x = 50;
		this.pwall[0].y = psize;

		this.pwall[1].x = this.boardx-50;
		this.pwall[1].y = psize;

		this.pwall[2].x = 50;
		this.pwall[2].y = this.boardy-10;

		this.pwall[3].x = this.boardx-50;
		this.pwall[3].y = this.boardy-10;
		this.pwall[3].fall = false;


		// :)
		var c = 0;
		for (;;) {
			this.board[this.pwall[c].x][this.pwall[c].y] = dmWall;
			c+=1;
			if (c>=map.pwall.length) break;
		}
	}
}

function moveWalls() {
	var tx;

	for (let c = 0; c < map.pwall.length; ++c) {

		tx = map.pwall[c].x;

		switch (map.pwall[c].fall) {
			case true:  map.pwall[c].y += psize; break;
			case false: map.pwall[c].y -= psize; break;
		}
		
		if (map.board[map.pwall[c].x][map.pwall[c].y] != dFloor) {
			if (map.pwall[c].fall)
				map.pwall[c].y -= psize; else
				map.pwall[c].y +=  psize;

			map.pwall[c].fall = !map.pwall[c].fall;
			continue;
		}

		if (map.pwall[c].fall) {
			map.board[tx][map.pwall[c].y-psize] = dFloor
			map.board[tx][map.pwall[c].y] = dmWall; 
		} else {
			map.board[tx][map.pwall[c].y] = dmWall;
			map.board[tx][map.pwall[c].y+psize] = dFloor; 
		}

		
	}
}

function mapEdit(x, y) {
	var mx = x*psize, my = y*psize;

	if (mx-mapx >= map.boardx || my-mapy >= map.boardy) {
		return 0;
	}

	if (map.board[mx-mapx][my-mapy] == dBorder)
		return 0;

	if (map.board[mx-mapx][my-mapy] == dWall)
		map.board[mx-mapx][my-mapy] = dFloor; else
		map.board[mx-mapx][my-mapy] = dWall;
}

