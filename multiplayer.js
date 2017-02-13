 var socket;
 var mpConnected = false;
 var Network;
 var netID = 0;


 function sConnect() {
 	 socket = io.connect('http://solaris.wohlnet.ru:3000');

     socket.on('disconnect', function(s){
     	console.debug('Lost connection to server.');
     	mpConnected = false;
     });

     socket.on('connect', function(s){
     	mpConnected = true;
     });
 }


function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function sInit() {
	 player.name = makeid();

	 socket.emit ('initialize', player);

 	 socket.emit('PlayerJoined', player.name);

 	 socket.on('playerJoined', function (data) {
        addPlayer(data);
     });

 	 socket.on('playerData', function (data) {
        initPlayer(data);
     });

     socket.on('playerMoved', function (data) {
        movePlayer(data);
     });
}

function  initPlayer(data) {
	netID = data.id;
	data.players[netID].name = player.name;
	data.players[netID].id = data.id;
	player.id = netID;
	console.debug(data.players[netID].name+' initalized. My ID is '+netID);
}

function  addPlayer(data) {
	console.debug(data.name+' joined. Player ID is '+data.id);
}

function sPositionUpdate(data) {
	 socket.emit('positionUpdate', {id: netID, x: data.x, y: data.y, z: data.direction});
}

function movePlayer(data) {
	mplayer.x = data.x;
	mplayer.y = data.y;
	mplayer.direction = data.direction;
}

function drawMPlayer() {
	c.drawImage(mplayer.image, mplayer.x+mapx, mplayer.y+mapy);
	map.board[mplayer.x][mplayer.y] = dmPlayer;
}

function sPing() {
	setInterval (function () {
			socket.emit('ping', netID);
			//console.log('pinged as #' + netID);
	}, 1000);
}
