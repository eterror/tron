/*
	Game menu
*/

var menu = true;

var items = ["Training", "Single", "Multi", "Settings"];
var selector = { image: new Image(), x: 0, y:0, current: 0, size: 20 }


function menuUp() {
	selector.current-=1;

	if (selector.current < 0) {
		selector.current = 0;

		return 0;
	}

	selector.y -= selector.size;
}

function menuDown() {
	selector.current+=1;

	if (selector.current > items.length-1) {
		selector.current = items.length-1;

		return 0;
	}

	selector.y += selector.size;
}

function menuEnter() {
	if (selector.current == 0) { menu = false; if (pause) { restart(); pause = !pause; } else startSP(); }

	console.debug("Item: "+items[selector.current]);
}

function initMenu() {
	selector.image.src = "img/selector.png";
	selector.x = swidth/2 - 20;
	selector.y = sheight/4 - 8;
	selector.size = 20;
}

function drawMenu() {
	if (!menu) {
		return 0;
	}

	let k = 0;

	clearCanvas();

	for (let i = 0; i < items.length; ++i) {
		c.fillText(items[i], swidth/2, (sheight/4)+k);
		c.drawImage(selector.image, selector.x, selector.y);

		if (i == selector.current) {
			c.fillStyle = "white";
			c.fillText(items[i], swidth/2, (sheight/4)+k);
			c.fillStyle = "red";
			c.font="18px Roboto";
			c.fillText(items[i], swidth/2, (sheight/4)+k);
			c.font="15px Roboto";
			c.fillStyle = "black";
		}
		
		k+=20;
	}
}
