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
const skipClickToStart = true; // 'true' may cause intro sound playback issues

// CONTENTS
var contents = ["resources/homepage_contents.json"]; //TODO: integrate into asset loading

// HTML access variables
var main = document.getElementById("main");
var body = document.getElementById("body");
var textWrapper = document.getElementById("textWrapper");
var image = document.getElementById("img");

// JSON display variables
var layout;
var layoutReq;
var maxLines = 43;
var lineTimer;
var previousSection = null;
var previousLineIndex = null;
var previousMouseX = 0;
var previousMouseY = 0;

// AUDIO
var intro_sound = new Audio("resources/intro_sound.mp3");

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
   constructor(char, clickLink, hoverLink, unhoverLink, color) {
      this.clickLinkSet = true;
      this.colorSet = true;
      this.hoverLinkSet = true;
      // depends on short circuiting to avoid error, be careful.
      if (typeof clickLink === 'undefined' || clickLink == null) 
         this.clickLinkSet = false;
      if (typeof color === 'undefined'|| color == null) 
         this.colorSet = false;
      if (typeof hoverLink === 'undefined' || hoverLink == null) 
         this.hoverLinkSet = false;
      this.char = char;
      this.clickLink = [].concat(clickLink);
      this.hoverLink = [].concat(hoverLink);
      this.unhoverLink = [].concat(unhoverLink);
      this.color = color;
   }
}

/**
 * Object that stores an unlimited amount of lines. Displayed from top down,
 * showing maximum number of newest lines.
 */
var topfeedLines = {
   strings : new Array(),
   clickLinks : new Array(),
   hoverLinks : new Array(),
   colors : new Array(),

   /**
    * Pushes a given line into memory.
    */
   push : function(line, clickLink, hoverLink, color) {
      this.strings.push(line);
      this.clickLinks.push(clickLink);
      this.hoverLinks.push(hoverLink);
      this.colors.push(color);
   },

   reset : function() {
      this.strings = new Array();
      this.clickLinks = new Array();
      this.hoverLinks = new Array();
      this.colors = new Array();
   }
};

/**
 * Object that stores a screen-width number of lines. Displayed from bottom up.
 */
var bottomfeedLines = {
   strings : new Array(maxLines).fill(""),
   clickLinks : new Array(maxLines).fill(null),
   hoverLinks : new Array(maxLines).fill(null),
   colors : new Array(maxLines).fill(null),

   /**
    * Pushes a given line into memory. Removes oldest item from storage array.
    */
   push : function(line, clickLink, hoverLink, color) {
      this.strings.push(line);
      this.strings.shift();
      this.clickLinks.push(clickLink);
      this.clickLinks.shift();
      this.hoverLinks.push(hoverLink);
      this.hoverLinks.shift();
      this.colors.push(color);
      this.colors.shift();
   },

   reset : function() {
      this.strings = new Array(maxLines).fill("");
      this.clickLinks = new Array(maxLines).fill(null);
      this.hoverLinks = new Array(maxLines).fill(null);
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
      for(let i = 0; i < this.outputHeight; i++) {
   		this.contents.push(new Array(this.outputWidth));
   		for(let j = 0; j < this.outputWidth; j++) {
   			this.contents[i][j] = new Textel(' ', null, null, null, null);
   		}
   	}
   },

   /**
    * Draws the current contents of this.contents to the html textWrapper. No 
    * matter the changes to this.contents, output display will only update when 
    * this function is called.
    */
   blit : function() {
      let outputString = "";
      let mouseUnderTextel = this.contents[this.mouseX][this.mouseY];
      if (this.displayMouse) 
         this.contents[this.mouseX][this.mouseY] = new Textel(this.mouseChar);
      for(let i = 0; i < this.contents.length; i++) {
         for(let j = 0; j < this.contents[i].length; j++) {
            let char = this.contents[i][j].char;
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
    */
   drawBox : function(row, col, height, width, clickLink, hoverLink, color) {
      let unhoverLink = ["function", this.drawBox, row, col, height, width, clickLink, hoverLink, color];
      for (let i = row + 1; i < row + height; i++) {
         this.contents[i][col] = new Textel('│', clickLink, hoverLink, unhoverLink, color);
         this.contents[i][col + width] = new Textel('│', clickLink, hoverLink, unhoverLink, color);
      }
      for (let i = col + 1; i < col + width; i++) {
         this.contents[row][i] = new Textel('─', clickLink, hoverLink, unhoverLink, color);
         this.contents[row+height][i] = new Textel('─', clickLink, hoverLink, unhoverLink, color);
      }
      this.contents[row][col] = new Textel('┌', clickLink, hoverLink, unhoverLink, color);
      this.contents[row + height][col] = new Textel('└', clickLink, hoverLink, unhoverLink, color);
      this.contents[row][col + width] = new Textel('┐', clickLink, hoverLink, unhoverLink, color);
      this.contents[row + height][col + width] = new Textel('┘', clickLink, hoverLink, unhoverLink, color);
   },

   /**
    * Draws text string at given coordinates.
    */
   drawText : function(row, col, text, clickLink, hoverLink, color) {
      let unhoverLink = ["drawHoverText", text, color, row, col];
      for (let i = 0; i < text.length && (col + i) < this.outputWidth; i++) {
         this.contents[row][col + i] = new Textel(text.charAt(i), clickLink, hoverLink, unhoverLink, color);
      }
   },

   /**
    * Fills an area with a given character at given coodinates.
    */
   drawFill : function(row, col, height, width, char, clickLink, hoverLink, color) {
      let unhoverLink  = ["function", this.drawFill, row, col, height, width, char, clickLink, hoverLink, color];
      for (let i = 0; i < height; i++) {
         for (let j = 0; j < width; j++) {
            this.contents[row + i][col + j] = new Textel(char, clickLink, hoverLink, unhoverLink, color);
         }
      }
   },

   /**
    * Easy function for filling screen contents with spaces.
    */
   clear : function() {
      for (let i = 0; i < this.outputHeight; i++) {
         for (let j = 0; j < this.outputWidth; j++) {
            this.contents[i][j] = new Textel(" ", null, null, null, null);
         }
      }
   },

   /**
    * Easy function for filling screen contents with spaces. Leaves edge
    * characters alone to retain TTR border.
    */
   clearTTR : function() {
      for (let i = 1; i < this.outputHeight-1; i++) {
         for (let j = 1; j < this.outputWidth-1; j++) {
            this.contents[i][j] = new Textel(" ", null, null, null, null);
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

   // Calculate if mouse coordinates have changed, run respective hover and
   // unhover functions if so.
   textelHasChanged = (display.mouseX != previousMouseX) || 
      (display.mouseY != previousMouseY);
   if (textelHasChanged) {
      if (display.contents[previousMouseX][previousMouseY].hoverLinkSet)
         parseLink(display.contents[previousMouseX][previousMouseY].unhoverLink);
      if (display.contents[display.mouseX][display.mouseY].hoverLinkSet)
         parseLink(display.contents[display.mouseX][display.mouseY].hoverLink);
      display.blit();
      previousMouseX = display.mouseX;
      previousMouseY = display.mouseY;
   }
}

/**
 * Used to begin intro animation and sound once assets have loaded.
 */
function introMouseDown(evt) {
   document.removeEventListener("mousedown",introMouseDown);
   parseLink(["reset"]);
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
   if (display.contents[display.mouseX][display.mouseY].clickLinkSet)
      parseLink(display.contents[display.mouseX][display.mouseY].clickLink);
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
function openWindowAnimation(frame, row, col, height, width, text, clickLink, hoverLink, color, title, endLink) {
   if (frame <= Math.floor(width/2)) {
      display.drawBox(row + Math.floor(height / 2), col + Math.floor(width / 2) - frame, 1, Math.min(2 * frame, width - 1), null, null, color);
      lineTimer = setTimeout(openWindowAnimation, 10, frame+1, row, col, height, width, text, clickLink, hoverLink, color, title, endLink);
   }
   else if (frame - Math.floor(width/2) <= Math.floor(height/2)) {
      let effectiveFrame = frame - Math.floor(width/2);
      display.drawBox(row + Math.floor(height/2) - effectiveFrame, col, Math.min(effectiveFrame * 2, height - 1), width - 1, null, null, color);
      let clearUpper = row + Math.floor(height/2) - effectiveFrame + 1;
      display.drawFill(clearUpper, col+1, 1, width-2, " ", null, null, null);

      let clearLower = row + Math.floor(height/2) + effectiveFrame - 1;
      if (clearLower != row + height - 1) 
         display.drawFill(clearLower, col+1, 1, width-2, " ", null, null, null);
      lineTimer = setTimeout(openWindowAnimation, 25, frame+1, row, col, height, width, text, clickLink, hoverLink, color, title, endLink);
   }
   else if (typeof title !== 'undefined' && title != null && (frame - Math.floor(width/2) - Math.floor(height/2) < 7)) {
      let effectiveFrame = frame - Math.floor(width/2) - Math.floor(height/2);
      if (effectiveFrame % 2 == 0) {
         display.drawText(row, col + Math.floor(width/2) - Math.floor(title.length / 2), title, null, null, color);
      }
      else {
         display.drawFill(row, col + Math.floor(width/2) - Math.floor(title.length / 2), 1, title.length, '─', null, null, color);
      }
      lineTimer = setTimeout(openWindowAnimation, 50, frame+1, row, col, height, width, text, clickLink, hoverLink, color, title, endLink);
   } else {
      drawWindow(row, col, height, width, text, clickLink, hoverLink, color, title);
      if (typeof endLink !== 'undefined' && endLink != null) {
         parseLink(endLink);
      }
   }
   display.blit();
}

function drawWindow(row, col, height, width, text, clickLink, hoverLink, color, title){
   let unhoverLink = ["function", drawWindow, row, col, height, width, text, clickLink, hoverLink, color, title];
   
   // draw box (must be done here for unhoverlink purposes)
   for (let i = row + 1; i < row + height - 1; i++) {
      display.contents[i][col] = new Textel('│', clickLink, hoverLink, unhoverLink, color);
      display.contents[i][col + width - 1] = new Textel('│', clickLink, hoverLink, unhoverLink, color);
   }
   for (let i = col + 1; i < col + width - 1; i++) {
      display.contents[row][i] = new Textel('─', clickLink, hoverLink, unhoverLink, color);
      display.contents[row + height - 1][i] = new Textel('─', clickLink, hoverLink, unhoverLink, color);
   }
   display.contents[row][col] = new Textel('┌', clickLink, hoverLink, unhoverLink, color);
   display.contents[row + height - 1][col] = new Textel('└', clickLink, hoverLink, unhoverLink, color);
   display.contents[row][col + width - 1] = new Textel('┐', clickLink, hoverLink, unhoverLink, color);
   display.contents[row + height - 1][col + width - 1] = new Textel('┘', clickLink, hoverLink, unhoverLink, color);

   // clear area inside
   for (let i = row + 1; i < row + height - 1; i++) {
      for (let j = col + 1; j < col + width - 1; j++) {
         display.contents[i][j] = new Textel(' ', null, null, null, null);
      }
   }

   // draw text
   if (typeof text !== 'undefined' && text != null) {
      for (let i = 0; i < text.length && (col + 1 + i) < display.outputWidth; i++) {
         display.contents[row + 1][col + 1 + i] = new Textel(text.charAt(i), clickLink, hoverLink, unhoverLink, color);
      }
   }

   // draw title
   if (typeof title !== 'undefined' && title != null) {
      let startCol = col + Math.floor(width/2) - Math.floor(title.length / 2);
      for (let i = 0; i < title.length && (startCol + i) < display.outputWidth; i++) {
         display.contents[row][startCol + i] = new Textel(title.charAt(i), clickLink, hoverLink, unhoverLink, color);
      }
   }

   display.blit();
}

function loadAssets(frame) {
   if (frame == 0) {
      layoutReq = new XMLHttpRequest();
      layoutReq.responseType = "text";
      layoutReq.addEventListener("load", layoutReqListener);
      layoutReq.open("GET", contents[0]);
      layoutReq.send(null);
      displayColorGrid(2, display.outputHeight-2,2,display.outputWidth-2,2,5);
   }
   if (typeof layout !== 'undefined') {
      document.addEventListener("mousemove",mouseMove);
      document.addEventListener("mousedown",mouseDown);
      document.addEventListener("mouseup",mouseUp);
      if (display.isTouchDevice()) {
         console.log("%c Display supports touch. Mouse cursor has been hidden.", "color:green;");
      }
      else {
         display.displayMouse = true;
      }
      clearTimeout(lineTimer);
      display.drawText(1,0,"                ", null, null);
      if (skipClickToStart) {
         parseLink(["reset"]);
      }
      else {
         document.addEventListener("mousedown",introMouseDown);
         display.drawBox(Math.floor(display.outputHeight/2)-1,Math.floor(display.outputWidth/2-7)-1,2,15,null,null,null);
         display.drawText(Math.floor(display.outputHeight/2),Math.floor(display.outputWidth/2-7),"Click to begin",null,null,null);
         display.blit();
      }
   }
   else if (frame % 4 == 0) {
      display.drawText(1,0,"Loading assets |", null, null, "gray");
      setTimeout(loadAssets, 50, frame + 1);
   }
   else if (frame % 4 == 1) {
      display.drawText(1,0,"Loading assets /", null, null, "gray");
      setTimeout(loadAssets, 50, frame + 1);
   }
   else if (frame % 4 == 2) {
      display.drawText(1,0,"Loading assets ─", null, null, "gray");
      setTimeout(loadAssets, 50, frame + 1);
   }
   else if (frame % 4 == 3) {
      display.drawText(1,0,"Loading assets \\", null, null, "gray");
      setTimeout(loadAssets, 50, frame + 1);
   }

   if (frame == 20) {
      display.drawText(2,0,"Assets still unloaded. Try refreshing. [quinnjam.es] runs best on latest Firefox version.",null, null, "gray");
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
   display.clearTTR();
   let endindex = topfeedLines.strings.length;
   let startindex = Math.max(endindex - maxLines,0);
   for(let i = startindex; i < endindex; i++) {
      display.drawText(i + 1, 3, topfeedLines.strings[i], topfeedLines.clickLinks[i], topfeedLines.hoverLinks[i], topfeedLines.colors[i]);
   }
   display.blit();
}

/**
 * Displays saved topfeedLines contents a distance below the top of the screen.
 * Does not clear screen.
 */
function displayBufferedTopFeedLines(buffer) {
   let endindex = topfeedLines.strings.length;
   let startindex = Math.max(endindex - maxLines + buffer,0);
   for(let i = startindex; i < endindex; i++) {
      display.drawText(i + 1 + buffer, 3, topfeedLines.strings[i], topfeedLines.clickLinks[i], topfeedLines.hoverLinks[i], topfeedLines.colors[i]);
   }
   display.blit();
}

/**
 * Displays saved bottomfeedLines contents. Clears screen beforehand.
 */
function displayBottomFeedLines() {
   display.clearTTR();
   for(let i = 0; i < bottomfeedLines.strings.length; i++) {
      display.drawText(i + 1, 3, bottomfeedLines.strings[i], bottomfeedLines.clickLinks[i], bottomfeedLines.hoverLinks[i], bottomfeedLines.colors[i]);
   }
   display.blit();
}

function displayColorGrid(sRow, eRow, sCol, eCol, rowSpacing, colSpacing) {
   for(let row = sRow; row <= eRow; row += rowSpacing) {
      let lit = Math.floor(50 * (1-Math.sqrt((row-sRow)/(eRow-sRow))));
      for(let col = sCol; col <= eCol; col += colSpacing) {
         let hue = Math.floor(((col-sCol) / (eCol - sCol)) * 360);
         display.drawText(row,col,"█",null,null,"hsl(" + hue + ",100%," + lit + "%)");
      }
   }  
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
   clickLink = layout[section][currentLineIndex][3];
   hoverLink = layout[section][currentLineIndex][4];
   color = layout[section][currentLineIndex][5];

   // If section has changed, reset line storage and clear screen.
   if (section != previousSection) {
      display.clearTTR();
      topfeedLines.reset();
      bottomfeedLines.reset();
   }

   // Draw section, line index, and delay to top left if debug mode is enabled.
   if (enableDebug) {
      display.drawText(0,1,"──────────────────")
      display.drawText(0,1,section + "," + currentLineIndex + "," + delay);
   }

   // ["topfeed", delay, text, clickLink, hoverLink, color]
   if (type === "topfeed") {
      topfeedLines.push(text, clickLink, hoverLink, color);
      displayTopFeedLines();
   }
   // ["bufferedTopfeed", delay, text, clickLink, hoverLink, color, buffer]
   else if (type === "bufferedTopfeed") {
      let buffer = layout[section][currentLineIndex][6];
      topfeedLines.push(text, clickLink, hoverLink, color);
      displayBufferedTopFeedLines(buffer);
   }
   // ["bottomfeed", delay, text, clickLink, hoverLink, color]
   else if (type === "bottomfeed") {
      bottomfeedLines.push(text, clickLink, hoverLink, color);
      displayBottomFeedLines();
   }
   // ["freetext", delay, text, clickLink, hoverLink, color, row, col]
   else if (type === "freetext") {
      let row = layout[section][currentLineIndex][6];
      let col = layout[section][currentLineIndex][7];
      display.drawText(row, col, text, clickLink, hoverLink, color);
      display.blit();
   }
   // ["freebox", ...]
   else if (type === "freebox") {
      // unimplemented
   }
   // ["window", delay, text, clickLink, hoverLink, color, row, col, height, 
   // width, title]
   else if (type === "window") {
      let row = layout[section][currentLineIndex][6];
      let col = layout[section][currentLineIndex][7];
      let height = layout[section][currentLineIndex][8];
      let width = layout[section][currentLineIndex][9];
      let title = layout[section][currentLineIndex][10];
      drawWindow(row,col,height,width,text,clickLink,hoverLink,color,title);
   }
   // ["window", delay, text, clickLink, hoverLink, color, row, col, height, 
   // width, title, endFunction]
   else if (type === "windowAnimation") {
      let row = layout[section][currentLineIndex][6];
      let col = layout[section][currentLineIndex][7];
      let height = layout[section][currentLineIndex][8];
      let width = layout[section][currentLineIndex][9];
      let title = layout[section][currentLineIndex][10];
      let endFunction = layout[section][currentLineIndex][11];
      openWindowAnimation(0,row,col,height,width,text,clickLink,hoverLink,color,title,endFunction);
   }
   // ["parselink", delay, null, link, null]
   else if (type === "parselink") {
      parseLink(link);
   }
   // ["colorgrid", delay]
   else if (type === "colorgrid") {
      displayColorGrid(2, display.outputHeight-2,2,display.outputWidth-2,2,5);
   }
   // ["doNotDisplay", delay]
   else if (type === "doNotDisplay") {
      // nothing is displayed for this type, functions as a delay.
      display.blit();
   }

   // Schedules next line placement under lineTimer unless instant or null.
   // Immediately runs if instant. Ends execution if null.
   previousSection = section;
   previousLineIndex = currentLineIndex;
   if (delay == 0) {
      parseSection(section, currentLineIndex + 1);
   }
   else if (delay != null) {
      lineTimer = setTimeout(parseSection, delay, section, currentLineIndex + 1);
   }
}

function parseLink(link) {
   let type = link[0];
   // ["reset"] 
   // triggers page reboot without a refresh
   if (type === "reset") {
      if (!skipClickToStart) intro_sound.play();
      clearTimeout(lineTimer);
      display.clear();
      topfeedLines.reset();
      bottomfeedLines.reset();
      display.masterColors("white","white");
      setTimeout(display.masterColors, 150, "white", "black");
      openWindowAnimation(0, 0, 0, display.outputHeight, display.outputWidth, null, ["reset"], null, null, "Quinn James Online", ["bookmark",0,0]);
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
      console.log(link[1]);
      console.log(args);
      link[1].apply(null, args);
   }
   // ["hyperlink", location]
   // Opens an external webpage
   else if (type === "hyperlink") {
      window.open(link[1],"_self");
   }
   // ["drawHoverText", text, color, row, col]
   else if (type === "drawHoverText") {
      let text = link[1];
      let color = link[2];
      let row = link[3];
      let col = link[4];
      for (let i = 0; i < text.length; i++) {
         display.contents[row][col+i].char = text.charAt(i)
         display.contents[row][col+i].color = color;
         display.contents[row][col+i].colorSet = (color != null);
      }
      display.blit();
   }
}

// Page-load initialization
document.onkeydown = preventBackspaceHandler;
display.init();
loadAssets(0);
