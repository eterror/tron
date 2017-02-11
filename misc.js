/*
	other stuff
*/

Array.matrix = function(numrows, numcols, initial){
   var arr = [];
   for (var i = 0; i < numrows; ++i){
      var columns = [];
      for (var j = 0; j < numcols; ++j){
         columns[j] = initial;
      }
      arr[i] = columns;
    }
    return arr;
}

function isOdd(i) { 
	return i % 2;
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
 }

 function clearCanvas() {
  c.clearRect(0, 0, swidth, sheight);
}

 