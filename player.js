/*
	TPlayer
*/


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
    

    this.draw = function(destination) { destination.drawImage(this.image, this.x+mapx, this.y+mapy) }
    this.die = function() { this.life = false; } 
    this.print = function() { console.log('px: '+this.x + 'py: ' + this.y + '\n' + 'Life?: '+this.life) }

    this.kaboom = function(destination) { 
    	destination.drawImage(this.boomimg, this.x+mapx, this.y+mapy);
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
    	destination.fillText('X: '+this.x+mapx+' mx: '+Math.floor((this.x+mapx)/psize), swidth-150, 30);
    	destination.fillText('y: '+this.y+mapy+' my: '+Math.floor((this.y+mapy)/psize), swidth-150, 45);
    	destination.fillText('Direction: '+dstr, swidth-150, 60);
    	destination.fillText('Turbo: '+this.cturbo, swidth-150, 75);
    	destination.fillText('Jump: '+this.cjump, swidth-150, 90);
    	destination.fillText('Life: '+this.life, swidth-150, 105);
    	destination.fillText('Turbo: '+this.tempturbo, swidth-150, 120);
    }
}
