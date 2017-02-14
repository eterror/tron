/*
	Game HUD
*/

function THud() {
	this.x = 0;
	this.y = 0;
	this.image = new Image();

	this.draw = function(dest) {
		dest.drawImage(this.image, this.x, this.y);
	}

	this.load = function() {
		this.image.src = "img/hud.png";
	}
}


