import tankbase;
import tankhud;
import tankbullet;
import flash.display.*;
import flash.events.MouseEvent;

var tank_base:tankbase = new tankbase();
var tank_hud:tankhud = new tankhud();
var tnk_bl:tankbullet = new tankbullet();
tank_base.x = stage.stageWidth / 2;
tank_base.y = stage.stageWidth / 2;
tank_hud.x = stage.stageWidth / 2;
tank_hud.y = stage.stageWidth / 2;
tnk_bl.x = stage.stageWidth / 2;
tnk_bl.y = stage.stageWidth / 2;
addChild(tank_base);
addChild(tank_hud);

var left:Boolean = false;
var right:Boolean = false;
var up:Boolean = false;
var down:Boolean = false;

var radian_base:Number = 0;
var target_x:Number = 0;
var target_y:Number = 0;
var travel:Number = 0;

var bl_x1:Number;
var bl_y1:Number;
var bl_x2:Number;
var bl_y2:Number;
var rad_bl:Number;
var bl_m:Number;
var bl_b:Number;

stage.addEventListener('keyDown',function(e:KeyboardEvent)
					   {
						   switch(e.keyCode)
						   {
							   case Keyboard.LEFT:
							   left = true;
							   break;
							   case Keyboard.RIGHT:
							   right = true;
							   break;
							   case Keyboard.UP:
							   up = true;
							   break;
							   case Keyboard.DOWN:
							   down = true;
							   break;
						   }
							  
					   })

stage.addEventListener('keyUp',function(e:KeyboardEvent)
					   {
						   switch(e.keyCode)
						   {
							   case Keyboard.LEFT:
							   left = false;
							   break;
							   case Keyboard.RIGHT:
							   right = false;
							   break;
							   case Keyboard.UP:
							   up = false;
							   break;
							   case Keyboard.DOWN:
							   down = false;
							   break;
						   }
					   })


//var usr_key_check = setInterval(function()
stage.addEventListener(Event.ENTER_FRAME,usr_key_check)
function usr_key_check(e:Event)
{
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
}//,500/60)

stage.addEventListener(MouseEvent.CLICK,trig_bl)

function left_ctrl()
{
	tank_base.rotation = tank_base.rotation - 0.5;
	 
}
function right_ctrl()
{
	tank_base.rotation = tank_base.rotation + 0.5; 
}

function up_ctrl()
{
	radian_base = tank_base.rotation * Math.PI / 180;
	tank_base.x = tank_base.x - Math.sin(-radian_base) * 0.5;
	tank_base.y = tank_base.y - Math.cos(-radian_base) * 0.5;
	
}
function down_ctrl()
{
	radian_base = tank_base.rotation * Math.PI / 180;
	tank_base.x = tank_base.x + Math.sin(-radian_base) * 0.5;
	tank_base.y = tank_base.y + Math.cos(-radian_base) * 0.5;
	
}
function hud_ctrl()
{
	target_x += (stage.mouseX - target_x) / 10;
	target_y += (stage.mouseY - target_y) / 10;
	tank_hud.rotation = Math.atan2((target_y - tank_hud.y),(target_x - tank_hud.x)) / (Math.PI / 180) + 90;
}

function trig_bl(e:MouseEvent)
{
	addChild(tnk_bl);
	tnk_bl.rotation = tank_hud.rotation;
	
	tnk_bl.x = tank_hud.x;
	tnk_bl.y = tank_hud.y;
	rad_bl = tank_hud.rotation * Math.PI / 180;
	bl_x1 = tnk_bl.x;
	bl_y1 = tnk_bl.y;
	
	
	//bl_m = (bl_y2 - bl_y1) / (bl_x2 - bl_x1);
	//bl_b = bl_y1 - (bl_m * bl_x1);
	
	//fire();
	travel = -35;
	stage.addEventListener(Event.ENTER_FRAME,bl_move)
	tnk_bl.visible = true;
}

//function fire()
//{
	
//}
function bl_move(e:Event)
{
	//tnk_bl.y = (bl_m * bl_x1) + bl_b;
	//tnk_bl.x = bl_x1;
	//bl_x1++; 
	if(travel > -600)
	{
	tnk_bl.x = bl_x1 + Math.sin(-rad_bl) * travel;
	tnk_bl.y = bl_y1 + Math.cos(-rad_bl) * travel;
	travel = travel - 5;
	}
	else
	{
		tnk_bl.visible = false;
	stage.removeEventListener(Event.ENTER_FRAME,bl_move)
	}
	 0
}
stage.addEventListener(Event.ENTER_FRAME,hit)
function hit(e:Event)
{
	
	if(enemy.hitTestObject(tnk_bl))
	{
		enemy.gotoAndPlay(2);
	}
	
}

								