//    ████████╗████████╗██████╗ 
//    ╚══██╔══╝╚══██╔══╝██╔══██╗
//       ██║      ██║   ██████╔╝
//       ██║      ██║   ██╔══██╗
//       ██║      ██║   ██║  ██║
//       ╚═╝      ╚═╝   ╚═╝  ╚═╝   CHARACTER ENGINE
//    version 4.0                          
//    by Quinn James
//
//    This project is libre, and licenced under the terms of the
//    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENCE, version 3.1,
//    as published by dtf on July 2019. See the COPYING file or
//    https://ph.dtf.wtf/w/wtfpl/#version-3-1 for more details.

// CONTENTS
var contents = ["homepage_contents.json"]; //TODO: integrate into asset loading

// HTML access variables
var main = document.getElementById("main");
var body = document.getElementById("body");
var textWrapper = document.getElementById("textWrapper");
var image = document.getElementById("img");

// JSON display variables
var layout;
var layoutReq;
var maxLines = 43;
var textSpeedModifier = 1.0;
var lineTimer;

/**
 * Class which composes the character-based output. Displays one character of a
 * certain color. Optional link allows for functions and hyperlinks to be run
 * when clicked / activated.
 */
class Textel {
   /**
    * Constructor for the Textel class.
    * @param {char} char Single character displayed to user.
    * @param {string} link String/function variable for parser to interpret when 
    *    Textel is clicked.
    * @param {string} color Output color string (HTML formatted) of character. 
    * Keep undefined for best performance and to allow for page color overrides.
    */
   constructor(char, link, color) {
      this.linkSet = true;
      this.colorSet = true;
      // depends on short circuiting to avoid error, be careful)
      if(typeof link === 'undefined' || link == null) this.linkSet = false;
      if(typeof color === 'undefined'|| color == null) this.colorSet = false;
      this.char = char;
      this.link = link;
      this.color = color;
   }
}

/**
 * Object that stores on-screen lines for scrolling line-by-line text display.
 */
var lines = {
   strings : new Array(maxLines).fill(""),
   links : new Array(maxLines).fill(null),
   colors : new Array(maxLines).fill(null),

   /**
    * Pushes a given string into memory. Removes oldest item from storage array.
    * @param {string} line String to push into storage.
    * @param {string} link Optional: link for given string.
    * @param {string} color Optional: color for given string.
    */
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

   /**
    * Initializes the display object. Must be run before any display functions 
    * are called. Fills 'contents' variable with spaces.
    */
   init : function() {
      this.contents = new Array();
      for(var i = 0; i < this.outputHeight; i++) {
   		this.contents.push(new Array(this.outputWidth));
   		for(var j = 0; j < this.outputWidth; j++) {
   			this.contents[i][j] = new Textel(' ');
   		}
   	}
   },

   /**
    * Draws the current contents of this.contents to the html textWrapper. No 
    * matter the changes to this.contents, output display will only update when 
    * this function is called.
    */
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

   /**
    * Draws a box using ASCII line characters.
    * @param {number} row Upper left row coordinate.
    * @param {number} col Upper left column coordinate.
    * @param {number} height Height of box.
    * @param {number} width Width of box.
    * @param {string} link Optional: link for edge line characters, good for 
    *    buttons.
    * @param {string} color Optional: color of line characters.
    */
   drawBox : function(row, col, height, width, link, color) {
      for (var i = row + 1; i < row + height; i++) {
         this.contents[i][col] = new Textel('│', link, color);
         this.contents[i][col + width] = new Textel('│', link, color);
      }
      for (var i = col + 1; i < col + width; i++) {
         this.contents[row][i] = new Textel('─', link, color);
         this.contents[row+height][i] = new Textel('─', link, color);
      }
      this.contents[row][col] = new Textel('┌', link, color);
      this.contents[row + height][col] = new Textel('└', link, color);
      this.contents[row][col + width] = new Textel('┐', link, color);
      this.contents[row + height][col + width] = new Textel('┘', link, color);
   },

   /**
    * Draws text string at given coordinates.
    * @param {number} row First character for coordinate.
    * @param {number} col First character column coordinate.
    * @param {string} text String to display.
    * @param {string} link Optional: link for all characters.
    * @param {string} color Optional: color of characters.
    */
   drawText : function(row, col, text, link, color) {
      for (var i = 0; i < text.length && (col + i) < this.outputWidth; i++) {
         this.contents[row][col + i] = new Textel(text.charAt(i), link, color);
      }
   },

   /**
    * Fills an area with a given character at given coodinates.
    * @param {number} row Upper left row coordinate.
    * @param {number} col Upper left column coordinate.
    * @param {number} height Height to fill with character.
    * @param {number} width Width to fill with character.
    * @param {char} char Fill character.
    * @param {string} link Optional: Link for filled area.
    * @param {string} color Optional: Color for filled area.
    */
   drawFill : function(row, col, height, width, char, link, color) {
      for (var i = 0; i < height; i++) {
         for (var j = 0; j < width; j++) {
            this.contents[row + i][col + j] = new Textel(char, link, color)
         }
      }
   },

   /**
    * Changes color of the display.
    * @param {string} foreground Changes color of all characters with undefined 
    * or null color values.
    * @param {string} background Changes color of the page background color.
    */
   masterColors : function(foreground, background) {
      body.style = `color:${foreground}; background-color:${background}`;
   },

   /**
    * Returns true if the current device supports touch input.
    */
   isTouchDevice : function() {
      return !!('ontouchstart' in window || navigator.maxTouchPoints);
   }
}

/**
 * Opens a window (box with text inside and title on top) defined by the given
 * parameters.
 * @param {number} frame Current frame of animation, call as 0 for full
 * animation.
 * @param {number} row Upper left of window row coordinate.
 * @param {number} col Upper left of window column coordinate.
 * @param {number} height Total height of window (includes box characters).
 * @param {number} width Total width of window (includes box characters).
 * @param {string} innerText Optional: Text to display inside of the window.
 * @param {string} innerLink Optional: Link for window contents and border.
 * @param {string} innerColor Optional: Color for window contents and border.
 * @param {string} title Optional: Title of window (set to empty string for no
 * title)
 * @param {Function} endFunction Optional: Function to run once window open
 * animation has finished.
 * @param {*} endFunctionParam1 Optional: parameter for endFunction().
 */
function openWindowAnimation(frame, row, col, height, width, innerText, innerLink, innerColor, title, endFunction, endFunctionParam1) {
   frameLink = null;
   titleLink = null;
   if (typeof title !== 'undefined' && title != null) {
      titleLink = innerLink;
   }
   else {
      frameLink = innerLink;
   }
   if (frame <= Math.floor(width/2)) {
      display.drawBox(row + Math.floor(height / 2), col + Math.floor(width / 2) - frame, 1, Math.min(2 * frame, width - 1), frameLink, innerColor);
      setTimeout(openWindowAnimation, 10, frame+1, row, col, height, width, innerText, innerLink, innerColor, title, endFunction, endFunctionParam1);
   }
   else if (frame - Math.floor(width/2) <= Math.floor(height/2)) {
      var effectiveFrame = frame - Math.floor(width/2);
      display.drawBox(row + Math.floor(height/2) - effectiveFrame, col, Math.min(effectiveFrame * 2, height - 1), width - 1, frameLink, innerColor);
      var clearUpper = row + Math.floor(height/2) - effectiveFrame + 1;
      display.drawFill(clearUpper, col+1, 1, width-2, " ");

      var clearLower = row + Math.floor(height/2) + effectiveFrame - 1;
      if (clearLower != row + height - 1) display.drawFill(clearLower, col+1, 1, width-2, " ");
      setTimeout(openWindowAnimation, 25, frame+1, row, col, height, width, innerText, innerLink, innerColor, title, endFunction, endFunctionParam1);
   }
   else if (frame - Math.floor(width/2) - Math.floor(height/2) < 7) {
      var effectiveFrame = frame - Math.floor(width/2) - Math.floor(height/2);
      if (typeof title !== 'undefined' && title != null) {
         if (effectiveFrame % 2 == 0) {
            display.drawText(row, col + Math.floor(width/2) - Math.floor(title.length / 2), title, titleLink, innerColor);
         }
         else {
            display.drawFill(row, col + Math.floor(width/2) - Math.floor(title.length / 2), 1, title.length, '─');
         }
         
      }
      setTimeout(openWindowAnimation, 50, frame+1, row, col, height, width, innerText, innerLink, innerColor, title, endFunction, endFunctionParam1);
   } else {
      if (typeof innerText !== 'undefined' && innerText != null) {
         display.drawText(row+1, col+1, innerText, frameLink, innerColor);
      }
      if (typeof endFunction !== 'undefined' && endFunction != null) {
         if (typeof endFunctionParam1 !== 'undefined' && endFunctionParam1 != null) {
            endFunction(endFunctionParam1);
         }
         else {
            endFunction();
         }
      }
   }

   display.blit();
}

function loadAssets(frame) {
   if (frame == 0) {
      layoutReq = new XMLHttpRequest();
      layoutReq.responseType = "text";
      layoutReq.addEventListener("load", layoutReqListener);
      layoutReq.open("GET", "homepage_contents.json");
      layoutReq.send(null);

      display.drawText(1,display.outputWidth-9,"█",null,"gray");
      display.drawText(1,display.outputWidth-8,"█",null,"red");
      display.drawText(1,display.outputWidth-7,"█",null,"orange");
      display.drawText(1,display.outputWidth-6,"█",null,"yellow");
      display.drawText(1,display.outputWidth-5,"█",null,"green");
      display.drawText(1,display.outputWidth-4,"█",null,"blue");
      display.drawText(1,display.outputWidth-3,"█",null,"purple");
      display.drawText(1,display.outputWidth-2,"█",null,"white");
   }
   if (frame >= 8 && typeof layout !== 'undefined') {
      document.onkeydown = preventBackspaceHandler;
      document.addEventListener("mousemove",mouseMove);
      document.addEventListener("mousedown",mouseDown);
      document.addEventListener("mouseup",mouseUp);
      if (display.isTouchDevice()) {
         openWindowAnimation(0, display.outputHeight-4, 1, 3, 52, "Touch device detected. Click to enable mouse input", -1, "gray");
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

function layoutReqListener () {
	layout = JSON.parse(this.responseText);
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
   type = layout[section][currentLineIndex][0];
   delay = layout[section][currentLineIndex][1];
   text = layout[section][currentLineIndex][2];
   link = layout[section][currentLineIndex][3];
   color = layout[section][currentLineIndex][4];
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
            layout[section].splice(currentLineIndex+1,0,newLine);
            delay = 0;
         }
      }
      lines.push(text, link, color);
      displayLines();
   }
   else if (type == 1) {
      row = layout[section][currentLineIndex][5];
      col = layout[section][currentLineIndex][6];
      display.drawText(row, col, text, link, color);
      display.blit();
   }
   else if (type == 2) {
      row = layout[section][currentLineIndex][5];
      col = layout[section][currentLineIndex][6];
      openWindowAnimation(0, row, col, 3, text.length+2, text, link, color);
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

// TODO: migrate links and functions to arrays with parameters.
function parseLink(link) {
   if (link === "reset") {
      clearTimeout(lineTimer);
      parseSection(0, 0);
   }
}

display.init();
openWindowAnimation(0, 0, 0, display.outputHeight, display.outputWidth, null, "reset", null, "Quinn James Online", loadAssets, 0);
