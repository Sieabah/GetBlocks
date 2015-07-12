var GetBlock, Ticker;

/*
	Get path to sound files
*/
function getSoundPath(name){
	return "./gbrepo/sound/"+name+".ogg";
}

/*
	Determine if defined
*/
function defined(vari){
	return (vari != undefined);
}

/*
	Determine a pos/neg number
*/
function getMod(){
	var mod = 0;
	if(Math.floor((Math.random()*10)) > 5)
		mod = 1;
	else
		mod = -1;

	return mod;
}

/*
-----------------------------------------------SHAPES------------------------------------------------------
*/
/*
	Box class, different shapes to draw
*/
function box(canvas,xVar,yVar,length,width,color,type){
	this.X = xVar;
	this.Y = yVar;
	this.length = length;
	this.width = width;
	this.color = color;
	this.type = type;
	this.canvas = canvas;

	//Create box that's filled
	this.fillBox = function(){
		if (this.canvas.getContext) {
			var ctx = this.canvas.getContext('2d');
			ctx.fillStyle=this.color;
			ctx.fillRect(this.X,this.Y,this.width,this.length);
		}
	}

	//Create a clear box 
	this.clearBox = function(){
		if (this.canvas.getContext) {
			var ctx = this.canvas.getContext('2d');
			ctx.clearRect(this.X,this.Y,this.width,this.length);
		}
	}

	//Create a box that has no fill
	this.strokeBox = function(){
		if (this.canvas.getContext) {
			var ctx = this.canvas.getContext('2d');
			ctx.fillStyle=this.color;
			ctx.strokeRect(this.X,this.Y,this.width,this.length);
		}
	}

	//Draw this box
	this.draw = function(canvas){
		if(type=="clear")
			this.clearBox(canvas);
		else if(type=="stroke")
			this.strokeBox(canvas);
		else
			this.fillBox(canvas);
	}
}

/*
	Point object, start,goal,enemies
*/
function point(xVar, yVar, length, width, color, static){
	this.X = xVar;
	this.Y = yVar;
	this.vX = xVar;
	this.vY = yVar;
	this.length = length;
	this.width = width; 
	this.color = color;
	this.static = static;

	this.orbitOffset = function(radiusX,tick,radiusY){
		if(!defined(radiusX))
			return;

		if(!defined(radiusY))
			radiusY = radiusX;

		return {X: (this.X)+radiusX*Math.cos(tick*(Math.PI/180)), Y: (this.Y)+radiusY*Math.sin(tick*(Math.PI/180))};
	}

	//Return coordinates of mouse
	this.getCoord = function(){
		return {X:this.X,Y:this.Y};
	}

	this.checkCollision = function(coord){
		if((coord.X >= this.X && coord.X <= this.X+this.width) && (coord.Y >= this.Y && coord.Y <= this.Y+this.length))
			return true;

		return false;
	}

	//Change the color
	this.newColor = function(str){
		if(str == undefined)
			return;
		this.color = str;
	}

	this.vposition = function(pos){
		if(pos == undefined)
			return;
		this.vX = pos.X;
		this.vY = pos.Y;
		return;
	}
	//change position of point
	this.position = function(pos,vis){
		if(defined(vis)){
			this.vposition(vis);
		}

		if(!defined(pos) || !defined(pos.X) || !defined(pos.Y))
			return;

		this.vposition(pos);
		this.X = pos.X;
		this.Y = pos.Y;

		return;
	}

	//Draw this point
	this.display = function(canvas){
		new box(canvas,this.vX,this.vY,this.length,this.width,this.color,"fill").draw();
		return;
	}
}

/*
	Shape drawing function, not finished
*/
function shape(coords, type, color){
	this.coords = coords;
	this.color = color;
	this.type = type

	this.draw= function(canvas){

		var ctx = canvas.getContext('2d');

		  ctx.fillStyle = "red";

		  ctx.beginPath();
		  ctx.moveTo(30, 30);
		  ctx.lineTo(150, 150);
		  // was: ctx.quadraticCurveTo(60, 70, 70, 150); which is wrong.
		  ctx.bezierCurveTo(60, 70, 60, 70, 70, 150); // <- this is right formula for the image on the right ->
		  ctx.lineTo(30, 30);
		  ctx.fill();
		return;
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');
			ctx.fillStyle=this.color;
			ctx.beginPath();

			for(var i = 0; i < this.coords.length; i++){
				console.log(this.coords[i])
				if(i == 0){
					ctx.moveTo(this.coords[i].X, this.coords[i].Y);
					continue;
				}
					
				ctx.lineTo(this.coords[i].X, this.coords[i].Y);
			}

			ctx.closePath();
			ctx.fill();
		}
	}
}

/*
-----------------------------------------------RENDERING------------------------------------------------------
*/

/*
	Renders the boxes
*/
function renderer(){
	//Update function
	this.update = function(list,canvas,redraw){
		if(canvas == undefined)
			return false;

		if(redraw == undefined)
			redraw = true;

		//Clear the screen for more rendering
		new box(canvas,0,0,$(window).height(),$(window).width(),undefined,"clear").draw();

		//Cycle through list of drawable objects
		for (var i = 0; i < list.length; i++) {
			//If not defined
			if(list[i] == undefined || list[i].length <= 0)
				continue;

			for (var j = list[i].length -1; j >= 0; j--) {

				//If static and not a redraw
				if(list[i][j].static && !redraw)
					continue;

				//call the display function on object
				list[i][j].display(canvas);
			};		
		};

		return;
	}
}

/*
-----------------------------------------------AUDIO------------------------------------------------------
*/


/*
	Audio Object
*/
function sound(soundPath,name,loop){
	this.name = name;
	this.file = soundPath;
	this.loop = loop;
	this.playing = false;
	this.audioElm;

	//Redefine file
	this.redefineFile = function(name){
		if(name == undefined || name == "")
			return;
		if(this.playing)
			this.stop();

		this.name = name;
		this.file = getSoundPath(name);
		return;
	}

	//Play sound
	this.play = function(loop){
		if(this.playing)
			return;

		//Check to see if this is being looped
		if(!defined(loop) && !defined(this.loop))
			loop = false;

		if(defined(loop))
			this.loop = loop;

		this.playing = true;
		
		//Chrome AudioAPI
		if(navigator.userAgent.toLowerCase().indexOf("chrome")>-1){
			this.audioElm = new Audio(this.file);
			this.audioElm.loop=this.loop;
			this.audioElm.play();
			return;
		}

		//Compatability
		if($(".audio."+this.name).length<=0){
			if($("#soundLayer").length<=0)
				$("body").append("<div id='soundLayer'></div>");

			if(this.loop)
				$("#soundLayer").append("<audio loop class='audio "+this.name+"'' src='"+this.soundFile+"'></audio>");
			else 
				$("#soundLayer").append("<audio class='audio "+this.name+"'' src='"+this.soundFile+"'></audio>");
		}

		$(".audio."+this.name).trigger("play");
		this.audioElm = $(".audio."+this.name);

		return;
	}

	//Stops playing sound
	this.stop = function(){
		if(navigator.userAgent.toLowerCase().indexOf("chrome")>-1){
			this.audioElm.src = "";
		} else {
			this.audioElm.remove();
		}

		this.playing = false;
	}
}

/*
-----------------------------------------------TIME KEEPING------------------------------------------------------
*/
/*
	Interval timer
*/
function interval(){
	this.One = undefined;
	this.Two = undefined;

	this.start = function(){
		this.One = setInterval(tick,0);
		this.Two = setInterval(tick,0);
		return;
	}

	this.kill = function(){
		clearInterval(this.One);
		clearInterval(this.Two);
		return;
	}
	this.restart = function(){
		this.kill();
		this.start();
		return;
	}
}

/*
	Time object, dealing with time functions
*/
function time(){
	this.lastUpdate = Date.now();
	this.dt = 0;
	this.oTime = 0;
	this.otick = 0

	this.time = function(){
		return this.oTime
	}

	this.tick = function(){
		return this.otick;
	}

	//Calculate deltatime
	this.calcDeltaTime = function(){
		var now = Date.now();
    	var delta = now - this.lastUpdate;
    	this.lastUpdate = now;

    	this.dt = delta;
    	this.oTime += delta; //Total time

    	this.otick++; //Total amount of frames so far
    	return delta;
	}

	//Return deltatime
	this.deltaTime = function(){
		return this.dt;
	}
}

/*
-----------------------------------------------MECHANICS------------------------------------------------------
*/

/*
	Mouse object that holds position
*/
function mouse(xVar,yVar){
	//X, Y coordinates
	//Previous X, Y coordinates
	//Visual X, Y coordinates
	this.X = xVar;
	this.Y = yVar;
	this.pX = this.X;
	this.pY = this.Y; 
	this.vX, this.vY;

	//Creates new coordinates
	this.newCoord = function(xVar, yVar){
		this.pX = this.X;
		this.pY = this.Y;
		this.X = xVar;
		this.Y = yVar;

		this.vX = xVar;
		this.vY = yVar;
		return;
	}

	//Update previous mouse position;
	this.updatePrev = function(){
		this.pX = this.X;
		this.pY = this.Y;
		return;
	}

	//Return coordinates of mouse
	this.getCoord = function(){
		return {X:this.X,Y:this.Y};
	}

	//Get visual coordinates of where the mouse should be
	this.getVisualCoord = function(){
		return {X:this.vX,Y:this.vY};
	}
	
	//Get previous coord from last measurement
	this.getPreviousCoord = function(){
		return {X:this.pX,Y:this.pY};
	}
}


/*
	Score functions
*/
function score(){
	this.crashes = 0;
	this.lastCrash = 0;
	this.crashLimit = 1000; //crash every X miliseconds
	this.speedLimit = 15;
	this.pickups = 0;
	this.skids = 0;

	//Skid function
	this.skid = function(){
		this.skids++;
		GetBlock.playSound("ping2");
		return;
	}

	//Pickup function
	this.pickup = function(){
		this.pickups++;
		GetBlock.playSound("pickup");
		return;
	}

	//Crash function
	this.crash = function(){
		this.crashes++;
		GetBlock.playSound("collide");
		return;
	}
}


/*
	Game variables
*/
function vars(){
	this.speed = 0; 
	this.skidding = false; 
	this.shaking = false; 
	this.shakeTmr = {chg:0};
	this.dangerColorNumber = 1; 
	this.maxHealth = 100;
	this.health = this.maxHealth;
	this.bgMusic = undefined;
	this.inDanger = false;
	this.dead = false;
	this.dangerColor = 0;
	this.invincible = false;
	this.level= {number: 1, nextLevel: 150};
	this.score = new score();

	this.getHealth = function(){
		//Make sure you can't have negative health
		if(this.health < 0)
			return 0;
		else
			return this.health;
	}

	//If player is dead, can't pickup
	this.canPickup = function(){
		if(this.dead)
			return false;

		return true;
	}

	//Returns speed
	this.getSpeed = function(){
		if(this.speed == NaN || this.speed < 1/10000)
			return 0;
		else
			return Math.round(this.speed*100);
	}

	//Detects if mouse is speeding
	this.speeding = function(mousePos, prevPos, dTime){
		var speed = this.calcSpeed(mousePos,prevPos,dTime)

		//If breaking limit
		if(Math.round(speed*100)> this.score.speedLimit){
			//Return information for mark creation
			return {speeding: true, mC:mousePos, mP: prevPos, speed: speed};
		}

		return {speeding: false};
	}

	//Calculate actual speed
	this.calcSpeed = function(mousePos, prevPos, dTime){
		//Get change in X and Y
		cX = Math.abs(prevPos.X - mousePos.X);
		cY = Math.abs(prevPos.Y - mousePos.Y);

		//Find the distance traveled
		hyp = Math.sqrt(cX^2 + cY^2);

		//Distance/time
		this.speed = (hyp / dTime);
		
		//Update old mouse position so we have up to date speed
		GetBlock.mouse.updatePrev();

		return this.speed;
	}

	//Update HUD with information
	this.updateHUD = function(HUD){
		$("#health .value").text(this.getHealth());
		$("#pickups .value").text(this.score.pickups);
		$("#crashes .value").text(this.score.crashes);
		$("#skids .value").text(this.score.skids);
	}

	//Check if player is dead
	this.checkDeath = function(){
		if(this.dead)
			return this.dead;

		//Danger zone
		if(this.health < .15*this.maxHealth){
			this.inDanger = true;
		} else {
			this.inDanger = false;
		}

		//Upon death...
		if(this.health <= 0){
			GetBlock.playSound("death",false);
			this.health = 0;
			this.dead = true;
		}
	}

	//Shake the screen
	this.shake = function(jCanvas){
		//If we're not allowed to shake, reset everything
		if(!this.shaking){
			jCanvas.css("top",0);
			jCanvas.css("left",0);
			//Make sure we're not in the danger zone
			if(!this.inDanger)
				$("body").css("background","rgba(0,0,0,0.1)");
			return;
		}

		//Randomize when the damage flash is.
		if(Math.random()*10 > 5 && !this.inDanger)
			$("body").css("background","#FF0000");
		else if(!this.inDanger)
			$("body").css("background","rgba(0,0,0,0.1)");

		/*
		//Randomized colors
		if(GetBlock.tick%10000== 0){
			r = parseInt((Math.random()*255).toString(16),16).toString();
			//g = b = "00"
			g = parseInt((Math.random()*255).toString(16),16).toString();
			b = parseInt((Math.random()*255).toString(16),16).toString();
			$("body").css("background","#"+r+g+b+"");
		}
		*/

		//Update position based on intensity
		jCanvas.css("top",Math.random()*this.shakeTmr.intensity*(Math.random()*10-5));
		jCanvas.css("left",Math.random()*this.shakeTmr.intensity*(Math.random()*10-5));
	}

	//Danger zone
	this.danger = function(boole){
		//If not in the danger zone
		if(!boole){
			//Reset
			$("body").css("background","rgba(0,0,0,0.1)");
			if(this.bgMusic != undefined)
				this.bgMusic.stop();
			return;
		}

		//Else 

		//Blast the wubstep
		if(this.bgMusic == undefined)
			this.bgMusic = GetBlock.playSound("wubstep",true);
		else 
			this.bgMusic.play();

		//Every frame change the color
		if(GetBlock.time.tick() % 1 == 0){
			var col = "#FFF"
			switch(this.dangerColor){
				case 1: 
					col = "#FF0000";
					break;
				case 2: 
					col = "#00FF00";
					break;
				case 3: 
					col = "#0000FF";
					break;
			}

			//Update the color
			$("body").css("background",col);
			this.dangerColor = Math.floor((Math.random()*3)+1);


			//r = parseInt((Math.random()*255).toString(16),16).toString();
			//g = parseInt((Math.random()*255).toString(16),16).toString();
			//b = parseInt((Math.random()*255).toString(16),16).toString();
			//$("body").css("background","#"+r+g+b+"");
		}
	}

	//Upon skidding, do some functions
	this.skid = function(){
		this.score.skid();
	}

	//Upon pickup, do some functions
	this.pickup = function(){
		return this.score.pickup();
	}

	//Upon crashing
	this.crash = function(time){
		//Check to make sure we're not crashing too rapidly
		if(time - this.score.lastCrash < this.score.crashLimit)
			return;

		//Get the speed
		speed = this.getSpeed();

		//If we're crashing at the speed of nothing, then we're not damaging anything
		if(speed == 0)
			return;

		//Get health loss
		penalty = speed;
		console.log("lost "+penalty+" HP");
		this.health -= penalty;

		//Add Crash
		this.score.crash(time);

		this.score.lastCrash = time;

		//Commence shaking
		this.shaking = true;

		//If we're recrashing, reset timer
		if(defined(this.shakeTmr.tmr))
			clearInterval(this.shakeTmr.tmr);

		//Setup timer for shaking
		this.shakeTmr.intensity = penalty;
		this.shakeTmr.tmr = setTimeout(function(){
			GetBlock.vars.shaking = false;
		},750);

		//Show damage popup
		GetBlock.showDamage(penalty, GetBlock.mouse.getCoord());

		return penalty;
	}

	//Setup background music
	this.backgroundMusic = function(str){
		if(this.bgMusic == undefined)
			playSound(str);
		else{
			stopSound(this.bgMusic);
			playSound(str);
		}

		return;
	}
}

/*
	Arena object
*/
function arena(){
	this.rightWall = $(window).width();
	this.bottomWall = $(window).height();
	this.leftWall = 0;
	this.topWall = 0;
	this.buffer = 10;
	this.colliding = false;
	this.collisionMatrix = {left: false, right: false, top: false, bottom: false, mouse: [undefined,undefined]};

	//update wall positions
	this.updateWalls = function(){
		this.rightWall = $(window).width();
		this.bottomWall = $(window).height();
	}

	//If anything is colliding, return true
	this.isColliding = function(){
		if(this.collisionMatrix.left || this.collisionMatrix.right || this.collisionMatrix.top || this.collisionMatrix.bottom)
			return true;
		return false;
	}

	//check collisions with walls
	this.checkCollision = function(pos){
		//get position
		var x = pos.X, y = pos.Y;

		//Left wall
		if(x <= this.leftWall + this.buffer)
			this.collisionMatrix.left = true;
		else 
			this.collisionMatrix.left = false;

		//Top wall
		if(y <= this.topWall + this.buffer)
			this.collisionMatrix.top = true;
		else 
			this.collisionMatrix.top = false;

		//Right wall
		if(x >= this.rightWall - this.buffer)
			this.collisionMatrix.right = true;
		else 
			this.collisionMatrix.right = false;

		//Bottom wall
		if(y >= this.bottomWall - this.buffer)
			this.collisionMatrix.bottom = true;
		else 
			this.collisionMatrix.bottom = false;

		//Update position of detection
		this.collisionMatrix.mouse = [x,y];
	}
}

/*
-----------------------------------------------GAME------------------------------------------------------
*/

/*
	Game Object, holds the master game and links to other objects
*/
function game(gameCanvas,jCanvas,HUD){
	this.fps = 60;
	this.audioEnabled = true;
	this.DEBUG = false;
	this.time = new time();
	this.mouse = new mouse(undefined,undefined);
	this.vars = new vars();
	this.start = undefined;
	this.goal = undefined;
	this.goals = [];
	this.blocks = [];
	this.marks = [];
	this.canvas = gameCanvas;
	this.jCanvas = jCanvas;
	this.jHUD = HUD;
	this.render = new renderer();
	this.arena = new arena();

	//Debug information
	this.runDebug = function(){
		var d = $("#debug");

		if(!this.DEBUG){
			d.text(" ");
			d.removeClass("active");
			return;
		}

		//Mouse coordinates
		mCoord = this.mouse.getCoord();
		mpCoord = this.mouse.getPreviousCoord();

		//More coordinates
		sCoord = this.start.getCoord();
		gCoord = this.goal.getCoord();

		d.addClass("active");
		d.html("<h3>Debug Info</h3>"+
			"<ul>"+
			"<li>Time: "+(this.time.time()/1000).toFixed(2)+" seconds</li>"+
			"<li>DeltaTime: "+this.deltaTime()+" ms</li>"+
			"<li>Ticks: "+this.time.tick()+" ms</li>"+
			"<li>FPS: "+Math.floor((1000/this.deltaTime()))+" frames</li>"+
			"<li>MousePos: ("+mCoord.X+","+mCoord.Y+") (px,px)</li>"+
			"<li>PrevMousePos: ("+mpCoord.X+","+mpCoord.Y+") (px,px)</li>"+
			"<li>Speed: "+this.vars.getSpeed()+" px/sec</li>"+
			"<li>StartPos: ("+sCoord.X.toFixed(2)+","+sCoord.Y.toFixed(2)+") (px,px)</li>"+
			"<li>GoalPos: ("+gCoord.X.toFixed(2)+","+gCoord.Y.toFixed(2)+") (px,px)</li>"+
			"<li>Colliding w/ Arena: "+this.arena.isColliding()+"</li>"+
			"</ul>"+
			"<h3>Score Info</h3>"+
			"<ul>"+
			"<li>Pickups: "+this.vars.score.pickups+"</li>"+
			"<li>Crashes: "+this.vars.score.crashes+"</li>"+
			"<li>Skids: "+this.vars.score.skids+"</li>"+
			"</ul>"+
			"<h3>Player Info</h3>"+
			"<ul>"+
			"<li>Health: "+this.vars.getHealth()+"</li>"+
			"<li>Skidding: "+this.vars.skidding+"</li>"+
			"<li>Shaking: "+this.vars.shaking+"</li>"+
			"<li>Invincible: "+this.vars.invincible+"</li>"+
			"<li>Dead: "+this.vars.dead+"</li>"+
			"<li>InDanger?: "+this.vars.inDanger+"</li>"+
			"</ul>"
			);

		return;
	}

	//Play a sound
	this.playSound = function(file,loop,autoPlay){
		if(!this.audioEnabled) return false;

		if(loop == undefined)
			loop = false;

		if(autoPlay == undefined)
			autoPlay = true;

		//Create sound
		var snd = new sound(getSoundPath(file), file, loop);
		if(autoPlay)
			snd.play();

		return snd;
	}

	this.transferPoint = function(pnt){
		//Transfer color
		pnt.newColor("#0000FF");
		//Put old goal as obstacle
		this.blocks.push(pnt);
		return pnt;
	}

	//Create new point, and push it to blocks variable
	this.createPoint = function(xVar, yVar, length, width, color, static){
		//Create box with values
		var pnt = new point(xVar, yVar, length, width, color, static);
		this.blocks.push(pnt);
		return pnt;
	}

	//Damage popup
	this.showDamage = function(damage, pos){
		//Get the position
		pX = pos.X;
		pY = pos.Y;
		//Unique name
		id = this.time.time() + pX + Math.random()*15000;

		//Round it for HTML
		id = Math.round(id);
		//Create element
		this.jHUD.append("<div id='"+id+"' class='dmg noclick'>-"+damage+"</div>");

		//For ease, give it an alias
		var elm = $("#"+id);

		//Get the width & height w/ offset
		elmWidth = elm.width() + parseInt(elm.css("padding"))*2;
		elmHeight = elm.height() + parseInt(elm.css("padding"))*2;

		//Make sure it's going to fit on screen
		if(pX+elmWidth > this.jHUD.width())
			pX = this.jHUD.width()-elmWidth;
		if(pX < 0)
			pX = 0;

		if(pY+elmHeight > this.jHUD.height())
			pY = this.jHUD.height()-elmHeight;
		if(pY < 0)
			pY = 0;

		//Determine color based on amount of damage taken
		red = Math.round(155*damage/this.vars.maxHealth)+100;
		if(red >255)
			red = 255;

		//Give it a color
		elm.css("backgroundColor","rgb("+red+",0,0");
		//Place at position
		elm.css("left",pX);
		elm.css("top",pY);

		//Animate it upwards and fade out
		elm.animate({
			top: "-=100",
			opacity: 0
		},2000,function(){
			elm.remove();
		});
	}

	//+1 popup
	this.getGoal = function(pos){
		//Get the position
		pX = pos.X;
		pY = pos.Y;

		//Unique name
		id = this.time.time() + pX + Math.random()*15000;

		//Round for HTML
		id = Math.round(id);

		//Create element
		this.jHUD.append("<div id='"+id+"' class='reward popup noclick'>+1</div>");

		//For ease, alias
		var elm = $("#"+id);

		//Get real width/height
		elmWidth = elm.width() + parseInt(elm.css("padding"))*2;
		elmHeight = elm.height() + parseInt(elm.css("padding"))*2;

		//Make sure it's on screen
		if(pX+elmWidth > this.jHUD.width())
			pX = this.jHUD.width()-elmWidth;
		if(pX < 0)
			pX = 0;

		if(pY+elmHeight > this.jHUD.height())
			pY = this.jHUD.height()-elmHeight;
		if(pY < 0)
			pY = 0;

		//Create popup at this position
		elm.css("left",pX);
		elm.css("top",pY);

		//Animate upwards and fade out
		elm.animate({
			top: "-=100",
			opacity: 0
		},2000,function(){
			elm.remove();
		});
	}

	//Create skid mark
	this.createSkid = function(mousePos, prevPos, length, width, color, static){
		//Determine if it's possible 
		if((prevPos.X == undefined || prevPos.Y == undefined) || (mousePos.X == undefined || mousePos.Y == undefined))
			return;

		//Determine change in X and Y and get intervals
		var cX = (prevPos.X - mousePos.X)/width,
			cY = (prevPos.Y - mousePos.Y)/length;

		//Setup loop variables
		var i = 0,
			drawX = prevPos.X,
			drawY = prevPos.Y,
			there = {};

		while(true){
			//Find if it's to the positive or negative direction
			modX = cX/Math.abs(cX);
			modY = cY/Math.abs(cY);

			//Make sure that if we divided by 0, make the value 0
			if(modX == NaN)
				modX = 0;
			if(modY == NaN)
				modY = 0;

			//New position on the interval //Commented: interval as width & length
			newX = drawX - cX//width * modX;
			newY = drawY - cY//length * modY;

			//Get remaining distance to goal
			dGoalX = Math.abs(newX - mousePos.X);
			dGoalY = Math.abs(newY - mousePos.Y);

			//If within, stop iterating new positions
			if(dGoalX < width){
				there.X = true;
			} else {
				drawX = newX;
				there.X = false;
			}

			//if within, stop iterating new positions
			if(dGoalY < length){
				there.Y = true;
			} else {
				drawY = newY;
				there.Y = false;
			}

			mrk = new point(drawX,drawY, length, width, color, static);
				this.marks.push(mrk);
			//If there, make last point and break out of loop
			if(there.X && there.Y)
				break;

			//Safety loop
			if(i < 100)
				i++;
			else{
				console.log("infinite loop");
				break;
			}
		}

		return;
	}

	//Create goal point
	this.createGoalPoint = function(xVar, yVar, length, width, color, static){
		this.goal = new point(xVar, yVar, length, width, color, static)
		return;
	}

	//Determine a good goal position
	this.createGoodGoal = function(){
		//Get position
		var startPos = this.start.getCoord();
		color = "#FF0000";
		size = 20;

		while(true){
			//Get boundaries
			scrWidth = $(window).width();
			scrHeight = $(window).height();

			//Determine new value within range
			xPar = Math.floor((Math.random()*(scrWidth))+10)*getMod();
			yPar = Math.floor((Math.random()*(scrHeight))+10)*getMod();

			//Add positions together
			fX = startPos.X + xPar;
			fY = startPos.Y + yPar;
			//Determine if it's within the bounds
			if((fX <= scrWidth-size && fX >= size) && (fY <= scrHeight-size && fY >= size))
				break;
		}

		//Create the point
		this.createGoalPoint(fX, fY, size, size, color, false);
		return;
	}

	this.collisionCheck = function(list,mousePos){
		//if(list[i] == undefined || list[i].length <= 0)
		//		continue;

		//Check collision
		for (var i = 0; i < list.length; i++) {
			if(list[i].checkCollision(mousePos))
				return true;
		};

		return false;
	}

	//On resize, run these functions
	this.resize = function(){
		this.canvas.width = $(window).width();
		this.canvas.height = $(window).height();

		//this.start.position({X:$(window).width()/2,Y:$(window).height()/2});
		this.render.update([this.blocks,this.marks],canvas,true);
		return;
	}

	//Unfinished
	this.levelUp = function(){
		return;
		this.vars.level.number++;

		this.vars.level.nextLevel+=150;

		//console.log("her");

		if(this.vars.level == 2)
			this.backgroundMusic.redefineFile("bgmusicwire");

	}

	//Update game logic & information
	this.update = function(){
		mousePos = this.mouse.getCoord();
		theTime = this.time.time();

		//Update wall position
		this.arena.updateWalls();
		//Check collisions
		this.arena.checkCollision(mousePos);

		//Get speeding information
		speeding = this.vars.speeding(this.mouse.getCoord(),this.mouse.getPreviousCoord(),this.deltaTime());
		if(speeding.speeding){
			//Create skid if speeding
			this.createSkid(speeding.mC,speeding.mP,10,10,"#000",true);
			this.vars.skid();
		}

		//If at goal position & is alive
		if(this.goal.checkCollision(mousePos) && this.vars.canPickup()){
			//Get the goal
			this.getGoal(this.goal);
			//make it so we don't die so quickly
			this.vars.invincible = true;
			//Make the start the old goal
			this.start = this.transferPoint(this.goal);
			//Add pickup
			this.vars.pickup();
			//Create new goal
			this.createGoodGoal();
			//Turn off invincibility
			setTimeout(function(){GetBlock.vars.invincible = false;},GetBlock.vars.score.crashLimit/2);
		}

		//Shake loop
		this.vars.shake(this.jCanvas);

		//If in danger zone
		if(this.vars.inDanger){
			//Stop the music
			this.backgroundMusic.stop();
			//Start the danger zone
			this.vars.danger(true);
		} else {
			//Otherwise, get out of the danger zone
			this.vars.danger(false);
			//play the background music
			this.backgroundMusic.play();
		}

		//Update HUD information
		this.vars.updateHUD();

		//Check if player is alive
		this.vars.checkDeath();

		//Check collision information
		if((this.collisionCheck(this.blocks,mousePos) || (this.arena.isColliding() && speeding.speeding) ) && !this.vars.invincible){
			this.vars.crash(theTime);
		}


		//this.start.position(this.mouse.getCoord());
		//this.start.position({},this.start.orbitOffset(50,this.time.tick()));

		col = parseInt(Math.abs(Math.sin(this.time.tick()*(Math.PI/180)))*220);
		
		if(this.vars.score.pickups % this.vars.level.nextLevel == 0)
			this.levelUp();
		if(this.vars.level == 2)
			this.start.newColor("rgb("+col+","+col+","+col+")");
		return;
	}

	//Return Audio settings
	this.audioSetting = function(){
		return this.audioEnabled;
	}

	//Gets deltatime
	this.deltaTime = function(){
		return this.time.deltaTime();
	}

	//Main game loop
	this.loop = function(){
		//Alias
		GB = GetBlock;
		//Delta Time
		dTime = GB.time.calcDeltaTime();
		GB.update();
		GB.render.update([GB.blocks,GB.marks,[GB.goal]],canvas);

		GB.runDebug();

		setTimeout(GB.loop,1000/GB.fps); //Run function based on desired FPS
	}

	//Initialize the game field & start the loop
	this.init = function(){
		this.canvas.width = $(document).width();
		this.canvas.height = $(document).height();

		this.backgroundMusic = this.playSound("hangerbay",true);

		setTimeout(function(){this.canvas.width = $(window).width();this.canvas.height = $(window).height();},0);

		this.start = this.createPoint($(window).width()/2,$(window).height()/2,20,20,"#0000FF",false);
		this.createGoodGoal();
		this.loop();
	}
}

/*
-----------------------------------------------INIT FUNCTIONS------------------------------------------------------
*/

/*
	Start up the necessary elements
*/
function init(){
	//initVariables();
	GetBlock = new game(document.getElementById('canvas'),$("#canvas"),$("#HUD"));
	GetBlock.init();

	$("canvas").removeClass("nodisplay");
	$("#HUD").removeClass("nodisplay");
	$("body").css("background","rgba(0,0,0,0.1)");
	console.log(GetBlock);
	return;
}

//Bind resize to 
$(window).resize(function(){
	if(defined(GetBlock))
		GetBlock.resize();
});

//Bind mouse move
window.onmousemove = function(e){
	if(defined(GetBlock))
		GetBlock.mouse.newCoord(e.clientX,e.clientY);
};