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
const enableDebug = false; // Ability to view Textel contents (middle click).
const skipClickToStart = true; // 'true' will not play intro sound
const loadToTestPage = false; // 'true' loads main.json to sec 0, false to sec 1
const pageBorderTitle = "Quinn James Online";
const enableCustomDrawFromArray = false;
const enableCustomParseLink = true;

// CONTENTS
var contentsURL = "resources/main.json";
var contents;
var contentsReq;

// HTML access variables
var main = document.getElementById("main");
var body = document.getElementById("body");
var textWrapper = document.getElementById("textWrapper");
var image = document.getElementById("img");

// JSON display variables
var lineTimer;
var previousSection = null;
var previousLineIndex = null;
var previousMouseX = 0;
var previousMouseY = 0;
var hoverIndexCount = 0;
var enabledHoverIndex = null;

// AUDIO
var intro_sound = new Audio("resources/intro_sound.mp3");

/**
 * Function for custom draw-time functionality. See drawFromArray() function for
 * existing functionality. Note that 'enableCustomDrawFromArray' must be set to
 * true to use.
 * @param input List of arbitrary types taken from current json file, stripped *
 * of index 0, delay.
 */
function customDrawFromArray(input) {
   // add custom functionality here
}

/**
 * Function for custom link functionality. See parseLink() function for existing
 * links. Note that 'enableCustomParseLink' must be set to true to use.
 * @param input List which follows format [linkType, arg1, arg2, arg3, ...]
 */
function customParseLink(input) {
   if (input[0] === "enableTerminal") {
      if (!terminal.isEnabled) {
         terminal.enable(0);
      }
   }
}

/**
 * Class which composes the character-based output. Displays one character of a
 * certain color. Optional link allows for functions and hyperlinks to be run
 * when clicked / activated.
 */
class Textel {
   constructor(standardContents, hoverContents, hoverIndex) {
      if (typeof hoverIndex === 'undefined') hoverIndex = null;
      this.standardContents = standardContents;
      this.hoverContents = hoverContents;
      this.hoverIndex = hoverIndex;
   }
}

/**
 * Display is the canvas object. Contains stored Textel contents, functions for 
 * drawing, and output functions for changing the user-visible HTML.
 */
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
   			this.contents[i][j] = new Textel([' ',null,null],null);
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
      if (this.displayMouse) {
         this.contents[this.mouseX][this.mouseY] = new Textel([this.mouseChar,null,null],null);
      }
      for(let i = 0; i < this.contents.length; i++) {
         for(let j = 0; j < this.contents[i].length; j++) {
            // Get char and color from current Textel, respecting hover index
            let char = null;
            let color = null;
            if (enabledHoverIndex != null && 
               this.contents[i][j].hoverIndex == enabledHoverIndex) {
               char = this.contents[i][j].hoverContents[0];
               color = this.contents[i][j].hoverContents[2];
            }
            else {
               char = this.contents[i][j].standardContents[0];
               color = this.contents[i][j].standardContents[2];
            }

            // Process and display char in HTML
            if(char == " " || char == ' ') {
               outputString += "&nbsp;";
            }
            else if (color != null) {
               outputString += "<span style='color:" + color + "'>" + char + "</span>";
            }
            else {
               outputString += char;
            }
         }
         outputString += "<br/>";
      }
      main.innerHTML = outputString;
      this.contents[this.mouseX][this.mouseY] = mouseUnderTextel;
   },

   /**
    * Draws a box using ASCII line characters.
    */
   drawBox : function(row, col, height, width, link, color) {
      height--;
      width--;
      for (let i = row + 1; i < row + height; i++) {
         this.contents[i][col] = new Textel(['│', link, color],null);
         this.contents[i][col + width] = new Textel(['│', link, color], null);
      }
      for (let i = col + 1; i < col + width; i++) {
         this.contents[row][i] = new Textel(['─', link, color], null);
         this.contents[row+height][i] = new Textel(['─', link, color], null);
      }
      this.contents[row][col] = new Textel(['┌', link, color], null);
      this.contents[row + height][col] = new Textel(['└', link, color], null);
      this.contents[row][col + width] = new Textel(['┐', link, color], null);
      this.contents[row + height][col + width] = new Textel(['┘', link, color], null);
   },

   /**
    * Draws text string at given coordinates. standardContents and 
    * hoverContents should follow the format:
    *       [text, link, color]
    * Set hovercontents to 'null' if no hover is desired.
    */
   drawText : function(row, col, standardContents, hoverContents) {
      let textStd = standardContents[0];
      let textHover = null;
      h_index = null;
      if (hoverContents != null) {
         textHover = hoverContents[0];
         h_index = hoverIndexCount;
         hoverIndexCount++;
      }
      for (let i = 0; i < textStd.length && (col + i) < this.outputWidth; i++) {
         let s_contents = [textStd.charAt(i), standardContents[1], standardContents[2]];
         let h_contents = null;
         if (hoverContents != null) {
            h_contents = [textHover.charAt(i), hoverContents[1], hoverContents[2]];
         }
         this.contents[row][col + i] = new Textel(s_contents, h_contents, h_index);
      }
   },

   /**
    * Fills an area with a given character at given coodinates.
    */
   drawFill : function(row, col, height, width, char, link, color) {
      for (let i = 0; i < height; i++) {
         for (let j = 0; j < width; j++) {
            this.contents[row + i][col + j] = new Textel([char, link, color], null);
         }
      }
   },

   /**
    * Easy function for filling screen contents with spaces.
    */
   clear : function() {
      for (let i = 0; i < this.outputHeight; i++) {
         for (let j = 0; j < this.outputWidth; j++) {
            this.contents[i][j] = new Textel([' ', null, null], null);
         }
      }
      hoverIndexCount = 0;
      enabledHoverIndex = null;
   },

   /**
    * Easy function for filling screen contents with spaces. Leaves edge
    * characters alone to retain TTR border.
    */
   clearTTR : function() {
      for (let i = 1; i < this.outputHeight-1; i++) {
         for (let j = 1; j < this.outputWidth-1; j++) {
            this.contents[i][j] = new Textel([' ', null, null], null);
         }
      }
      hoverIndexCount = 1; // keep border homepage link
      enabledHoverIndex = null;
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
   },

   /**
    * Animates a background image change.
    * @param link URL of image.
    */
   setImage : function(link) {
      $("#img").fadeOut(500);
      setTimeout(this.setImage2, 500, link);
   },

   /**
    * Helper function for setImage() 
    */
   setImage2 : function(link) {
      image.src = link;
   }
};

/**
 * Updates mouse coordinates if mouse has been moved.
 */
function mouseMove(evt) {
   display.mouseY = Math.min(Math.max(Math.floor((evt.clientX - textWrapper.offsetLeft + 2) / main.clientWidth * display.outputWidth),0),display.outputWidth-1);
   display.mouseX = Math.min(Math.max(Math.floor((evt.clientY - textWrapper.offsetTop) / main.clientHeight * display.outputHeight),0),display.outputHeight-1);
   enabledHoverIndex = display.contents[display.mouseX][display.mouseY].hoverIndex
   display.blit();
}

/**
 * Used to begin intro animation and sound once assets have loaded.
 */
function introMouseDown(evt) {
   document.removeEventListener("mousedown",introMouseDown);
   parseLink(["reset"]);
}

/**
 * Updates window colors if mouse is over active link when clicked.
 */
function mouseDown(evt) {
   let currentTextel = display.contents[display.mouseX][display.mouseY];
   if (enabledHoverIndex == null || 
      currentTextel.hoverIndex != enabledHoverIndex) {
      if (currentTextel.standardContents[1] != null) {
         display.masterColors("gray", "black");
      }
   }
   else if (currentTextel.hoverContents != null && currentTextel.hoverContents[1] != null) {
      display.masterColors("gray", "black");
   }
}

/**
 * Parses link of current mouse location when mouse is released.
 */
function mouseUp(evt) {
   display.masterColors("white", "black");
   let currentTextel = display.contents[display.mouseX][display.mouseY];
   if (enableDebug && evt.button == 1) {
      // Display cell contents on middle click
      let cellText = "[" + currentTextel.standardContents + "],[" + currentTextel.hoverContents + "]," + currentTextel.hoverIndex;
      display.drawText(display.outputHeight-1,1,["──────────────────────────────────────────────────────",null,null],null);
      display.drawText(display.outputHeight-1,1,[cellText,null,null],null);
      display.blit();
      return;
   }
   if (enabledHoverIndex == null || currentTextel.hoverIndex != enabledHoverIndex) {
      if (currentTextel.standardContents[1] != null) {
         parseLink(currentTextel.standardContents[1]);
      }
   }
   else if (currentTextel.hoverContents != null && currentTextel.hoverContents[1] != null) {
      parseLink(currentTextel.hoverContents[1]);
   }
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
 * Calls appropriate draw functions from current contents in json file.
 * @param {number} section Section of JSON to read from.
 * @param {number} currentLineIndex Optional: Line index inside of section.
 */
function parseSection(section, currentLineIndex) {
   if (typeof currentLineIndex === 'undefined' || currentLineIndex == null) {
      currentLineIndex = 0;
   }

   let delay = contents[section][currentLineIndex][0];

   // If section has changed, reset line storage and clear screen.
   if (section != previousSection) {
      display.clearTTR();
      terminal.isEnabled = false;
   }

   // Draw section, line index, and delay to top left if debug mode is enabled.
   if (enableDebug) {
      display.drawText(0,1,["──────────────────",null,null],null);
      display.drawText(0,1,[section + "," + currentLineIndex + "," + delay,null,null],null);
   }

   drawFromArray(contents[section][currentLineIndex].slice(1));

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

/**
 * Draws to display using given array. Permitted input formats are as follows:
 *       ["box", row, col, height, width, fillChar, link, color]
 *       ["text", row, col, standardContents, hoverContents]
 *          stdCon/hovCon are lists and follow the format: [text, link, color]
 *       ["fill", row, col, height, width, fillChar, link, color]
 *       ["colorgrid"]
 *       ["boxAnimation", row, col, height, width, fillChar, stdTitle, 
 *          hoverTitle, endLink]
 *       ["backgroundImage", URL]
 * Note that additional drawFromArray functionality should be implemented in 
 * the function 'customDrawFromArray', which requires 
 * 'enableCustomDrawFromArray' to be set to true globally.
 */
function drawFromArray(input) {
   let type = input[0];
   // ["box", row, col, height, width, fillChar, link, color]
   // note a fillChar of 'null' will not draw over background
   if (type === "box") {
      display.drawBox(input[1], input[2], input[3], input[4], input[6], input[7]);
      if (input[5] != null) {
         display.drawFill(input[1]+1, input[2]+1, input[3]-2, input[4]-2, input[5], input[6], input[7]);
      }
   }
   // ["text", row, col, standardContents, hoverContents]
   else if (type === "text") {
      display.drawText(input[1], input[2], input[3], input[4]);
   }
   // ["fill", row, col, height, width, fillChar, link, color]
   else if (type === "fill") {
      display.drawFill(input[1], input[2], input[3], input[4], input[5], input[6], input[7]);
   }
   // ["colorgrid"]
   else if (type === "colorgrid") {
      displayColorGrid(2, display.outputHeight-2,2,display.outputWidth-2,2,5);
   }
   // ["boxAnimation", row, col, height, width, fillChar, stdTitle, hoverTitle, endLink]
   else if (type === "boxAnimation") {
      openBoxAnimation(0, input[1], input[2], input[3], input[4], input[5], input[6], input[7], input[8]);
   }
   else if (type === "backgroundImage") {
      display.setImage(input[1]);
   }
   else if (enableCustomDrawFromArray) {
      customDrawFromArray(input);
   }
   display.blit();
}

/**
 * Opens a box using a trendy animation. stdTitle and hoverTitle provide a
 * convenient way to include a label for the box in a one-command solution,
 * while endLink can execute an arbitrary link once the animation is complete.
 * Using ["continue"] as an endLink can be convenient if the animation is
 * mid-JSON execution.
 */
function openBoxAnimation(frame, row, col, height, width, fillChar, stdTitle, hoverTitle, endLink) {
   if (frame <= Math.floor(width/2)) {
      display.drawBox(row + Math.floor(height / 2), col + Math.floor(width / 2) - frame, 2, Math.min(2 * frame, width - 1), null, null);
      lineTimer = setTimeout(openBoxAnimation, 10, frame+1, row, col, height, width, fillChar, stdTitle, hoverTitle, endLink);
   }
   else if (frame - Math.floor(width/2) <= Math.floor(height/2)) {
      let effectiveFrame = frame - Math.floor(width/2);
      display.drawBox(row + Math.floor(height/2) - effectiveFrame, col, Math.min(effectiveFrame * 2 + 1, height), width, null, null);
      if (fillChar != null) {
         let clearUpper = row + Math.floor(height/2) - effectiveFrame + 1;
         display.drawFill(clearUpper, col+1, 1, width-2, fillChar[0], fillChar[1], fillChar[2]);
         let clearLower = row + Math.floor(height/2) + effectiveFrame - 1;
         if (clearLower != row + height) {
            display.drawFill(clearLower, col+1, 1, width-2, fillChar[0], fillChar[1], fillChar[2]);
         }
      }
      lineTimer = setTimeout(openBoxAnimation, 25, frame+1, row, col, height, width, fillChar, stdTitle, hoverTitle, endLink);
   }
   else if (stdTitle != null && (frame - Math.floor(width/2) - Math.floor(height/2) < 7)) {
      let titleLength = stdTitle[0].length;
      let effectiveFrame = frame - Math.floor(width/2) - Math.floor(height/2);
      if (effectiveFrame % 2 == 0) {
         display.drawText(row, col + Math.floor(width/2) - Math.floor(titleLength / 2), stdTitle, null);
      }
      else {
         display.drawFill(row, col + Math.floor(width/2) - Math.floor(titleLength / 2), 1, titleLength, '─', null, null);
      }
      lineTimer = setTimeout(openBoxAnimation, 50, frame+1, row, col, height, width, fillChar, stdTitle, hoverTitle, endLink);
   } else {
      display.drawBox(row, col, height, width, null, null);
      if (fillChar != null) {
         display.drawFill(row+1, col+1, height-2, width-2, fillChar[0], fillChar[1], fillChar[2]);
      }
      if (stdTitle != null) {
         display.drawText(row, col + Math.floor(width/2) - Math.floor(stdTitle[0].length / 2), stdTitle, hoverTitle);
      }
      if (typeof endLink !== 'undefined' && endLink != null) {
         parseLink(endLink);
      }
   }
   display.blit();
}

/**
 * Displays a grid of rainbow color box characters set by various parameters.
 */
function displayColorGrid(sRow, eRow, sCol, eCol, rowSpacing, colSpacing) {
   for(let row = sRow; row <= eRow; row += rowSpacing) {
      let lit = Math.floor(50 * (1-Math.sqrt((row-sRow)/(eRow-sRow))));
      for(let col = sCol; col <= eCol; col += colSpacing) {
         let hue = Math.floor(((col-sCol) / (eCol - sCol)) * 360);
         display.drawText(row,col,["█",null,"hsl(" + hue + ",100%," + lit + "%)"], null);
      }
   }  
}

/**
 * Parses a link (list of items) in the format:
 *       [linkType, arg1, arg2, arg3, ...]
 * Accepted link formats are:
 *       ["reset"] - Resets page and intro animation.
 *       ["continue"] - Continues parseLink at next line index. Useful to run   
 *                      after box animations.
 *       ["bookmark", section, lineIndex] - parseLink at certain location.
 *       ["function", arg1, arg2, arg3] - Runs a JS function with arguments.
 *       ["hyperlink", link] - Opens a URL
 *       ["test"] - Used for testing links. Alerts user that "link works"
 * Note that additional parseLink functionality should be implemented in the 
 * function 'customParseLink', which requires 'enableCustomParseLink' to be set 
 * to true globally.
 */
function parseLink(link) {
   let type = link[0];
   // ["reset"] 
   // triggers page reboot without a refresh
   if (type === "reset") {
      if (!skipClickToStart) intro_sound.play();
      clearTimeout(lineTimer);
      display.clear();
      display.setImage("");
      display.masterColors("white","white");
      setTimeout(display.masterColors, 150, "white", "black");
      let functionEndLink = ["bookmark", (loadToTestPage ? 0 : 1), 0];
      let stdTitle = ["─" + pageBorderTitle + "─", ["reset"], null];
      let hvrTitle = ["[" + pageBorderTitle + "]", ["reset"], "lime"];
      openBoxAnimation(0, 0, 0, display.outputHeight, display.outputWidth, ' ', stdTitle, hvrTitle, functionEndLink);
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
   // ["test"]
   else if (type === "test") {
      alert("Link works!");
   }
   else if (enableCustomParseLink) {
      customParseLink(link);
   }
}

/**
 * Loads initial json file when page is launched. Controls homepage animations.
 * @param {number} frame Used recursively. Set to 0.
 */
function loadAssets(frame) {
   if (frame == 0) {
      contentsReq = new XMLHttpRequest();
      contentsReq.responseType = "text";
      contentsReq.addEventListener("load", contentsReqListener);
      contentsReq.open("GET", contentsURL);
      contentsReq.send(null);
      displayColorGrid(2, display.outputHeight-2,2,display.outputWidth-2,2,5);
   }
   if (typeof contents !== 'undefined') {
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
      display.drawText(1,0,["                ", null, null], null);
      if (skipClickToStart) {
         parseLink(["reset"]);
      }
      else {
         document.addEventListener("mousedown",introMouseDown);
         display.drawBox(Math.floor(display.outputHeight/2)-1,Math.floor(display.outputWidth/2-7)-1,3,16,null,null);
         display.drawText(Math.floor(display.outputHeight/2),Math.floor(display.outputWidth/2-7),["Click to begin",null,null],null);
         display.blit();
      }
   }
   else if (frame % 4 == 0) {
      display.drawText(1,0,["Loading assets |", null, "gray"], null);
      setTimeout(loadAssets, 50, frame + 1);
   }
   else if (frame % 4 == 1) {
      display.drawText(1,0,["Loading assets /", null, "gray"], null);
      setTimeout(loadAssets, 50, frame + 1);
   }
   else if (frame % 4 == 2) {
      display.drawText(1,0,["Loading assets ─", null, "gray"], null);
      setTimeout(loadAssets, 50, frame + 1);
   }
   else if (frame % 4 == 3) {
      display.drawText(1,0,["Loading assets \\", null, "gray"], null);
      setTimeout(loadAssets, 50, frame + 1);
   }

   if (frame == 20) {
      display.drawText(2,0,["Assets still unloaded. Try refreshing. [quinnjam.es] runs best on latest Firefox version.",null, "gray"], null);
   }
   display.blit();
}

/**
 * XML Request listener for initial JSON load.
 */
function contentsReqListener() {
	contents = JSON.parse(this.responseText);
}

/**
 * Changes current JSON file.
 * @param {String} newFileURL URL of new JSON file. 
 */
function changeJSON(newFileURL) {
   contentsReq = new XMLHttpRequest();
   contentsReq.responseType = "text";
   contentsReq.addEventListener("load", changeJSONReqListener);
   contentsReq.open("GET", newFileURL);
   contentsReq.send(null);
   contentsURL = newFileURL;
}

/**
 * XML Request listener for JSON change.
 */
function changeJSONReqListener() {
   contents = JSON.parse(this.responseText);
   parseLink(["bookmark",0,0]);
}

// Page-load initialization
document.onkeydown = preventBackspaceHandler;
display.init();
loadAssets(0);
