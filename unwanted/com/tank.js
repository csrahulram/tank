var
canvas = document.createElement("canvas"),
stage,
tank_base,
radian_base,
tank_hud,
target_x = 0,
target_y = 0,
ctx = canvas.getContext("2d"),
debug = true,
left = false,
right = false,
up = false,
down = false,
W = window.innerWidth,
H = window.innerHeight,
turnSpeed = 0.6,
speed = 1


window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1);
          };
})();

window.cancelRequestAnimFrame = ( function() {
  return window.cancelAnimationFrame          ||
    window.webkitCancelRequestAnimationFrame  ||
    window.mozCancelRequestAnimationFrame     ||
    window.oCancelRequestAnimationFrame       ||
    window.msCancelRequestAnimationFrame      ||
    clearTimeout
})();

var socket = io()
  	


function startAnimation(){
  requestAnimFrame(startAnimation);
  engine();
}

function stopAnimation(){
  cancelRequestAnimFrame(stopAnimation);
}

function engine() {
  if(left)
  {
    left_ctrl();
  }
  if(right)
  {
    right_ctrl();
  }
  if(up)
  {
    up_ctrl();
  }
  if(down)
  {
    down_ctrl();
  }

  tank_hud.x = tank_base.x;
  tank_hud.y = tank_base.y;

  hud_ctrl();
}

function hud_ctrl()
{
  target_x += (stage.mouseX - target_x) / 10;
  target_y += (stage.mouseY - target_y) / 10;
  tank_hud.rotation = Math.atan2((target_y - tank_hud.y),(target_x - tank_hud.x)) / (Math.PI / 180) + 90;
}


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

function onKeyboardDown(e) {
  if(event.keyCode == 37) {
        left = true;
    }
    else if(event.keyCode == 38) {
      up = true;
    }
    else if(event.keyCode == 39) {
        right = true;
    }
    else if(event.keyCode == 40) {
      down = true;
    }
}

function onKeyboardUp(e) {
  if(event.keyCode == 37) {
        left = false;
    }
    else if(event.keyCode == 38) {
      up = false;
    }
    else if(event.keyCode == 39) {
        right = false;
    }
    else if(event.keyCode == 40) {
      down = false;
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

function render(event) {
  stage.update();
  socket.emit('chat message', tank_base.rotation);
}

function left_ctrl()
{
  tank_base.rotation = tank_base.rotation - turnSpeed;
   
}
function right_ctrl()
{
  tank_base.rotation = tank_base.rotation + turnSpeed; 
}

function up_ctrl()
{
  radian_base = tank_base.rotation * Math.PI / 180;
  tank_base.x = tank_base.x - Math.sin(-radian_base) * speed;
  tank_base.y = tank_base.y - Math.cos(-radian_base) * speed;
  
}
function down_ctrl()
{
  radian_base = tank_base.rotation * Math.PI / 180;
  tank_base.x = tank_base.x + Math.sin(-radian_base) * speed;
  tank_base.y = tank_base.y + Math.cos(-radian_base) * speed;
  
}

function createCanvas() {

  canvas.width = W;
  canvas.height = H;
  canvas.id = "stage";
  document.body.appendChild(canvas);

  stage = new createjs.Stage("stage");
  var bg = new createjs.Shape();
  bg.graphics.beginFill("#297F87").drawRect(0,0,W,H);
  stage.addChild(bg);
  //document.addEventListener("mouseup", goFullScreen);
  document.addEventListener('keydown', onKeyboardDown);
  document.addEventListener('keyup', onKeyboardUp);

  tank_base = new createjs.Shape();
  tank_base.graphics.beginFill("#CC9900").drawRect(-20,-30,40,60);
  tank_base.x = W / 2;
  tank_base.y = H / 2;
  stage.addChild(tank_base);

  tank_hud = new createjs.Shape();
  tank_hud.graphics.beginFill("#624900").drawRect(-12,-16,24,32);
  tank_hud.graphics.beginFill("#624900").drawRect(-3,-46,6,30);
  tank_hud.x = tank_base.x;
  tank_hud.y = tank_base.y;
  stage.addChild(tank_hud);

  
  createjs.Ticker.setFPS(15);
  createjs.Ticker.addEventListener("tick", render);
  startAnimation();
}

createCanvas();