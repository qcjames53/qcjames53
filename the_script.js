var main = document.getElementById("main");
var body = document.getElementById("body");
var parent = document.getElementById("parent");

var o = {
	outputWidth : 100,
	outputHeight : 45,
	contents : new Array(),
	clickBoxes : new Array(),
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
pagesReq.open("GET", "new_pages.json");
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
	blit();
}

function draw(input, row, col, maxwidth) {
	col++;
	row++;
	maxwidth -= 2;

	var words = input.split(" ");
	var initCol = col;
	var initRow = row;
	for(var i = 0; i < words.length; i++) {
		if(col - initCol + words[i].length > maxwidth || words[i]=="~n") {
			while(col - initCol <= maxwidth) {
				o.contents[row][col] = " ";
				col++;
			}
			
			col = initCol;
			row++;
			
		}
		else if(col != initCol && i < words.length) {
			o.contents[row][col] = " ";
			col++;
		}
		
		if(words[i] != "~n") {
			for(var j = 0; j < words[i].length; j++) {
				o.contents[row][col] = words[i].charAt(j);
				col++;
			}
		}
	}
	while(col - initCol <= maxwidth) {
		o.contents[row][col] = " ";
		col++;
	}
	
	var ir = initRow-1, ic = initCol-1, fr = row+1, fc = initCol+maxwidth+1;
	for(var i = ir; i < fr; i++) {o.contents[i][ic] = '│'; o.contents[i][fc] = '│';}
	for(var i = ic; i < fc; i++) {o.contents[ir][i] = '─'; o.contents[fr][i] = '─';}
	o.contents[ir][ic] = "┌";
	o.contents[ir][fc] = "┐";
	o.contents[fr][ic] = "└";
	o.contents[fr][fc] = "┘";
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

function colors(foreground, background) {
	body.style = `color:${foreground}; background-color:${background}`;
}

function drawMenu() {
	clear();
	
	var menuString1 = "";
	var menuString2 = "";
	var menuString3 = "";
	for(var i = 0; i < pages.length; i++) {
		if(i % 3 == 0) {
			menuString1 += pages[i].title;
			if(i < pages.length-3) menuString1 += " ~n ";
		}
		else if(i % 3 == 1) {
			menuString2 += pages[i].title;
			if(i < pages.length-2) menuString2 += " ~n ";
		}
		else {
			menuString3 += pages[i].title;
			if(i < pages.length-1) menuString3 += " ~n ";
		}
	}
	
	
	draw(menuString1,1,1,31);
	draw(menuString2,1,34,31);
	draw(menuString3,1,67,31);
}

function drawPage(pageIndex) {	
	if(pageIndex > pages.length) return "Outside of page index";
	
	clear();
	
	if(pageIndex == 0) {
		drawMenu();
		return;
	}
	
	pageIndex--;
	draw(pages[pageIndex].title,4,2,60);
	draw(pages[pageIndex].contents,8,2,60);
	
	for(var i = 0; i < pages[pageIndex].links.length; i+=2) {
		draw(pages[pageIndex].links[i],3*(i/2)+8,67,30)
	}
}

function mouseMove(evt) {
	o.mouseY = Math.min(Math.max(Math.floor((evt.clientX - parent.offsetLeft) / main.clientWidth * o.outputWidth),0),o.outputWidth-1);
	o.mouseX = Math.min(Math.max(Math.floor((evt.clientY - parent.offsetTop) / main.clientHeight * o.outputHeight),0),o.outputHeight-1);
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

}	

function mouseUp(evt) {

}

function blit() {
	var outputString = "";
	for(var i = 0; i < o.contents.length; i++) {
		for(var j = 0; j < o.contents[i].length; j++) {
			var temp = o.contents[i][j];
			if(temp == " " || temp == ' ') outputString += "&nbsp;";
			else outputString += o.contents[i][j].charAt(0);
		}
		outputString += "<br/>";
	}
	main.innerHTML = outputString;
}