<!doctype html>
<html>
	<head>
		<script src="jquery.js"></script>
		<script src="transit.js"></script>
		<script src="color.js"></script>
		<script src="./gbrepo/script.js"></script>
		<title>Get Blocks</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<link rel="stylesheet" href="./gbrepo/style.css" type="text/css"/>
		<style>
			.menu{
				position: absolute;
				top: 0;
				left: 0;
				width: 600px;
				border: 2px solid #000;
				background: #000;
				box-shadow: 0px 0px 20px #000;
			}
			.menu .headerImage{
				background: #e9e3db;
				height: 200px;
				border-bottom: 5px solid #000;
			}
			.menu .infoArea{
				text-align: center;
				padding: 10px 50px 10px 50px;
				background: #e9e3db;
				border-bottom: 5px solid #000;
			}
			.menu .disclaimer{
				text-align: center;
				font-size: 32px;
				/*padding: 10px 50px 10px 50px;*/
				background: #000;
				color: #FF0000;
				border-bottom: 5px solid #000;
			}
			.menu .buttons ul{
				margin: 0 auto;
				padding: 0;
				list-style: none;
				width: 100%;
			}
			.menu .buttons li:first-child{
				border-top: none;
			}
			.menu .buttons li{
				border-top: 2px #FFF solid;
				cursor: pointer;
				text-align: center;
				font-size: 36px;
				padding: 20px;
				background: rgba(170,170,170,1);
			}
			.menu .buttons li:hover{
				background: rgba(100,100,100,1);
			}
			.menu .buttons li:active{
				background: rgba(100,100,100,1);
			}
		</style>
	</head>
	<body>
		<div id="debug" class="noclick"></div>
		<div id="mainmenu" class="menu">
			<div class="headerImage"><img src="./gbrepo/img/logo.png" width="600px" height="200px"/></div>
			<div class="disclaimer">
				DO NOT PLAY IF EPILEPTIC
			</div>
			<div class="buttons">
				<ul>
					<li onclick="startGame();">Start</li>
					<li onclick="changeMenu('help')">Help</li>
					<li onclick="changeMenu('about')">About</li>
				</ul>
			</div>
		</div>
		<div id="helpmenu" class="menu nodisplay">
			<div class="headerImage"><img src="./gbrepo/img/logo.png" width="600px" height="200px"/></div>
			<div class="infoArea">
				<h3>Help</h3>
				<p>Upon starting, you will see two colors of blocks.</p>
				<p>Red is your goal.</p>
				<p>Blue are your obstacles.</p>
				<p>Goals become obstacles after pickup, don't wait too long!</p>
				<p>The speed of your cursor will create marks if you move too fast, damage is relative to your speed!</p>
				<p>Collect as many blocks as you can!</p>
			</div>
			<div class="buttons">
				<ul>
					<li onclick="changeMenu('main')">Back</li>
				</ul>
			</div>
		</div>
		<div id="aboutmenu" class="menu nodisplay">
			<div class="headerImage"><img src="./gbrepo/img/logo.png" width="600px" height="200px"/></div>
			<div class="infoArea">
				<h3>About Get Blocks</h3>
				<p>Created by: Christopher Sidell</p>
				<h3>Credits</h3>
				<small>Ocean Blue Loop with Horn - Menu-Music-Man (Newgrounds) | 
					Hanger Bay - WarmanSteve (Newgrounds) | 
					Wrong Wire - Retimer (Newgrounds) | 
					Dubstep Loop 1 - headphonesvocal (freesound) | 
					archi_sonar_05 - Argitoth (freesound) |
					ping 2 - cameronmusic (freesound) |
					coin object - fins (freesound) |
					energy - fins (freesound) |
					Computer boop - fordps3 (freesound) |
					8-bit pickup - timgormly (freesound) |
					Clank Car Crash Collision - qubodup (freesound) |
					carstartskidcrash - musicmasta1 (freesound) |
					chrysler LHS tiresqueal - audible-edge (freesound)
				</small>
			</div>
			<div class="buttons">
				<ul>
					<li onclick="changeMenu('main')">Back</li>
				</ul>
			</div>
		</div>

		<div id="HUD" class="noclick nodisplay">
			<div id="infoBar">
				<div id="health"><span class="value">0</span> HP</div>
				<div id="pickups"><span class="value">0</span> Pickups</div>
				<div id="crashes"><span class="value">0</span> Crashes</div>
				<div id="skids"><span class="value">0</span> skids</div>
			</div>
		</div>
		<canvas id="canvas" class="nodisplay"></canvas>
	</body>
	<script>
	var menuMusic,cycle = {speed:2000};
	function startGame(){
		menuMusic.stop();
		$(".menu").addClass("nodisplay");
		clearInterval(cycle.inte);
		init();
	}

	function changeMenu(menu){
		if($("#"+menu+"menu").length <=0)
			return;

		$(".menu").addClass("nodisplay");
		$("#"+menu+"menu").removeClass("nodisplay");
	}

	function cycleMenu(){
		color = "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")";
		$(".menu .headerImage").animate({
			backgroundColor: color,
		},cycle.speed);
	}

	function placeMenus(){
		$(".menu").each(function(index,elm){
			$(elm).css("left",$(window).width()/2-$(elm).width()/2);
			$(elm).css("top",$(window).height()/2-$(elm).height()/2);
		});
	}
	$(window).resize(function(){
		placeMenus();
	});
	$(document).ready(function(){
		menuMusic = new sound("./gbrepo/sound/menuMusic.ogg",true,true);
		menuMusic.play();
		placeMenus();
		cycleMenu();
		cycle.inte = setInterval(cycleMenu,cycle.speed);
	});
	</script>
</html>