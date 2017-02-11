function TBoard() {
	this.boardx = 400;
	this.boardy = 400;
	this.borderimg = new Image();
	this.wallimg = new Image();
	this.netimg = new Image();
	this.board = Array.matrix(this.boardx, this.boardy, 0);
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