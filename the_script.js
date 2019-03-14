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
	mouseUnderChar: '-',
	currentPage : 0,
	commandIndex : 0,
	commands : new Array(),
	maxCommandLength : 90
}

var pages;

var pagesReq = new XMLHttpRequest();
pagesReq.addEventListener("load", pagesReqListener);
pagesReq.open("GET", "pages.json");
pagesReq.send(null);

function pagesReqListener () {
	pages = JSON.parse(this.responseText);
	init();
}

function init() {
	for(var i = 0; i < o.outputHeight; i++) {
		o.contents.push(new Array(o.outputWidth));
		for(var j = 0; j < o.outputWidth; j++) {
			o.contents[i][j] = '-';
		}
	}
	o.commands.push("");
	document.onkeydown = preventBackspaceHandler;
	document.addEventListener("mousemove",mouseMove);
	document.addEventListener("mousedown",mouseDown);
	document.addEventListener("mouseup",mouseUp);
	document.addEventListener("keydown", keyDown);
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
			o.contents[i][j] = '-';
		}
	}
}

function colors(foreground) {
	body.style = `color:${foreground};`;
}

function drawMenu() {
	clear();
	
	draw("QUINN JAMES ONLINE",0,2,19);
	draw("Use the mouse to navigate",0,23,26);
	draw("Use the keyboard to hack",0,51,26);
	
	var row = 4;
	var col = 2;
	
	for(var i = 0; i < pages.length; i++) {
		if(pages[i].contents.length > 0) draw(pages[i].title, row, col, 31, i+1);
		else draw(pages[i].title, row, col, 31, pages[i].links[0]);
		row += 3;
		if(row > o.outputHeight-1) {
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
	}
	else {
		pageIndex--;
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
	draw(""+o.commands[o.commandIndex],42,0,99);
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
		colors("gray");
	}
}	

function mouseUp(evt) {
	colors("black");
	if(o.mouseUnderChar.substring(2) != "") parseLink(o.mouseUnderChar.substring(2));
}

function keyDown(evt) {
	if(evt.keyCode == 8 && o.commands[o.commandIndex].length > 0) {
		o.commands[o.commandIndex] = o.commands[o.commandIndex].substring(0,o.commands[o.commandIndex].length-1);
		drawConsole();
	}
	else if(evt.keyCode == 13 && o.commands[o.commandIndex].length > 0) {
		parseCommand(o.commands[o.commandIndex]);
		o.commands.push("");
		o.commandIndex++;
		var blip = new Audio("blip.mp3");
		blip.play();
	}
	else if(((evt.keyCode >= 48 && evt.keyCode <= 90) || (evt.keyCode >= 96 && evt.keyCode <= 105)) && o.commands[o.commandIndex].length < o.maxCommandLength) {
		o.commands[o.commandIndex] += String.fromCharCode(evt.keyCode);
	}
	else if(evt.keyCode == 32 && o.commands[o.commandIndex].length < o.maxCommandLength) {
		o.commands[o.commandIndex] += " ";
	}
	else if((evt.keyCode == 173 || evt.keyCode == 189) && o.commands[o.commandIndex].length < o.maxCommandLength) {
		o.commands[o.commandIndex] += "-";
	}
	else if(evt.keyCode == 190 && o.commands[o.commandIndex].length < o.maxCommandLength) {
		o.commands[o.commandIndex] += ".";
	}
	
	if(o.commands[o.commandIndex].length == o.maxCommandLength) {
		var blip = new Audio("blip.mp3");
		blip.play();
	}
	
	if(o.commands[o.commandIndex].length > 0) {
		drawConsole();
		o.contents[43][1+o.commands[o.commandIndex].length] = o.mouseChar;
		blit();
	}
}

function preventBackspaceHandler(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 8) {
        return false;
    }
}

function parseLink(string) {
	if(!isNaN(string)) drawPage(parseInt(string));
	else window.open(string,"_self");
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
	draw("Operation result:",5,2,95,0);
	
	switch (command) {
		case "APT":
		case "APT-GET":
		case "PACMAN":
		case "INSTALL":
			draw("Repository list could not be read. Please reinstall your package manager.",8,2,95,0);
			break;
		case "CD":
			draw("No disk inserted. Please insert a disk and try again.",8,2,95,0);
			break;
		case "CMD":
			draw("CMD is no longer supported. Try 'POWERSHELL' instead.",8,2,95,0);
			break;
		case "CONTROL-PANEL":
			draw("CONTROL-PANEL is legacy. Use 'SETTINGS' instead.",8,2,95,0);
			break;
		case "EMACS":
			draw("Loading...",8,2,95,0);
			break;
		case "FOOD":
		case "MEME":
		case "MCDONALDS":
		case "WENDYS":
		case "TACO":
		case "BURGER":
		case "HOTDOG":
			draw(command+" machine 🅱roke",8,2,95,0);
			break;
		case "HELLO":
			draw("Hi.",8,2,95,0);
			break;
		case "HELP":
			draw("'HELP' is depreciated. Please use 'HALP' instead.",8,2,95,0);
			break;
		case "HI":
			draw("Hello.",8,2,95,0);
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
			draw("It's a unix system. I know this. ~n ~n [Eagle Mode]",8,2,95,"http://eaglemode.sourceforge.net/");
			break;
		case "LS":
			draw("Error at /usr/share/Adobe/doc/example/amdroid_vm/root/sbin/ls.jar: Device is not responding. Try 'LSD' instead.",8,2,95,0);
			break;
		case "OPEN":
			draw("I'm sorry Dave. I'm afraid I can't do that.",8,2,95,0);
			break;
		case "POWERSHELL":
			draw("POWERSHELL is for 32 bit systems. Please run 'POWERSHELL-X64",8,2,95,0);
			break;
		case "POWERSHELL-X64":
			draw("Due to security concerns, POWERSHELL-X64 can no longer modify system settings. Use 'CONTROL-PANEL' instead.",8,2,95,0);
			break;
		case "QUICK-ACCESS":
			draw("QUICK-ACCESS requires specialized hardware. Try 'STORE' for general installations.",8,2,95,0);
			break;
		case "RAIN":
			setInterval(gm_rain, 100);
		case "ROBLOX":
			draw("Oof.",8,2,95,0);
			break;
		case "SETTINGS":
			draw("SETTINGS is depreciated. Please use 'QUICK-ACCESS' instead.",8,2,95,0);
			break;
		case "SOFTWARE-INSTALL-WISARD":
			draw("'SOFTWARE-INSTALL-WISARD' is no longer supported. Try 'CMD' for program installs.",8,2,95,0);
			break;
		case "STORE":
			draw("STORE is offline. For legacy software, use 'SOFTWARE-INSTALL-WISARD'.",8,2,95,0);
			break;
		case "SUDO":
			draw("No.",8,2,95,0);
			break;
		case "VI":
		case "VIM":
			draw("Due to GNU GPL issues, vim can no longer be offered for web users.",8,2,95,0);
			break;
		case "XKCD":
			parseLink("https://uni.xkcd.com/");
			break;
		case "":
			draw("Welcome to NULL island. Current population: NaN.",8,2,95,0);
			break;
		default:
			draw("'"+command+"' is not recognized as a valid command",8,2,95,0);
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
