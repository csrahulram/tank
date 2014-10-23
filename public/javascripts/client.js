var
canvas,
stage,
stageWidth,
stageHeight,
socket,
arena,
player

init();

function init() {
	canvas = document.createElement("canvas");
	stageWidth = window.innerWidth;
	stageHeight  = window.innerHeight;
	canvas.width = stageWidth;
  	canvas.height = stageHeight;
 	canvas.id = "stage";
 	stage = new createjs.Stage("stage");
  	document.body.appendChild(canvas);
  	socket = io();
  	socket.on('connect', connection);
  	socket.on('reconnecting', disconnection)
  	socket.on('reconnect_error', fucked)
}

function connection(data) {
	console.log('connected');
}

function disconnection(data) {
	console.log('retrying');
}

function fucked(data) {
	console.log('connection refused')
}
