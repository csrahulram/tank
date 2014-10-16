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
tankCount,
player,
radian,
playerBase,
playerHud,
oldPlayerX,
oldPlayerY,
oldPlayerRotation,
oldHudRotation,
playerId,
distance,
shellCount,
shellArray = new Array(),
shellSpeed = 5,
shellX,
shellY,
tankX,
tankY


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

  for(var i = 0; i < shellCount; i++)
  {
    shellArray[i].update();
    //shellArray[i].shellobj.x += shellArray[i].incX;
    //shellArray[i].shellobj.y += shellArray[i].incY;

    /*for(var j = 0; j < tankCount; j++)
    {
      shellX = shellArray[i].shellobj.x;
      shellY = shellArray[i].shellobj.y;
      tankX = tankArray[j].tankobj.x;
      tankY = tankArray[j].tankobj.y;
      distance = Math.sqrt(Math.pow(shellX - tankX, 2) + Math.pow(shellY - tankY, 2));

      if(distance < 20)
      {
        console.log("hitted");
      }
    }*/

    /*if(shellArray[i].shellobj.y < 100 || shellArray[i].shellobj.y > H - 100 || shellArray[i].shellobj.x < 0 || shellArray[i].shellobj.x > W)
    {
      //destroyShell(shellArray[i])
      stage.removeChild(shellArray[i].shellobj);
      shellArray.splice(shellArray.indexOf(shellArray[i], 1));
      shellCount = shellArray.length;
      console.log("removing too much")
    }*/
  }
}

function destroyShell(shell) {
  stage.removeChild(shell.shellobj);
  shellArray.splice(shellArray.indexOf(shell, 1));
  shellCount = shellArray.length;
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
  var 
  X = player.x - (player.x + (Math.cos(playerHud.rotation * (Math.PI / 180)) * shellSpeed)),
  Y = player.y - (player.y + (Math.sin(playerHud.rotation * (Math.PI / 180)) * shellSpeed));

  socket.emit('fire', {id:playerId, x:player.x, y:player.y, incX:X, incY:Y});
  console.log("you are firing");
}

function tankBuilder(data) {
  this.tankobj = new createjs.Container();
  this.tankobj.name = data.id;
  var hitArea = new createjs.Shape();
  hitArea.graphics.beginFill('#000000').drawCircle(0,0,30);
  hitArea.alpha = 0.2;

  var base = new createjs.Shape();
  base.name = "base";
  base.graphics.beginFill(data.color).drawRect(-20, -30, 40, 60);
  this.tankobj.x = data.initX;
  this.tankobj.y = data.initY;

  var hud = new createjs.Shape();
  hud.name = "hud";
  hud.graphics.beginFill("#624900").drawRect(-16, -12, 32, 24);
  hud.graphics.beginFill("#624900").drawRect(-46, -3, 30, 6);
  hud.x = base.x;
  hud.y = base.y;

  this.tankobj.addChild(hitArea);
  this.tankobj.addChild(base);
  this.tankobj.addChild(hud);
  
  return this;
}

/*tankBuilder.prototype.fire = function() {
    console.log('Firing the tank');
  }*/




  

function destroy(data) {
  var ind = tankId.indexOf(data.id)
  stage.removeChild(tankArray[ind].tankobj);
  tankArray.splice(ind, 1);
  tankId.splice(ind, 1);
  tankCount = tankArray.length;
}

function control(data) {
  playerId = data;
  player = tankArray[tankId.indexOf(data)].tankobj;
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
  var enemy = tankArray[tankId.indexOf(tank.id)].tankobj;
  enemy.x = tank.x;
  enemy.y = tank.y;
  enemy.getChildByName('base').rotation = tank.rotBase;
  enemy.getChildByName('hud').rotation = tank.rotHud;
}

function createTank(data) {
  var tank = new tankBuilder(data);
  tankId.push(data.id);
  tankArray.push(tank);
  stage.addChild(tank.tankobj);
  tankCount = tankArray.length;
}

function fire(data) {
  console.log('comming here')
  //tankArray[tankId.indexOf(data.id)].fire();
  var shell = new shellBuilder(data);
  shellArray.push(shell);
  shellCount = shellArray.length;
  stage.addChild(shell.shellobj);
}

function shellBuilder(data) {
  //console.log('comming here')
  this.shellobj = new createjs.Shape();
  this.shellobj.graphics.beginFill('#000000').drawCircle(0,0,3);
  this.shellobj.name = data.id;
  this.incX = data.incX;
  this.incY = data.incY;
  this.shellobj.x = data.x + (data.incX * 7);
  this.shellobj.y = data.y + (data.incY * 7);
  this.destroyShell = function() {
      stage.removeChild(this.shellobj);
      shellArray.splice(shellArray.indexOf(this), 1);
      shellCount = shellArray.length;
    }
  return this;
}

shellBuilder.prototype.update = function() {
  this.shellobj.x += this.incX;
  this.shellobj.y += this.incY;

  if(this.shellobj.y < 100 || this.shellobj.y > H - 100 || this.shellobj.x < 100 || this.shellobj.x > W - 100)
    {
      this.destroyShell();
    }

/*for(var i = 0; i < tankCount; i++)
{
  distance = Math.sqrt(Math.pow(this.shellobj.x - tankArray[i].tankObj.x, 2) + Math.pow(this.shellobj.y - tankArray[i].tankObj.y, 2));

      if(distance < 20)
      {
        this.destroyShell();
      }
}*/
     
    

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

  socket.on('create', createTank);
  socket.on('destroy', destroy);
  socket.on('control', control);
  socket.on('move', move);
  socket.on('fire', fire);
}

createCanvas();