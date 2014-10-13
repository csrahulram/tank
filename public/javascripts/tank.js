var
canvas = document.createElement("canvas"),
ctx = canvas.getContext("2d"),
debug = true,
left = false,
right = false,
up = false,
down = false,
W = window.innerWidth,
H = window.innerHeight


window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 500);
          };
})();

window.cancelRequestAnimFrame = ( function() {
  return window.cancelAnimationFrame          ||
    window.webkitCancelRequestAnimationFrame    ||
    window.mozCancelRequestAnimationFrame       ||
    window.oCancelRequestAnimationFrame     ||
    window.msCancelRequestAnimationFrame        ||
    clearTimeout
})();


function render() {
  console.log("working");
}

(function animloop(){
  requestAnimFrame(animloop);
  render();
})();


function goFullScreen() {
  var 
  el = document.documentElement, 
  rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
  rfs.call(el);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle="#333";
  ctx.fillRect(0,0, canvas.width, canvas.height);
}

function setKeyEvent(e) {
  if(event.keyCode == 37) {
        alert('Left was pressed');
    }
    else if(event.keyCode == 39) {
        alert('Right was pressed');
    }
}

startBtn = {
  w: 100,
  h: 50,
  x: W/2 - 50,
  y: H/2 - 25,
  
  draw: function() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = "2";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    
    ctx.font = "18px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStlye = "white";
    ctx.fillText("Start", W/2, H/2 );
  }
};

restartBtn = {
  w: 100,
  h: 50,
  x: W/2 - 50,
  y: H/2 - 50,
  
  draw: function() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = "2";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    
    ctx.font = "18px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStlye = "white";
    ctx.fillText("Restart", W/2, H/2 - 25 );
  }
};

function createCanvas() {
  
  canvas.width = W;
  canvas.height = H;
  canvas.id = "stage";
  ctx = canvas.getContext("2d");
  ctx.fillStyle="#333";
  ctx.fillRect(0,0, W, H);
  document.body.appendChild(canvas);
  //document.addEventListener("click", goFullScreen);
  document.addEventListener('keydown', setKeyEvent);

  startBtn.draw();
}

createCanvas();