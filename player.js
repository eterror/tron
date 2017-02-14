/*
	TPlayer
*/

const dLeft = 0;
const dRight = 1;
const dUp = 2;
const dDown = 3;

function TPlayer(X, Y) {
    this.x = X;
    this.y = Y;
    this.id = 0;
    this.direction = dRight;
    this.image = new Image();
    this.boomimg = new Image();
    this.jumpimg = new Image();
    this.life = true;
    this.trubo = false;
    this.tempturbo = false;
    this.cturbo;
    this.maxturbo;
    this.jump = false;
    this.cjump;
    this.maxjump;
    this.debugger = true;
    this.name = "John Doe";
    this.connected = false;
    

    this.draw = function(destination) { destination.drawImage(this.image, this.x+mapx, this.y+mapy) }
    this.die = function() { this.life = false; } 
    this.print = function() { console.log('px: '+this.x + 'py: ' + this.y + '\n' + 'Life?: '+this.life) }

    this.kaboom = function(destination) { 
    	destination.drawImage(this.boomimg, this.x+mapx, this.y+mapy);

        for (let i = 1; i <= 25; ++i) {
            //c.drawImage(this.boomimg, this.x+mapx-i/2, this.y+mapy-i/2, i, i * this.boomimg.height / this.boomimg.width);
        }
    }

    this.debug = function (destination) { 
    	var dstr;
        var nx = this.x+mapx;
        var ny = this.y+mapy;
        var dx = 50;
        var dy = 150;

    	if (!this.debugger) {
    		return 0;
    	}

    	if (this.direction == dLeft) dstr="Left"; if (this.direction == dRight) dstr="Right";
    	if (this.direction == dUp) dstr="Up"; if (this.direction == dDown) dstr="Down";

    	destination.fillStyle = "white";
    	destination.fillText('X: '+nx+'   mx: '+Math.floor((nx)/psize), dx, dy+30);
    	destination.fillText('Y: '+ny+'   my: '+Math.floor((ny)/psize), dx, dy+45);
    	destination.fillText('Direction: '+dstr, dx, dy+60);
    	destination.fillText('Turbo: '+this.cturbo, dx, dy+75);
    	destination.fillText('Jump: '+this.cjump, dx, dy+90);
    	destination.fillText('Turbo: '+this.tempturbo, dx, dy+105);
        destination.fillText('Network: '+mpConnected, dx, dy+120);
    }
}
