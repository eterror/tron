/*
	Game menu
*/

var menu = true;

function TItem() {
	this.name;
	this.runf;
}

var item = [];

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

	if (selector.current > item.length-1) {
		selector.current = item.length-1;

		return 0;
	}

	selector.y += selector.size;
}

function menuHelp() {
	//clearCanvas();
	c.fillText('Cursors: movement', swidth/2, 100);
	c.fillText('X: turbo',swidth/2 , 115 );
	c.fillText('Z: jump',swidth/2 , 130);
	c.fillText('R: restart',swidth/2 , 145);
	c.fillText('ESC: menu',swidth/2 , 160);
	c.fillText('P: pause',swidth/2 , 175);
	c.fillText('Q: enable/disable debug info',swidth/2 , 190);
	c.fillText('WSAD: map move',swidth/2 , 205);
	c.fillText('+/- keypad: map size',swidth/2 , 220);
	c.fillText('Mouse click: insert floating wall into map',swidth/2 , 235);
}

function menuSingleplayer() {
	menu = false; if (pause) { restart(); pause = !pause; } else { startSP(); }
}

function menuEnter() {
	item[selector.current].runf();

	console.debug("Item: "+item[selector.current].name);
}

function initMenu() {
	selector.image.src = "img/selector.png";
	selector.x = swidth/2 - 20;
	selector.y = sheight/4 - 8;
	selector.size = 20;

	item[0] = new TItem();
	item[0].name = "Training";
	item[0].runf = menuSingleplayer;

	item[1] = new TItem();
	item[1].name = "Campagin";
	item[1].runf = drawMenu;

	item[2] = new TItem();
	item[2].name = "Multiplayer";
	item[2].runf = drawMenu;

	item[3] = new TItem();
	item[3].name = "Settings";
	item[3].runf = drawMenu;

	item[4] = new TItem();
	item[4].name = "Help";
	item[4].runf = menuHelp;
}

function drawMenu() {
	if (!menu) {
		return 0;
	}

	let k = 0;

	//clearCanvas();
	hud.draw(c);

	c.font="12px Roboto";
	c.fillText("by solargrim@gmail.com", swidth/2, (sheight)-50);
	c.font="18px Roboto";

	for (let i = 0; i < item.length; ++i) {
		c.fillStyle = "white";
		c.fillText(item[i].name, swidth/2, (sheight/4)+k);
		c.drawImage(selector.image, selector.x, selector.y);

		if (i == selector.current) {
			c.fillStyle = "#000000";
			c.fillText(item[i].name, swidth/2, (sheight/4)+k);
			c.fillStyle = "yellow";
			c.fillText(item[i].name, swidth/2, (sheight/4)+k);
		}
		
		k+=selector.size;
	}

	c.fillStyle = "white";
}
