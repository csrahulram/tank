var canvas = document.createElement("canvas");


  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.id = "stage";
  var ctx = canvas.getContext("2d");
  ctx.fillStyle="#333";
  ctx.fillRect(0,0, canvas.width, canvas.height);

document.body.appendChild(canvas);
createTank()
	function createTank() {
			document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        alert('Left was pressed');
    }
    else if(event.keyCode == 39) {
        alert('Right was pressed');
    }
});
	}
  //addEventListener("click", goFullScreen);

  function goFullScreen() {
  	var
          el = document.documentElement
        , rfs =
               el.requestFullScreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
    ;
    rfs.call(el);
    canvas.width = window.innerWidth;
 	canvas.height = window.innerHeight;
 	ctx.fillStyle="#333";
	ctx.fillRect(0,0, canvas.width, canvas.height);
  }