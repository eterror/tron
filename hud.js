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
		var	text;

		dest.drawImage(this.image, this.x, this.y);
		dest.font = "50px Roboto";
		dest.fillText('xTron', 440, 50);
		dest.font = "15px Roboto";
		dest.fillText('v'+version, 710, 20);

		if (!menu) {
			switch (mission[mission.current].goal) {
				case dmCollect: text = "mode COLLECT: level "+mission.current; break;
				case dmSurvive: text = "mode SURVIVE: level "+mission.current; break;
				default: text = "TRAINING"; break;
			}

			dest.fillText(mission[mission.current].name+' > '+text, 350, this.image.height-82);
			dest.fillText(mission[mission.current].description, 355, this.image.height-50);

			dest.fillText("Attempt: "+player.attempt, 355, this.image.height-20);
			
			if (!multiplayer)
				dest.fillText(mtime+'/'+mission[mission.current].timer+' sec.', 580, this.image.height-20);
		}

		if (menu) {
			dest.fillText("Up/Down key: menu position", 50, 180);
			dest.fillText('Left/Right key: change menu option', 50, 200);
			dest.fillText('Enter: select menu option', 50, 220);
			dest.fillText("ESC: back to menu/game", 50, 240);
		}

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
