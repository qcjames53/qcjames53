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

// DEV TOGGLES
const enableDebug = false;

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
var previousSection = null;
var previousLineIndex = null;

/**
 * Class which composes the character-based output. Displays one character of a
 * certain color. Optional link allows for functions and hyperlinks to be run
 * when clicked / activated.
 */
class Textel {
   /**
    * Constructor for the Textel class.
    * @param {string} char Single character displayed to user.
    * @param {object} link String/function variable for parser to interpret when
    * Textel is clicked.
    * @param {string} color Output color string (HTML formatted) of character.
    * Keep undefined for best performance and to allow for page color overrides.
    */
   constructor(char, link, color) {
      this.linkSet = true;
      this.colorSet = true;
      // depends on short circuiting to avoid error, be careful.
      if(typeof link === 'undefined' || link == null) this.linkSet = false;
      if(typeof color === 'undefined'|| color == null) this.colorSet = false;
      this.char = char;
      this.link = [].concat(link);
      this.color = color;
   }
}

/**
 * Object that stores an unlimited amount of lines. Displayed from top down,
 * showing maximum number of newest lines.
 */
var topfeedLines = {
   strings : new Array(),
   links : new Array(),
   colors : new Array(),

   /**
    * Pushes a given line into memory.
    */
   push : function(line, link, color) {
      this.strings.push(line);
      this.links.push(link);
      this.colors.push(color);
   },

   reset : function() {
      this.strings = new Array();
      this.links = new Array();
      this.colors = new Array();
   }
};

/**
 * Object that stores a screen-width number of lines. Displayed from bottom up.
 */
var bottomfeedLines = {
   strings : new Array(maxLines).fill(""),
   links : new Array(maxLines).fill(null),
   colors : new Array(maxLines).fill(null),

   /**
    * Pushes a given line into memory. Removes oldest item from storage array.
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
   },

   reset : function() {
      this.strings = new Array(maxLines).fill("");
      this.links = new Array(maxLines).fill(null);
      this.colors = new Array(maxLines).fill(null);
   }
};

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
            this.contents[row + i][col + j] = new Textel(char, link, color);
         }
      }
   },

   /**
    * Easy function for filling screen contents with spaces.
    */
   clear : function() {
      for (var i = 0; i < this.outputHeight; i++) {
         for (var j = 0; j < this.outputWidth; j++) {
            this.contents[i][j] = new Textel(" ", null, null);
         }
      }
   },

   /**
    * Easy function for filling screen contents with spaces. Leaves edge
    * characters alone to retain TTR border.
    */
   clearTTR : function() {
      for (var i = 1; i < this.outputHeight-1; i++) {
         for (var j = 1; j < this.outputWidth-1; j++) {
            this.contents[i][j] = new Textel(" ", null, null);
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
};

/**
 * Updates mouse coordinates if mouse has been moved.
 */
function mouseMove(evt) {
   display.mouseY = Math.min(Math.max(Math.floor((evt.clientX - textWrapper.offsetLeft) / main.clientWidth * display.outputWidth),0),display.outputWidth-1);
   display.mouseX = Math.min(Math.max(Math.floor((evt.clientY - textWrapper.offsetTop) / main.clientHeight * display.outputHeight),0),display.outputHeight-1);
   display.blit();
}

/**
 * Updates window colors if mouse is over button when clicked.
 */
function mouseDown(evt) {
   if (display.contents[display.mouseX][display.mouseY].linkSet) {
      display.masterColors("gray", "black");
   }
}

/**
 * Parses link of current mouse location when mouse is released.
 */
function mouseUp(evt) {
   display.masterColors("white", "black");
   parseLink();
}

/**
 * Prevents the user from going back a page when backspace is pressed.
 */
function preventBackspaceHandler(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 8) {
        return false;
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
 */
function openWindowAnimation(frame, row, col, height, width, innerText, innerLink, innerColor, title, endLink) {
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
      lineTimer = setTimeout(openWindowAnimation, 10, frame+1, row, col, height, width, innerText, innerLink, innerColor, title, endLink);
   }
   else if (frame - Math.floor(width/2) <= Math.floor(height/2)) {
      var effectiveFrame = frame - Math.floor(width/2);
      display.drawBox(row + Math.floor(height/2) - effectiveFrame, col, Math.min(effectiveFrame * 2, height - 1), width - 1, frameLink, innerColor);
      var clearUpper = row + Math.floor(height/2) - effectiveFrame + 1;
      display.drawFill(clearUpper, col+1, 1, width-2, " ");

      var clearLower = row + Math.floor(height/2) + effectiveFrame - 1;
      if (clearLower != row + height - 1) display.drawFill(clearLower, col+1, 1, width-2, " ");
      lineTimer = setTimeout(openWindowAnimation, 25, frame+1, row, col, height, width, innerText, innerLink, innerColor, title, endLink);
   }
   else if (typeof title !== 'undefined' && title != null && (frame - Math.floor(width/2) - Math.floor(height/2) < 7)) {
      var effectiveFrame = frame - Math.floor(width/2) - Math.floor(height/2);
      if (typeof title !== 'undefined' && title != null) {
         if (effectiveFrame % 2 == 0) {
            display.drawText(row, col + Math.floor(width/2) - Math.floor(title.length / 2), title, titleLink, innerColor);
         }
         else {
            display.drawFill(row, col + Math.floor(width/2) - Math.floor(title.length / 2), 1, title.length, '─');
         }
         
      }
      lineTimer = setTimeout(openWindowAnimation, 50, frame+1, row, col, height, width, innerText, innerLink, innerColor, title, endLink);
   } else {
      if (typeof innerText !== 'undefined' && innerText != null) {
         display.drawText(row+1, col+1, innerText, frameLink, innerColor);
      }
      if (typeof endLink !== 'undefined' && endLink != null) {
         parseLink(endLink);
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
         console.log("%c Display supports touch. Mouse cursor has been hidden.", "color:green;");
      }
      else {
         display.displayMouse = true;
      }
      display.clearTTR();
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

/**
 * Displays saved topfeedLines contents. Clears screen beforehand.
 */
function displayTopFeedLines() {
   display.clearTTR;
   let endindex = topfeedLines.strings.length;
   let startindex = Math.max(endindex - maxLines,0);
   for(let i = startindex; i < endindex; i++) {
      display.drawText(i + 1, 3, topfeedLines.strings[i], topfeedLines.links[i], topfeedLines.colors[i]);
   }
   display.blit();
}

/**
 * Displays saved topfeedLines contents a distance below the top of the screen.
 * Does not clear screen.
 */
function displayBufferedTopFeedLines(buffer) {
   display.clearTTR;
   let endindex = topfeedLines.strings.length;
   let startindex = Math.max(endindex - maxLines + buffer,0);
   for(let i = startindex; i < endindex; i++) {
      display.drawText(i + 1 + buffer, 3, topfeedLines.strings[i], topfeedLines.links[i], topfeedLines.colors[i]);
   }
   display.blit();
}

/**
 * Displays saved bottomfeedLines contents. Clears screen beforehand.
 */
function displayBottomFeedLines() {
   display.clearTTR();
   for(var i = 0; i < bottomfeedLines.strings.length; i++) {
      display.drawText(i + 1, 3, bottomfeedLines.strings[i], bottomfeedLines.links[i], bottomfeedLines.colors[i]);
   }
   display.blit();
}

/**
 * Calls appropriate draw functions from current contents json file.
 * @param {number} section Section of JSON to read from.
 * @param {number} currentLineIndex Optional: Line index inside of section.
 */
function parseSection(section, currentLineIndex) {
   if (typeof currentLineIndex === 'undefined' || currentLineIndex == null) {
      currentLineIndex = 0;
   }
   type = layout[section][currentLineIndex][0];
   delay = layout[section][currentLineIndex][1];
   text = layout[section][currentLineIndex][2];
   link = layout[section][currentLineIndex][3];
   color = layout[section][currentLineIndex][4];

   // If section has changed, reset line storage and clear screen.
   if (section != previousSection) {
      display.clearTTR();
      topfeedLines.reset();
      bottomfeedLines.reset();
   }

   // Draw section, line index, and delay to top left if debug mode is enabled.
   if (enableDebug) {
      display.drawText(0,1,"──────────────────")
      display.drawText(0,1,section + "," + currentLineIndex + "," + Math.floor(delay * (1/textSpeedModifier)));
   }

   // ["topfeed", delay, text, link, color]
   if (type === "topfeed") {
      topfeedLines.push(text, link, color);
      displayTopFeedLines();
   }
   // ["bufferedTopfeed", delay, text, link, color, buffer]
   else if (type === "bufferedTopfeed") {
      let buffer = layout[section][currentLineIndex][5];
      topfeedLines.push(text, link, color);
      displayBufferedTopFeedLines(buffer);
   }
   // ["bottomfeed", delay, text, link, color]
   else if (type === "bottomfeed") {
      bottomfeedLines.push(text, link, color);
      displayBottomFeedLines();
   }
   // ["freetext", delay, text, link, color, row, col]
   else if (type === "freetext") {
      let row = layout[section][currentLineIndex][5];
      let col = layout[section][currentLineIndex][6];
      display.drawText(row, col, text, link, color);
      display.blit();
   }
   // ["freebox", ...]
   else if (type === "freebox") {
      // unimplemented
   }
   // ["window", delay, text, link, color, row, col, height, width, title,
   // endFunction]
   else if (type === "window") {
      let row = layout[section][currentLineIndex][5];
      let col = layout[section][currentLineIndex][6];
      let height = layout[section][currentLineIndex][7];
      let width = layout[section][currentLineIndex][8];
      let title = layout[section][currentLineIndex][9];
      let endFunction = layout[section][currentLineIndex][10];
      openWindowAnimation(0,row,col,height,width,text,link,color,title,endFunction);
   }
   // ["parselink", delay, null, link, null]
   else if (type === "parselink") {
      parseLink(link);
   }

   // Schedules next line placement under lineTimer unless instant or null.
   // Immediately runs if instant. Ends execution if null.
   previousSection = section;
   previousLineIndex = currentLineIndex;
   if (delay == 0) {
      parseSection(section, currentLineIndex + 1);
   }
   else if (delay != null) {
      lineTimer = setTimeout(parseSection, Math.floor(delay * (1/textSpeedModifier)), section, currentLineIndex + 1);
   }
}

function parseLink(link) {
   // if link is undefined, use link at current mouse position
   let linkSet = true;
   if (typeof link === 'undefined') {
      link = display.contents[display.mouseX][display.mouseY].link;
      linkSet = display.contents[display.mouseX][display.mouseY].linkSet;
   }

   if (!linkSet) return; // stop execution if no link is detected.
   
   let type = link[0];
   // ["reset"] 
   // triggers page reboot without a refresh
   if (type === "reset") {
      clearTimeout(lineTimer);
      display.clear();
      topfeedLines.reset();
      bottomfeedLines.reset();
      openWindowAnimation(0, 0, 0, display.outputHeight, display.outputWidth, null, ["reset"], null, "Quinn James Online", ["function",loadAssets,0]);
   }
   // ["continue"]
   // Continues parsing the section at the next line index (be careful).
   else if (type === "continue") {
      parseSection(previousSection, previousLineIndex+1);
   }
   // ["bookmark", section, line index]
   // Displays a given section at a given line index.
   else if (type === "bookmark") {
      clearTimeout(lineTimer);
      display.clearTTR();
      parseSection(link[1], link[2]);
   }
   // ["function", function, arg1, arg2, arg3, ...]
   // Runs a function with an arbitrary number of arguments.
   else if (type === "function") {
      let args = link.slice(2);
      link[1].apply(null, args);
   }
   // ["hyperlink", location]
   // Opens an external webpage
   else if (type === "hyperlink") {
      window.open(link[1],"_self");
   }
}

display.init();
parseLink(["reset"]);
