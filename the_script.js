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
	currentPage : 0
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
	document.addEventListener("mousemove",mouseMove);
	document.addEventListener("mousedown",mouseDown);
	document.addEventListener("mouseup",mouseUp);
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
	for(var i = ir; i < fr; i++) {o.contents[i][ic] = "│" + link; o.contents[i][fc] = "│" + link;}
	for(var i = ic; i < fc; i++) {o.contents[ir][i] = "─" + link; o.contents[fr][i] = "─" + link;}
	o.contents[ir][ic] = "┌" + link;
	o.contents[ir][fc] = "┐" + link;
	o.contents[fr][ic] = "└" + link;
	o.contents[fr][fc] = "┘" + link;
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
	
	var row = 4;
	var col = 2;
	
	for(var i = 0; i < pages.length; i++) {
		draw(pages[i].title, row, col, 31, i+1);
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
		draw(pages[pageIndex].title,4,2,60);
		draw(pages[pageIndex].contents,8,2,60);
		
		for(var i = 0; i < pages[pageIndex].links.length; i+=2) {
			draw(pages[pageIndex].links[i],3*(i/2)+8,67,30,pages[pageIndex].links[i+1])
		}
		
		setImage(pages[pageIndex].img);
	}
	
	o.mouseUnderChar = o.contents[o.mouseX][o.mouseY];
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
		colors("gray;");
	}
}	

function mouseUp(evt) {
	colors("black;");
	if(o.mouseUnderChar.substring(2) != "") parseLink(o.mouseUnderChar.substring(2));
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
	//$("#img").fadeTo(500, 0.4);
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