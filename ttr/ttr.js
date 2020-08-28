// HTML access variables
var main = document.getElementById("main");
var body = document.getElementById("body");
var textWrapper = document.getElementById("textWrapper");
var image = document.getElementById("img");

// JSON display variables
var script;
var scriptReq;
var maxLines = 43;
var textSpeedModifier = 1.0;
var lineTimer;

class Textel {
   constructor(char, link, color) {
      this.linkSet = true;
      this.colorSet = true;
      if(typeof link === 'undefined') this.linkSet = false;
      if(typeof color === 'undefined') this.colorSet = false;
      this.char = char;
      this.link = link;
      this.color = color;
   }
}

var lines = {
   strings : new Array(maxLines).fill(""),
   links : new Array(maxLines).fill(window.undefined),
   colors : new Array(maxLines).fill(window.undefined),

   push : function(line, link, color) {
      this.strings.push(line);
      this.strings.shift();
      this.links.push(link);
      this.links.shift();
      this.colors.push(color);
      this.colors.shift();
   }
}

var display = {
   outputWidth : 100,
   outputHeight : 45,
   contents : new Array(),
   mouseX : 0,
   mouseY : 0,
   mouseChar : '█',
   displayMouse : false,
   displayDebug : false,

   init : function() {
      this.contents = new Array();
      for(var i = 0; i < this.outputHeight; i++) {
   		this.contents.push(new Array(this.outputWidth));
   		for(var j = 0; j < this.outputWidth; j++) {
   			this.contents[i][j] = new Textel(' ');
   		}
   	}
   },

   blit : function() {
      var outputString = "";
      mouseUnderTextel = this.contents[this.mouseX][this.mouseY];
      if (this.displayMouse) this.contents[this.mouseX][this.mouseY] = new Textel(this.mouseChar);
      for(var i = 0; i < this.contents.length; i++) {
         for(var j = 0; j < this.contents[i].length; j++) {
            var char = this.contents[i][j].char;
            if(char == " " || char == ' ') outputString += "&nbsp;";
            else if (this.contents[i][j].colorSet) outputString += "<span style='color:" + this.contents[i][j].color + "'>" + char + "</span>";
            else outputString += char;
         }
         outputString += "<br/>";
      }
      main.innerHTML = outputString;
      this.contents[this.mouseX][this.mouseY] = mouseUnderTextel;
   },

   drawBox : function(row, col, height, width, link, color) {
      for (var i = row + 1; i < row + height; i++) {
         this.contents[i][col] = new Textel('│', link, color);
         this.contents[i][col+width] = new Textel('│', link, color);
      }
      for (var i = col + 1; i < col + width; i++) {
         this.contents[row][i] = new Textel('─', link, color);
         this.contents[row+height][i] = new Textel('─', link, color);
      }
      this.contents[row][col] = new Textel('┌', link, color);
      this.contents[row+height][col] = new Textel('└', link, color);
      this.contents[row][col+width] = new Textel('┐', link, color);
      this.contents[row+height][col+width] = new Textel('┘', link, color);
   },

   drawText : function(row, col, text, link, color) {
      for (var i = 0; i < text.length && (col + i) < this.outputWidth; i++) {
         this.contents[row][col+i] = new Textel(text.charAt(i), link, color);
      }
   },

   drawFill : function(row, col, height, width, char, link, color) {
      for (var i = 0; i < height; i++) {
         for (var j = 0; j < width; j++) {
            this.contents[row+i][col+j] = new Textel(char, link, color)
         }
      }
   },

   masterColors : function(foreground, background) {
      body.style = `color:${foreground}; background-color:${background}`;
   },

   isTouchDevice : function() {
      return !!('ontouchstart' in window || navigator.maxTouchPoints);
   },

   enableMouse : function() {
      this.displayMouse = true;
   }
}

function openWindowAnimation(row, col, height, width, title, frame, endFunction, innerText, innerLink, innerColor) {
   if (frame <= Math.floor(width/2)) {
      display.drawBox(row + Math.floor(height / 2), col + Math.floor(width / 2) - frame, 1, Math.min(2 * frame, width - 1), innerLink, innerColor);
      setTimeout(openWindowAnimation, 10, row, col, height, width, title, frame + 1, endFunction, innerText, innerLink, innerColor);
   }
   else if (frame - Math.floor(width/2) <= Math.floor(height/2)) {
      var effectiveFrame = frame - Math.floor(width/2);
      display.drawBox(row + Math.floor(height/2) - effectiveFrame, col, Math.min(effectiveFrame * 2, height - 1), width - 1, innerLink, innerColor);
      var clearUpper = row + Math.floor(height/2) - effectiveFrame + 1;
      display.drawFill(clearUpper, col+1, 1, width-2, " ");

      var clearLower = row + Math.floor(height/2) + effectiveFrame - 1;
      if (clearLower != row + height - 1) display.drawFill(clearLower, col+1, 1, width-2, " ");
      setTimeout(openWindowAnimation, 25, row, col, height, width, title, frame + 1, endFunction, innerText, innerLink, innerColor);
   }
   else if (frame - Math.floor(width/2) - Math.floor(height/2) < 7) {
      var effectiveFrame = frame - Math.floor(width/2) - Math.floor(height/2);
      if (effectiveFrame % 2 == 0) display.drawText(row, col + Math.floor(width/2) - Math.floor(title.length / 2), title, "../index.html");
      else display.drawFill(row, col + Math.floor(width/2) - Math.floor(title.length / 2), 1, title.length, '─');
      setTimeout(openWindowAnimation, 50, row, col, height, width, title, frame + 1, endFunction, innerText, innerLink, innerColor);
   } else {
      if (typeof innerText !== 'undefined') display.drawText(row+1, col+1, innerText, innerLink, innerColor);
      if (typeof endFunction !== 'undefined') endFunction();
   }

   display.blit();
}

function loadAssets(frame) {
   if (typeof frame === 'undefined') frame = 0;
   if (frame == 0) {
      scriptReq = new XMLHttpRequest();
      scriptReq.responseType = "text";
      scriptReq.addEventListener("load", scriptReqListener);
      scriptReq.open("GET", "script.json");
      scriptReq.send(null);

      display.drawText(1,display.outputWidth-9,"█",window.undefined,"gray");
      display.drawText(1,display.outputWidth-8,"█",window.undefined,"red");
      display.drawText(1,display.outputWidth-7,"█",window.undefined,"orange");
      display.drawText(1,display.outputWidth-6,"█",window.undefined,"yellow");
      display.drawText(1,display.outputWidth-5,"█",window.undefined,"green");
      display.drawText(1,display.outputWidth-4,"█",window.undefined,"blue");
      display.drawText(1,display.outputWidth-3,"█",window.undefined,"purple");
      display.drawText(1,display.outputWidth-2,"█",window.undefined,"white");
   }
   if (frame >= 8 && typeof script !== 'undefined') {
      document.onkeydown = preventBackspaceHandler;
      document.addEventListener("mousemove",mouseMove);
      document.addEventListener("mousedown",mouseDown);
      document.addEventListener("mouseup",mouseUp);
      if (display.isTouchDevice()) {
         openWindowAnimation(display.outputHeight-4,1,3,52,"",0,window.undefined,"Touch device detected. Click to enable mouse input",-1,"gray")
      }
      else {
         display.displayMouse = true;
      }
      display.drawFill(1, 1, display.outputHeight-2, display.outputWidth-2," ");
      display.contents[display.outputHeight-2][display.outputWidth-2].link = -2;
      display.contents[display.outputHeight-2][display.outputWidth-2].linkSet = true;
      parseSection(0);
   }
   else if (frame % 4 == 0) {
      display.drawText(1,1,"Loading assets |");
      setTimeout(loadAssets, 50, frame + 1);
   }
   else if (frame % 4 == 1) {
      display.drawText(1,1,"Loading assets /")
      setTimeout(loadAssets, 50, frame + 1);
   }
   else if (frame % 4 == 2) {
      display.drawText(1,1,"Loading assets ─")
      setTimeout(loadAssets, 50, frame + 1);
   }
   else if (frame % 4 == 3) {
      display.drawText(1,1,"Loading assets \\")
      setTimeout(loadAssets, 50, frame + 1);
   }
   display.blit();
}

function scriptReqListener () {
	script = JSON.parse(this.responseText);
}

function displayLines(){
   display.drawFill(1, 1, display.outputHeight-2, display.outputWidth-2," ");
   for(var i = 0; i < maxLines; i++) {
      display.drawText(i + 1, 1, lines.strings[i], lines.links[i], lines.colors[i]);
   }
   display.blit();
}

function parseSection(section, currentLineIndex) {
   if (typeof currentLineIndex === 'undefined') currentLineIndex = 0;
   type = script[section][currentLineIndex][0];
   text = script[section][currentLineIndex][1];
   link = script[section][currentLineIndex][2];
   color = script[section][currentLineIndex][3];
   delay = script[section][currentLineIndex][4];
   if (link == null) link = window.undefined;
   if (color == null) color = window.undefined;

   if (display.displayDebug) {
      display.drawText(0,1,"──────────────────")
      display.drawText(0,1,section + "," + currentLineIndex + "," + Math.floor(delay * (1/textSpeedModifier)));
   }
   if (type == 0) {
      if(text.length > display.outputWidth-2) {
         newText = "";
         var i = display.outputWidth - 2;
         while (text.charAt(i) != ' ' && i >= 0) i--;
         if (i != 0) {
            newText = "    " + text.substring(i+1);
            text = text.substring(0,i);
            var newLine = [0, newText, link, color, delay];
            script[section].splice(currentLineIndex+1,0,newLine);
            delay = 0;
         }
      }
      lines.push(text, link, color);
      displayLines();
   }
   else if (type == 1) {
      row = script[section][currentLineIndex][5];
      col = script[section][currentLineIndex][6];
      display.drawText(row, col, text, link, color);
      display.blit();
   }
   else if (type == 2) {
      row = script[section][currentLineIndex][5];
      col = script[section][currentLineIndex][6];
      openWindowAnimation(row, col, 3, text.length+2, "", 0, window.undefined, text, link, color);
   }
   else if (type == 3) {
      parseLink(link);
   }

   if (delay != null) lineTimer = setTimeout(parseSection, Math.floor(delay * (1/textSpeedModifier)), section, currentLineIndex + 1);
}

function mouseMove(evt) {
   display.mouseY = Math.min(Math.max(Math.floor((evt.clientX - textWrapper.offsetLeft) / main.clientWidth * display.outputWidth),0),display.outputWidth-1);
   display.mouseX = Math.min(Math.max(Math.floor((evt.clientY - textWrapper.offsetTop) / main.clientHeight * display.outputHeight),0),display.outputHeight-1);
   display.blit();
}

function preventBackspaceHandler(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 8) {
        return false;
    }
}

function mouseDown(evt) {
   if (display.contents[display.mouseX][display.mouseY].linkSet) display.masterColors("gray", "black");
}

function mouseUp(evt) {
   display.masterColors("white", "black");
   parseLink();
}

function parseLink(link) {
   if (typeof link === 'undefined') link = display.contents[display.mouseX][display.mouseY].link;
   if(isNaN(link)) {
		window.open(link,"_self");
	}
   else if (link < 0) {
      if (link == -1) display.displayMouse = true;
      else if (link == -2) display.displayDebug = true;
      else if (-7 <= link && link <= -3) {
         display.drawText(5,14,"0.50",-3,"gray");
         display.drawText(5,20,"0.75",-4,"gray");
         display.drawText(5,26,"1.00",-5,"gray");
         display.drawText(5,32,"1.50",-6,"gray");
         display.drawText(5,38,"2.00",-7,"gray");
         if (link == -3) {
            textSpeedModifier = 0.5;
            display.drawText(5,14,"0.50",-3,"lime");
         }
         else if (link == -4) {
            textSpeedModifier = 0.75;
            display.drawText(5,20,"0.75",-4,"lime");
         }
         else if (link == -5) {
            textSpeedModifier = 1;
            display.drawText(5,26,"1.00",-5,"lime");
         }
         else if (link == -6) {
            textSpeedModifier = 1.5;
            display.drawText(5,32,"1.50",-6,"lime");
         }
         else if (link == -7) {
            textSpeedModifier = 2;
            display.drawText(5,38,"2.00",-7,"lime");
         }
         display.drawFill(7,1,display.outputHeight-8,display.outputWidth-2," ");
         clearTimeout(lineTimer);
         parseSection(0,8);
      }
      else if (link == -8) {
         clearTimeout(lineTimer);
      }
   }
   else {
      parseSection(link);
   }
}

display.init();
openWindowAnimation(0,0,display.outputHeight, display.outputWidth, "Transpired the Ruins", 0, loadAssets);
