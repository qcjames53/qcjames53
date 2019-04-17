var main = document.getElementById("main");
var body = document.getElementById("body");
var textWrapper = document.getElementById("textWrapper");
var image = document.getElementById("img");

var o = {
	outputWidth : 100,
	outputHeight : 45,
	contents : new Array(),
	mouseX : 0,
	mouseY : 0,
	mouseOldX : 0,
	mouseOldY : 0,
	mouseChar: '█',
	backgroundChar: '-',
	mouseUnderChar: '-',
	currentPage : 0,
	commands : new Array(),
	maxCommandLength : 90,
	maxTerminalLines : 38,
	drawTerminalOnReturn : true
}

//variables used in snake
var snake = {
	playing: false,
	tail : new Array(),
	tailLength : 10,
	headX : 0,
	headY : 0,
	velocityX : 0,
	velocityY : 1,
	appleX : 20,
	appleY : 20,
	velocityLock: false
}

//variables used in raycaster
var r = {
	playing: false,
	map: new Array(),
	miniMap: new Array(),
	px: 20,
	py: 20,
	dirX: -1,
	dirY: 0,
	planeX: 0,
	planeY: 0.66,
	dw: false,
	da: false,
	ds: false,
	dd: false,
	movementSpeed: 0.1,
	rotationSpeed: 0.06
}

var gm_gameOfLifeRep;
var gm_rainRep;
var gm_plagueRep;
var gm_snakeRep;
var gm_rayRep;

var pages;
var pagesReq = new XMLHttpRequest();
pagesReq.responseType = "text";
pagesReq.addEventListener("load", pagesReqListener);
pagesReq.open("GET", "pages.json");
pagesReq.send(null);

function pagesReqListener () {
	pages = JSON.parse(this.responseText);
	init();
}

var files;
var filesReq = new XMLHttpRequest();
filesReq.responseType = "text";
filesReq.addEventListener("load", filesReqListener);
filesReq.open("GET", "files.json");
filesReq.send(null);

function filesReqListener () {
	files = JSON.parse(this.responseText);
}

function init() {
	for(var i = 0; i < o.outputHeight; i++) {
		o.contents.push(new Array(o.outputWidth));
		for(var j = 0; j < o.outputWidth; j++) {
			o.contents[i][j] = o.backgroundChar;
		}
	}
	o.commands.push("BS-DOS 1.9.4 (c)2010 BCS, A SUBSIDIARY OF DM-CA");
	o.commands.push("Visit dm-ca.com for updates and support.");
	o.commands.push("");
	o.commands.push("This software is provided \"as-is\" without any warranty. Any medical claims have not been");
	o.commands.push("endorsed by the FDA. This software is not intended to treat, cure, or prevent any disease.");
	o.commands.push("This is not for you.");
	o.commands.push("");
	o.commands.push(">");
	document.onkeydown = preventBackspaceHandler;
	document.addEventListener("mousemove",mouseMove);
	document.addEventListener("mousedown",mouseDown);
	document.addEventListener("mouseup",mouseUp);
	document.addEventListener("keydown", keyDown);
	document.addEventListener("keyup", keyUp);
	colors("white","black");
	drawMenu();
	blit();
}

function draw(input, row, col, maxwidth, link) {
	if(typeof link === "undefined") link = "";
	
	col++;
	row++;
	maxwidth -= 2;

	var words = input.split(" ");
	var initCol = col;
	var initRow = row;
	for(var i = 0; i < words.length; i++) {
		if(col - initCol + words[i].length > maxwidth || words[i]=="~n") {
			while(col - initCol <= maxwidth) {
				o.contents[row][col] = " " + link;
				col++;
			}
			
			col = initCol;
			row++;
			
		}
		else if(col != initCol && i < words.length) {
			o.contents[row][col] = "  " + link;
			col++;
		}
		
		if(words[i] != "~n") {
			for(var j = 0; j < words[i].length; j++) {
				o.contents[row][col] = words[i].charAt(j) + " " + link;
				col++;
			}
		}
	}
	while(col - initCol <= maxwidth) {
		o.contents[row][col] = "  " + link;
		col++;
	}
	
	var ir = initRow-1, ic = initCol-1, fr = row+1, fc = initCol+maxwidth+1;
	for(var i = ir; i < fr; i++) {o.contents[i][ic] = "│ " + link; o.contents[i][fc] = "│ " + link;}
	for(var i = ic; i < fc; i++) {o.contents[ir][i] = "─ " + link; o.contents[fr][i] = "─ " + link;}
	o.contents[ir][ic] = "┌ " + link;
	o.contents[ir][fc] = "┐ " + link;
	o.contents[fr][ic] = "└ " + link;
	o.contents[fr][fc] = "┘ " + link;
	blit();
	return [ir,ic,fr,fc];
}

function clear() {
	for(var i = 0; i < o.contents.length; i++) {
		for(var j = 0; j < o.contents[i].length; j++) {
			o.contents[i][j] = o.backgroundChar;
		}
	}
}

function colors(foreground, background) {
	body.style = `color:${foreground}; background-color:${background}`;
}

function drawMenu() {
	clear();
	
	draw("QUINN JAMES ONLINE",0,2,19);
	draw("Use the mouse to navigate",0,23,26);
	draw("Use the keyboard to hack",0,51,26);
	draw("__ _____ ~n _ / ___ \\ ~n _/ /\\_/\\ \\ ~n / /_/ \\_\\ \\ ~n \\ \\ \\_/ / / ~n _\\ \\/_\\/\\_\\ ~n _ \\____\\/_/",35,86,12);
	
	var row = 4;
	var col = 2;
	
	for(var i = 0; i < pages.length; i++) {
		if(pages[i].contents.length > 0) draw(pages[i].title, row, col, 31, i+1);
		else draw(pages[i].title, row, col, 31, pages[i].links[0]);
		row += 3;
		if(row > o.outputHeight-3) {
			row = 4;
			col += 33;
		}
	}
	
	setImage();
}

function drawPage(pageIndex) {	
	if(pageIndex > pages.length) return "Outside of page index";
	
	clear();
	
	if(pageIndex == 0) {
		drawMenu();
		document.title = "Quinn James Online";
	}
	else {
		pageIndex--;
		document.title = pages[pageIndex].title;
		draw("QUINN JAMES ONLINE",0,2,19,0);
		draw("Return to home screen",0,23,22,0);
		draw(pages[pageIndex].title,4,2,60);
		draw(pages[pageIndex].contents,8,2,60);
		
		for(var i = 0; i < pages[pageIndex].links.length; i+=2) {
			draw(pages[pageIndex].links[i],3*(i/2)+8,67,30,pages[pageIndex].links[i+1])
		}
		
		setImage(pages[pageIndex].img);
	}
	
	o.mouseUnderChar = o.contents[o.mouseX][o.mouseY];
}

function drawConsole() {
	
	var output = new Array();
	for (var i = 0; i < o.maxTerminalLines; i++) {
		if(o.commands.length-1 - o.maxTerminalLines + i + 1 >= 0) output.push(o.commands[o.commands.length-1 - o.maxTerminalLines + i + 1]);
		else output.push("");
	}
	
	var outputText = "";
	for (var i = 0; i < output.length; i++) {
			outputText += output[i];
			if(i < output.length - 1) outputText += " ~n ";
	}
	
	draw(outputText,4,2,95);
}

function mouseMove(evt) {
	o.mouseY = Math.min(Math.max(Math.floor((evt.clientX - textWrapper.offsetLeft) / main.clientWidth * o.outputWidth),0),o.outputWidth-1);
	o.mouseX = Math.min(Math.max(Math.floor((evt.clientY - textWrapper.offsetTop) / main.clientHeight * o.outputHeight),0),o.outputHeight-1);
	moveCursorEfficient();
}

function moveCursorEfficient() {
	o.contents[o.mouseOldX][o.mouseOldY] = o.mouseUnderChar;
	o.mouseUnderChar = o.contents[o.mouseX][o.mouseY];
	o.mouseOldX = o.mouseX;
	o.mouseOldY = o.mouseY;
	o.contents[o.mouseX][o.mouseY] = o.mouseChar;
	blit();
}

function mouseDown(evt) {
	if(o.mouseUnderChar.substring(2) != "") {
		colors("gray","black");
	}
}	

function mouseUp(evt) {
	colors("white","black");
	if(o.mouseUnderChar.substring(2) != "") parseLink(o.mouseUnderChar.substring(2));
}

function keyDown(evt) {
	//capturing keystrokes for games
	if(snake.playing) {
		if (snake.velocityLock) return;
		if (snake.velocityY != 1 && (evt.keyCode == 37 || evt.keyCode == 65)) {
			snake.velocityX = 0;
			snake.velocityY = -1;
		}
		else if (snake.velocityX != 1 && (evt.keyCode == 38 || evt.keyCode == 87)) {
			snake.velocityX = -1;
			snake.velocityY = 0;
		}
		else if (snake.velocityY != -1 && (evt.keyCode == 39 || evt.keyCode == 68)) {
			snake.velocityX = 0;
			snake.velocityY = 1;
		}
		else if (snake.velocityX != -1 && (evt.keyCode == 40 || evt.keyCode == 83)) {
			snake.velocityX = 1;
			snake.velocityY = 0;
		}
		snake.velocityLock = true;
		return;
	}
	
	if(r.playing) {
		if((evt.keyCode == 37 || evt.keyCode == 65)) {
			r.da = true;
		}
		else if ((evt.keyCode == 38 || evt.keyCode == 87)) {
			r.dw = true;
		}
		else if ((evt.keyCode == 39 || evt.keyCode == 68)) {
			r.dd=true;
		}
		else if ((evt.keyCode == 40 || evt.keyCode == 83)) {
			r.ds = true;
		}
		return;
	}
	
	//terminal keystroke capture
	if(evt.keyCode == 8 && o.commands[o.commands.length-1].length > 1) {
		o.commands[o.commands.length-1] = o.commands[o.commands.length-1].substring(0,o.commands[o.commands.length-1].length-1);
		drawConsole();
	}
	else if(evt.keyCode == 13 && o.commands[o.commands.length-1].length > 0) {
		parseCommand(o.commands[o.commands.length-1].substring(1));
		o.commands.push(">");
		var blip = new Audio("blip.mp3");
		blip.play();
	}
	else if(((evt.keyCode >= 48 && evt.keyCode <= 90) || (evt.keyCode >= 96 && evt.keyCode <= 105)) && o.commands[o.commands.length-1].length < o.maxCommandLength) {
		o.commands[o.commands.length-1] += String.fromCharCode(evt.keyCode);
	}
	else if(evt.keyCode == 32 && o.commands[o.commands.length-1].length < o.maxCommandLength) {
		o.commands[o.commands.length-1] += " ";
	}
	else if((evt.keyCode == 173 || evt.keyCode == 189) && o.commands[o.commands.length-1].length < o.maxCommandLength) {
		o.commands[o.commands.length-1] += "-";
	}
	else if(evt.keyCode == 190 && o.commands[o.commands.length-1].length < o.maxCommandLength) {
		o.commands[o.commands.length-1] += ".";
	}
	
	if(o.commands[o.commands.length-1].length == o.maxCommandLength) {
		var blip = new Audio("blip.mp3");
		blip.play();
	}
	
	if(o.drawTerminalOnReturn) {
		drawConsole();
		o.contents[42][3+o.commands[o.commands.length-1].length] = o.mouseChar;
		blit();
	}
	
	o.drawTerminalOnReturn = true;
}

function keyUp(evt) {
	if(r.playing) {
		if((evt.keyCode == 37 || evt.keyCode == 65)) {
			r.da = false;
		}
		else if ((evt.keyCode == 38 || evt.keyCode == 87)) {
			r.dw = false;
		}
		else if ((evt.keyCode == 39 || evt.keyCode == 68)) {
			r.dd = false;
		}
		else if ((evt.keyCode == 40 || evt.keyCode == 83)) {
			r.ds = false;
		}
		return;
	}
}

function preventBackspaceHandler(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 8) {
        return false;
    }
}

function parseLink(string) {
	if(!isNaN(string)) {
		if (parseInt(string) >= 0 && parseInt(string) <= pages.length) {
			location.hash = string;
			return "Loading local page " + parseInt(string);
		}
		o.drawTerminalOnReturn = true;
		return "[ERROR] Local page " + parseInt(string) + " does not exist"
	}
	window.open(string,"_self");
	return "Opening external site...";
}

window.onhashchange = function() {
	if(location.hash.length > 0) {
		drawPage(parseInt(location.hash.replace('#',''),10));
	}
	else {
		drawPage(0);
	}
}

function setImage(link) {
	$("#img").fadeOut(500);
	setTimeout(setImage2, 500, link);
}

function setImage2(link) {
	img.src = link;
}

function blit() {
	var outputString = "";
	for(var i = 0; i < o.contents.length; i++) {
		for(var j = 0; j < o.contents[i].length; j++) {
			var temp = o.contents[i][j].charAt(0);
			if(temp == " " || temp == ' ') outputString += "&nbsp;";
			else outputString += o.contents[i][j].charAt(0);
		}
		outputString += "<br/>";
	}
	main.innerHTML = outputString;
}

function parseCommand(cmd) {
	var spaceIndex = cmd.indexOf(" ");
	if(spaceIndex == -1) spaceIndex = cmd.length;
	var command = cmd.substring(0,spaceIndex).toUpperCase();
	var subcommand = cmd.substring(spaceIndex+1).toUpperCase();
	
	clear();
	draw("QUINN JAMES ONLINE",0,2,19,0);
	draw("Return to home screen",0,23,22,0);
	
	switch (command) {
		case "APT":
		case "APT-GET":
		case "PACMAN":
		case "INSTALL":
			o.commands.push("Reading packages...");
			o.commands.push("[ERROR] Repository list corrupted. Please reinstall package manager to rebuild.");
			break;
		case "BSIDE":
		case "CAT":
		case "CONCATENATE":
			var match = -1;
			for (var i = 0; match == -1 && i < files.length; i++) {
				if(files[i][0] == subcommand) match = i;
			}
			if (subcommand == "") o.commands.push("BSdos IDE (BSIDE) V3.14.1 (c)1999-2011 Pawnee University. Append filename as flag to open.");
			else if (match == -1) o.commands.push("Error: File '" + subcommand + "' read protected or does not exist.");
			else {
				o.commands.push("..................BSdos IDE (BSIDE) V3.14.1 (c)1999-2011 Pawnee University...................");
				for(var i = 0; i < files[match].length; i++) {
					o.commands.push(files[match][i]);
				}
				o.commands.push("............................End concatenation. Stopping program..............................");
			}
			break;
		case "CD":
			o.commands.push("No disk inserted. Please insert a disk and try again.");
			break;
		case "CLS":
		case "CLEAR":
			o.commands = new Array();
			break;
		case "CMD":
			o.commands.push("CMD is no longer supported. Try 'POWERSHELL' instead.");
			break;
		case "CONTROL-PANEL":
			o.commands.push("CONTROL-PANEL is legacy. Use 'SETTINGS' instead.");
			break;
		case "EMACS":
			o.commands.push("Loading...");
			break;
		case "FOOD":
		case "MEME":
		case "MCDONALDS":
		case "WENDYS":
		case "TACO":
		case "BURGER":
		case "HOTDOG":
			o.commands.push(command+" machine 🅱roke");
			break;
		case "GOL":
		case "GAME":
		case "GAMEOFLIFE":
		case "GAME-OF-LIFE":
		case "CONWAY":
		case "CONWAYS":
		case "CONWAYS-GAME-OF-LIFE":
			gm_gameOfLifeRep = setInterval(gm_gameOfLife, 100);
			break;
		case "HALP":
			o.commands.push("····APT [package name] - Package installer.");
			o.commands.push("····BSIDE [file name] - Trial IDE. Concatenation only.");
			o.commands.push("····CD [directory] - Change directory to the specified location.");
			o.commands.push("····CLS - Clears screen.");
			o.commands.push("····GAME-OF-LIFE - Conway's game of life. Alt: GOL");
			o.commands.push("····HALP - Displays list of usable commands for current user.");
			o.commands.push("····LINUX - It's a unix system. I know this. A ZUI.");
			o.commands.push("····LSD - Lists files in the current system directory.");
			o.commands.push("····OPEN [filename] - Opens a file.");
			o.commands.push("····PAGE [number] | PAGE [url] - Loads a given webpage by index or location.");
			o.commands.push("····PLAGUE - No desc.");
			o.commands.push("····RAIN - No desc.");
			o.commands.push("····RAYCASTER - No desc. Alt: RAY");
			o.commands.push("····SNEK - Net opisaniya.");
			o.commands.push("····XKCD - Loads alternate unix frontend.");
			break;
		case "HELLO":
			o.commands.push("Hi.");
			break;
		case "HELP":
			o.commands.push("'"+command+"' is not recognized as a valid command");
			o.commands.push("Similar command: 'HALP'");
			break;
		case "HI":
			o.commands.push("Hello.");
			break;
		case "LINUX":
		case "UBUNTU":
		case "UNIX":
		case "DEBIAN":
		case "DISTRO":
		case "PENGUIN":
		case "LINUS":
		case "SERVER":
		case "HACK":
		case "EAGLE":
			o.commands.push("It's a unix system. I know this.");
			draw("[Eagle mode]",0,47,13,"http://eaglemode.sourceforge.net/");
			break;
		case "LS":
			o.commands.push("Error at /usr/share/Adobe/doc/example/amdroid_vm/root/sbin/ls.jar: Device is not responding.");
			o.commands.push("Similar command: 'LSD'");
			break;
		case "LSD":
			o.commands.push("");
			var temp = new Array();
			for(var i = 0; i < files.length; i++) {
				temp.push(files[i][0]);
			}
			temp.sort();
			for (var i = 0; i < temp.length; i++) {
				o.commands.push(temp[i]);
			}
			o.commands.push("");
			break;
		case "OPEN":
			o.commands.push("I'm sorry Dave. I'm afraid I can't do that.");
			break;
		case "PAGE":
		case "LOAD":
		case "FILE":
		case "LINK":
			o.drawTerminalOnReturn = false;
			o.commands.push("Loading link to '" + subcommand + "'");
			o.commands.push(parseLink(subcommand));
			break;
		case "PLAGUE":
			gm_plagueRep = setInterval(gm_plague, 100);
			break;
		case "POWERSHELL":
			o.commands.push("POWERSHELL is for 32 bit systems. Please run 'POWERSHELL-X64");
			break;
		case "POWERSHELL-X64":
			o.commands.push("Due to security concerns, POWERSHELL-X64 can no longer modify system settings. Use 'CONTROL-PANEL' instead.");
			break;
		case "QUICK-ACCESS":
			o.commands.push("QUICK-ACCESS requires specialized hardware. Try 'STORE' for general installations.");
			break;
		case "RAIN":
			gm_rainRep = setInterval(gm_rain, 100);
			break;
		case "RAYCASTER":
		case "RC":
		case "RAY":
			gm_rayRep = setInterval(gm_ray_rayCast,30);
			break;
		case "ROBLOX":
			o.commands.push("Oof.");
			break;
		case "SETTINGS":
			o.commands.push("SETTINGS is depreciated. Please use 'QUICK-ACCESS' instead.");
			break;
		case "SNAKE":
			o.commands.push("'"+command+"' is not recognized as a valid command");
			o.commands.push("Similar command: 'SNEK'");
			break;
		case "SNEK":
			o.commands.push("ZAPUSK SNEK...");
			snake.playing = true;
			gm_snakeRep = setInterval(gm_snake, 50);
			break;
		case "SOFTWARE-INSTALL-WISARD":
			o.commands.push("'SOFTWARE-INSTALL-WISARD' is no longer supported. Try 'CMD' for program installs.");
			break;
		case "STORE":
			o.commands.push("STORE is offline. For legacy software, use 'SOFTWARE-INSTALL-WISARD'.");
			break;
		case "SUDO":
			o.commands.push("No.");
			break;
		case "VI":
		case "VIM":
			o.commands.push("Due to GNU GPL issues, vim can no longer be offered for web users.");
			break;
		case "XKCD":
			parseLink("https://uni.xkcd.com/");
			break;
		case "":
			o.commands.push("Welcome to NULL island. Current population: NaN.");
			break;
		default:
			o.commands.push("'"+command+"' is not recognized as a valid command.");
			o.commands.push("Try 'HALP' for an incomplete list of valid commands.");
			break;
	}
}

function isLetterOrDigit(ch) {
	return (ch.codePointAt(0) >= 65 && ch.codePointAt(0) <= 90) || (ch.codePointAt(0) >= 97 && ch.codePointAt(0) <= 122) || (ch.codePointAt(0) >= 48 && ch.codePointAt(0) <= 57) || ch.codePointAt(0) == o.mouseChar.codePointAt(0);
}

function gm_rain() {
	for(var col = 0; col < o.outputWidth; col++) {
		for(var row = o.outputHeight-3; row >= 0; row--) {
			if(isLetterOrDigit(o.contents[row][col])) {
				var offset = Math.floor(Math.random()*3);
				o.contents[row+offset][col] = o.contents[row][col];
				if(offset!=0) o.contents[row][col] = " "; 
			}
		}
	}
	blit();
}

function gm_gameOfLife() {
	var outputArray = new Array();
	for(var i = 0; i < o.outputHeight; i++) {
		outputArray.push(new Array());
		for(var j = 0; j < o.outputWidth; j++) {
			outputArray[i][j] = o.contents[i][j];
		}
	}
	
	for(var i = 0; i < o.outputHeight; i++) {
		for(var j = 0; j < o.outputWidth; j++) { 
			var neighbors = 0;
			if(i > 0 && j > 0 && isLetterOrDigit(o.contents[i-1][j-1])) neighbors++;
			if(i > 0 && isLetterOrDigit(o.contents[i-1][j])) neighbors++;
			if(i > 0 && j < o.outputWidth-1 && isLetterOrDigit(o.contents[i-1][j+1])) neighbors++;
			if(j > 0 && isLetterOrDigit(o.contents[i][j-1])) neighbors++;
			if(j < o.outputWidth-1 && isLetterOrDigit(o.contents[i][j+1])) neighbors++;
			if(i < o.outputHeight-1 && j > 0 && isLetterOrDigit(o.contents[i+1][j-1])) neighbors++;
			if(i < o.outputHeight-1 && isLetterOrDigit(o.contents[i+1][j])) neighbors++;
			if(i < o.outputHeight-1 && j < o.outputWidth-1 && isLetterOrDigit(o.contents[i+1][j+1])) neighbors++;
			
			if(isLetterOrDigit(o.contents[i][j]) && (neighbors < 2 || neighbors > 3)) {
				outputArray[i][j] = " ";
			}
			else if(!isLetterOrDigit(o.contents[i][j]) && (neighbors == 3)) {
				outputArray[i][j] = "X";
			}
			else {
				outputArray[i][j] = o.contents[i][j];
			}
		}
	}
	for(var i = 0; i < o.outputHeight; i++) {
		for(var j = 0; j < o.outputWidth; j++) {
			o.contents[i][j] = outputArray[i][j];
		}
	}
	blit();
}

function gm_plague() {
	for(var i = 0; i < o.outputHeight; i++) {
		for(var j = 0; j < o.outputWidth; j++) {
			if(isLetterOrDigit(o.contents[i][j])) {
				var spread = Math.floor(Math.random()*10);
				if(spread < 1) {
					if(i > 0) o.contents[i-1][j] = o.contents[i][j];
					if(i < o.outputHeight-1) o.contents[i+1][j] = o.contents[i][j];
					if(j > 0) o.contents[i][j-1] = o.contents[i][j];
					if(j < o.outputWidth-1) o.contents[i][j+1] = o.contents[i][j];
				}
			}
		}
	}
	blit();
}

function gm_snake() {
	if (!snake.playing) return;
	
	snake.headX += snake.velocityX;
	snake.headY += snake.velocityY;
	
	//lose condition
	if(snake.headX < 0 || snake.headY < 0 || snake.headX >= o.outputHeight || snake.headY >= o.outputWidth || o.contents[snake.headX][snake.headY] == o.mouseChar) {
		clearInterval(gm_snakeRep);
		setTimeout(gm_snakeClear,10);
		snake.playing = false;
		return;
	}
	
	//apple condition
	else if(isLetterOrDigit(o.contents[snake.headX][snake.headY])) {
		snake.tailLength += 5;
		
		//new apple
		snake.appleX = Math.floor(Math.random() * o.outputHeight);
		snake.appleY = Math.floor(Math.random() * o.outputWidth);
		
		var blip = new Audio("blip.mp3");
		blip.play();
	}
	
	//move snake
	snake.tail.push([snake.headX,snake.headY]);
	snake.velocityLock = false;
	while(snake.tail.length > snake.tailLength) {
		snake.tail.shift();
	}
	
	//draw
	clear();
	var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var appleChar = p.charAt(Math.floor(Math.random() * p.length));
	o.contents[snake.appleX][snake.appleY] = appleChar;
	for(var i = 0; i < snake.tail.length; i++) {
		o.contents[snake.tail[i][0]][snake.tail[i][1]] = o.mouseChar;
	}
	blit();
}

function gm_snakeClear() {
	clearInterval(gm_snakeRep);
	snake.tail = new Array();
	snake.tailLength = 10;
	snake.headX = 0;
	snake.headY = 0;
	snake.velocityX = 0;
	snake.velocityY = 1;
	snake.appleX = Math.floor(Math.random() * o.outputHeight);
	snake.appleY = Math.floor(Math.random() * o.outputWidth);
	o.commands.push("IGRA OKONCENA!");
	o.commands.push(">");
	clear();
	drawPage(0);
	drawConsole();
}

function gm_ray_loadMap() {
	r.miniMap = new Array();
	for(var row = 0; row < o.outputHeight; row++) {
		r.miniMap.push(new Array());
		for(var col = 0; col < o.outputWidth; col++) {
			r.miniMap[row][col] = o.contents[row][col];
		}
	}
	
	r.map = new Array();
	for(var row = 0; row < o.outputHeight; row++) {
		r.map.push(new Array());
		for(var col = 0; col < o.outputWidth; col++) {
			if(isLetterOrDigit(o.contents[row][col])) r.map[row][col] = o.contents[row][col];
			else r.map[row][col] = " ";
		}
	}
}

function gm_ray_rayCast() {
	// This script uses code from lodev.org's raycasting engine tutorial. Thanks for the help!
	// https://lodev.org/cgtutor/raycasting.html
	
	if(!r.playing) {
		gm_ray_loadMap();
		r.playing = true;
	}
	
	//movement code
	if(r.dw) {
		r.px = r.px + r.dirX * r.movementSpeed;
		r.py = r.py + r.dirY * r.movementSpeed;
	}
	if(r.ds) {
		r.px = r.px - r.dirX * r.movementSpeed;
		r.py = r.py - r.dirY * r.movementSpeed;
	}
	if(r.da) {
		var oldDirX = r.dirX;
		r.dirX = r.dirX * Math.cos(r.rotationSpeed) - r.dirY * Math.sin(r.rotationSpeed);
		r.dirY = oldDirX * Math.sin(r.rotationSpeed) + r.dirY * Math.cos(r.rotationSpeed);
		var oldPlaneX = r.planeX;
		r.planeX = r.planeX * Math.cos(r.rotationSpeed) - r.planeY * Math.sin(r.rotationSpeed);
		r.planeY = oldPlaneX * Math.sin(r.rotationSpeed) + r.planeY * Math.cos(r.rotationSpeed);
	}
	if(r.dd) {
		var oldDirX = r.dirX;
		r.dirX = r.dirX * Math.cos(-r.rotationSpeed) - r.dirY * Math.sin(-r.rotationSpeed);
		r.dirY = oldDirX * Math.sin(-r.rotationSpeed) + r.dirY * Math.cos(-r.rotationSpeed);
		var oldPlaneX = r.planeX;
		r.planeX = r.planeX * Math.cos(-r.rotationSpeed) - r.planeY * Math.sin(-r.rotationSpeed);
		r.planeY = oldPlaneX * Math.sin(-r.rotationSpeed) + r.planeY * Math.cos(-r.rotationSpeed);
	}
	
	//clears the screen / draws raycasting background
	for(var row = 0; row < o.outputHeight; row++) {
		for(var col = 0; col < o.outputWidth; col++) {
			o.contents[row][col] = " ";
		}
	}
	
	//iterate for each column of the display
	for(var i = 0; i < o.outputWidth; i++) {
		//raycasting camera setup code
		var screenXPercent = (2 * i) / o.outputWidth - 1;
		var currentRayX = r.px;
		var currentRayY = r.py;
		var directionRayX = r.dirX + r.planeX * screenXPercent;
		var directionRayY = r.dirY + r.planeY * screenXPercent;
		if (directionRayX == 0) directionRayX = 0.0001;
		if (directionRayY == 0) directionRayY = 0.0001;
		
		var mapX = Math.floor(currentRayX);
		var mapY = Math.floor(currentRayY);
		//find the distance between x and y deltas on the grid.
		var deltaDistX = Math.abs(1/directionRayX);
        var deltaDistY = Math.abs(1/directionRayY);
		
		//a variable to keep track of when a wall is hit, what direction
		var hit = false;
		var hitSide = 0;
		var hitChar = " ";
		
		//calculate steps and sidedistance
		var stepX = -1;
		var sideDistX = (currentRayX - mapX) * deltaDistX;
		var stepY = -1;
		var sideDistY = (currentRayY - mapY) * deltaDistY;
		
		if (directionRayX > 0) {
			stepX = 1;
			sideDistX = (mapX + 1.0 - currentRayX) * deltaDistX;
		}
		if (directionRayY > 0) {
			stepY = 1;
			sideDistY = (mapY + 1.0 - currentRayY) * deltaDistY;
		}

		//raycast over grid using the generated deltas
		while (!hit) {
			if (sideDistX < sideDistY) {
				sideDistX = sideDistX + deltaDistX;
				mapX = mapX + stepX;
				hitSide = 0;
			}
			else {
				sideDistY = sideDistY + deltaDistY;
				mapY = mapY + stepY;
				hitSide = 1;
			}

			//failsafe for rays leaving map boundaries
			if(mapX < 0 || mapY < 0 || mapX >= r.map.length || mapY >= r.map[0].length) {
				hit = true;
			}
			else if (isLetterOrDigit(r.map[mapX][mapY])) {
				hit = true;
				hitChar = r.map[mapX][mapY];
			}
		}
		
		//calculate wall height 0-100+ % of screen
		var wallHeight = 0;
		if (hitSide == 0) wallHeight = (mapX - currentRayX + (1 - stepX) / 2) / directionRayX;
		else wallHeight = (mapY - currentRayY + (1 - stepY) / 2) / directionRayY;
		
		var renderedWallHeight = Math.floor(o.outputHeight / wallHeight);
		
		//draw to output array
		var midpointHeight = Math.floor(o.outputHeight / 2);
		var startRow = Math.max(midpointHeight - Math.floor(renderedWallHeight/2),0);
		var stopRow = Math.min(midpointHeight + Math.floor(renderedWallHeight/2),o.outputHeight-1);
		for (var j = startRow; j <= stopRow; j++) {
			o.contents[j][i] = hitChar;
		}	
	}
	
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 17; j++) {
			if (r.px - 5 + i > 0 && r.px - 4 + i < r.map.length && r.py - 9 + j > 0 && r.py - 8 + j < r.map[0].length) 
				o.contents[i][j] = r.miniMap[Math.ceil(r.px - 5 + i)][Math.ceil(r.py - 9 + j)];
			else o.contents[i][j] = " ";
		}
	}
	for (var i = 0; i < 17; i++) {
		o.contents[9][i] = "─";
	}
	for (var i = 0; i < 9; i++) {
		o.contents[i][17] = "│";
	}
	o.contents[9][17] = "┘";
	o.contents[4][8] = o.mouseChar;
	
	//draw
	blit();
}