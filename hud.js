/*
	Game HUD
*/

function THud() {
	this.x = 0;
	this.y = 0;
	this.image = new Image();
	this.slider0 = new Image();
	this.slider1 = new Image();

	this.draw = function(dest) {
		dest.drawImage(this.image, this.x, this.y);
		dest.font = "50px Roboto";
		dest.fillText('xTron', 440, 50);
		dest.font = "15px Roboto";

		dest.fillText('v'+version, 710, 20);
		this.update(dest);
	}

	this.load = function() {
		this.image.src = "img/hud.png";
		this.slider0.src = "img/slider0.png";
		this.slider1.src = "img/slider1.png";
	}

	this.update = function(dest) {
		var pt = (player.cturbo / player.maxturbo) * 100;
		var pc = (player.cjump / player.maxjump) * 100;

		if (menu) return 0;

		for (let i = 0; i < pt - 3; ++i) {
			dest.drawImage(this.slider1, 57+i, 555);
		}

		for (let i = 0; i < pc -3 ; ++i) {
			dest.drawImage(this.slider1, 57+i, 589);
		}

		dest.font = "10px Roboto";
		dest.fillText(player.cturbo, 160, 563);
		dest.fillText(player.cjump, 160, 597);
		dest.font = "15px Roboto";
	}
}
