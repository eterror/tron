/*
	Game menu

	Left/Right to change menu item value
	Up/Down to change menu position
*/

var menu = true;

function TItem() {
	this.name;
	this.runf;
}

var item = [];
var gvalue = 0;

var selector = { image: new Image(), x: 0, y:0, current: 0, size: 20 }

var multiOption = ["No", "Head 2 Head", "Create a game", "Join to game"];	
var diffOption = ["Easy", "Normal", "Hard"];

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

function menuLeft() {
	item[selector.current].value-=1;

	if (item[selector.current].value <= 1)
		item[selector.current].value = 1;

	if (item[selector.current].name == "Difficulty")
		menuSetDiff();
}

function menuRight() {
	item[selector.current].value+=1;

	if (item[selector.current].value >= item[selector.current].maxvalue)
		item[selector.current].value = item[selector.current].maxvalue;

	if (item[selector.current].name == "Difficulty")
		menuSetDiff();
}

function menuTraining() {
	menu = false; startSingle(0); 
}

function menuStart() {
	menu = false; startSingle(gvalue); 
}

function menuSetDiff() {
	gvalue = item[selector.current].value-1;

	switch (diffOption[gvalue]) {
		case "Easy": timer = 60; break;
		case "Normal": timer = 50; break;
		case "Hard": timer = 40; break;
	}

}

function menuMulti() {
	gvalue = item[selector.current].value-1;

	console.debug('multi: '+multiOption[gvalue]+' '+gvalue);

	switch (multiOption[gvalue]) {
		case "No": multiplayer = false; break;
		case "Join to game": menu = false; startMulti(); break;
	}
}

function menuEnter() {
	gvalue = item[selector.current].value;
	item[selector.current].runf(); 
}

function initMenu() {
	selector.image.src = "img/selector.png";
	selector.x = swidth/2 - 20;
	selector.y = sheight/4 - 8;
	selector.size = 20;

	item[0] = new TItem();
	item[0].name = "Training";
	item[0].runf = menuTraining;

	item[1] = new TItem();
	item[1].name = "Campaign";
	item[1].value = 1;
	item[1].maxvalue = (mission.length-1);
	item[1].runf = menuStart;

	item[2] = new TItem();
	item[2].name = "Multiplayer";
	item[2].value = 1;
	item[2].maxvalue = multiOption.length;
	item[2].runf = menuMulti;

	item[3] = new TItem();
	item[3].name = "Difficulty";
	item[3].value = 2;
	item[3].maxvalue = diffOption.length;
	item[3].runf = menuSetDiff;
}

function drawMenu() {
	if (!menu) {
		return 0;
	}

	let k = 0;
	
	hud.draw(c);

	c.font="12px Roboto";
	c.fillText("by Solaris <solargrim@gmail.com>", swidth/2, (sheight)-50);
	c.font="18px Roboto";

	for (let i = 0; i < item.length; ++i) {
		c.fillStyle = "white";
		c.fillText(item[i].name, swidth/2, (sheight/4)+k);
		c.drawImage(selector.image, selector.x, selector.y);

		
		if (item[i].value > 0) {
			switch (item[i].name) {
				case "Multiplayer":	c.fillText(""+multiOption[item[i].value-1], swidth/2+200, (sheight/4)+k); break;
				case "Campaign": c.fillText("level "+item[i].value, swidth/2+200, (sheight/4)+k); break;
				case "Difficulty": c.fillText(diffOption[item[i].value-1], swidth/2+200, (sheight/4)+k); break;
			}
		}

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
