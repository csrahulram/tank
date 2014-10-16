var
canvas = document.createElement("canvas"),
socket = io(),
stage,

targetX = 0,
targetY = 0,
ctx = canvas.getContext("2d"),
debug = true,
left = false,
right = false,
up = false,
down = false,
W = window.innerWidth,
H = window.innerHeight,
turnSpeed = 0.6,
speed = 1.2,
tankId = new Array(),
tankArray = new Array(),
player,
radian,
playerBase,
playerHud,
oldPlayerX,
oldPlayerY,
oldPlayerRotation,
oldHudRotation,
playerId

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback);
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


function startEngine(){
  requestAnimFrame(startEngine);
  engine();
}

function stopEngine(){
  cancelRequestAnimFrame();
}

function engine() {
   if(left)
  {
    leftCtrl();
  }
  if(right)
  {
    rightCtrl();
  }
  if(up)
  {
    upCtrl();
  }
  if(down)
  {
    downCtrl();
  }

  targetX += (stage.mouseX - targetX) / 10;
  targetY += (stage.mouseY - targetY) / 10;
  playerHud.rotation = Math.atan2((player.y - targetY),(player.x - targetX)) / (Math.PI / 180);
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

function onKeyboardDown(event) {
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

function onKeyboardUp(event) {
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

function onMouseDown(event) {
  socket.emit('fire', {id:playerId, incX:2, incY:2});
  console.log("you are firing");
}

function tank(data) {
  var tankobj = new createjs.Container();
  tankobj.name = data.id;
  var base = new createjs.Shape();
  base.name = "base";
   base.graphics.beginFill(data.color).drawRect(-20, -30, 40, 60);
   tankobj.x = data.initX;
   tankobj.y = data.initY;

   var hud = new createjs.Shape();
   hud.name = "hud";
  hud.graphics.beginFill("#624900").drawRect(-16, -12, 32, 24);
  hud.graphics.beginFill("#624900").drawRect(-46, -3, 30, 6);
  hud.x = base.x;
  hud.y = base.y;

  tankobj.addChild(base);
  tankobj.addChild(hud);

  stage.addChild(tankobj);

  tankId.push(data.id);
  tankArray.push(tankobj);
}

tank.prototype.fire = function(data) {

}

function destroy(data) {
  var ind = tankId.indexOf(data.id)
  stage.removeChild(tankArray[ind]);
  tankArray.splice(ind, 1);
  tankId.splice(ind, 1);
}

function control(data) {
  playerId = data;
  player = tankArray[tankId.indexOf(data)];
  playerBase = player.getChildByName('base');
  playerHud = player.getChildByName('hud');
  startEngine();

  createjs.Ticker.addEventListener("tick", render);
}

function render(e) {
   stage.update();
    if(oldPlayerX != player.x || oldPlayerY != player.y || oldPlayerRotation != playerBase.rotation || oldHudRotation != playerHud.rotation)
    {
      socket.emit('move', {id:playerId, x:player.x, y:player.y, rotBase:playerBase.rotation, rotHud:playerHud.rotation});
    }
  oldPlayerX = player.x;
  oldPlayerY = player.y;
  oldPlayerRotation = playerBase.rotation;
  oldHudRotation = playerHud.rotation;
}

function leftCtrl()
{
  playerBase.rotation = playerBase.rotation - turnSpeed;
}
function rightCtrl()
{
  playerBase.rotation = playerBase.rotation + turnSpeed; 
}

function upCtrl()
{
  radian = playerBase.rotation * Math.PI / 180;
  player.x = player.x - Math.sin(-radian) * speed;
  player.y = player.y - Math.cos(-radian) * speed;
  
}
function downCtrl()
{
  radian = playerBase.rotation * Math.PI / 180;
  player.x = player.x + Math.sin(-radian) * speed;
  player.y = player.y + Math.cos(-radian) * speed;
  
}

function move(tank) {
  var enemy = tankArray[tankId.indexOf(tank.id)];
  enemy.x = tank.x;
  enemy.y = tank.y;
  enemy.getChildByName('base').rotation = tank.rotBase;
  enemy.getChildByName('hud').rotation = tank.rotHud;
}

function fire(tank) {
  //tankArray[tankId.indexOf(tank.id)].fire;
  console.log("enemy firing");
}

function createCanvas() {

  canvas.width = W;
  canvas.height = H;
  canvas.id = "stage";
  document.body.appendChild(canvas);

  stage = new createjs.Stage("stage");
  var bg = new createjs.Shape();
  bg.graphics.beginFill('#297F87').drawRect(0,0,W,H);
  stage.addChild(bg);
  //document.addEventListener("mouseup", goFullScreen);
  document.addEventListener('keydown', onKeyboardDown);
  document.addEventListener('keyup', onKeyboardUp);
  document.addEventListener('mousedown', onMouseDown);

  createjs.Ticker.setFPS(15);

  socket.on('create', tank);
  socket.on('destroy', destroy);
  socket.on('control', control);
  socket.on('move', move);
  socket.on('fire', fire);
}

createCanvas();