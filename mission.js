/*
 Campagin Missions 

 Mission types:
  - survive on map (with floating objects too) (timer--)
  - collect item fast as you can (time++/max_time)
  - labirynth
  - earthquake (random map shake)
  - map flip (random)
*/

const dmSurvive = 0;
const dmCollect = 1;
const dmTraining = 2;
const dmArmageddon = 3;

function TMission() {
	this.id;
	this.description;
	this.goal;
	this.mmap;
}

