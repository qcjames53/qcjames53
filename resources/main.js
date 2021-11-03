
// DEV TOGGLES
const debug_console = true

// CONSTANTS
const pixels_per_char_w = 7;
const pixels_per_char_h = 12;
const char_buffer_x = 1;
const char_buffer_y = 0;
const margin = 1;
const margin_char = '0';
const mouseChar = '█';

// JSON display variables
var previousMouseX = 0;
var previousMouseY = 0;
var hoverIndexCount = 0;
var enabledHoverIndex = null;
var windowResizeID;

// CONTENTS
var contentsURL = "resources/pages.json";
var contents;
var contentsReq;


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
 let display = {
    outputWidth : null,
    outputHeight : null,
    contents : null,
    mouseX : 0,
    mouseY : 0,
    displayMouse : true,
 
    /**
     * Initializes the display object. Must be run before any display functions 
     * are called. Fills 'contents' variable with spaces.
     */
    init : function() {
        // Resize the grid to the window size
        this.outputWidth = Math.trunc(window.innerWidth / pixels_per_char_w) - char_buffer_x;
        this.outputHeight = Math.trunc(window.innerHeight / pixels_per_char_h) - char_buffer_y;
        
        // Debug
        if (debug_console) {
            console.info("Resized window. New output size: [" + this.outputWidth + "," + this.outputHeight + "]");
        }
       
        // Create a new, cleared grid
        this.clear();

        // Display the grid
        this.blit();
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
          this.contents[this.mouseX][this.mouseY] = new Textel([mouseChar,null,null],null);
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
        this.contents = new Array();
        for(let i = 0; i < this.outputHeight; i++) {
            this.contents.push(new Array(this.outputWidth));
            for(let j = 0; j < this.outputWidth; j++) {
                if(i < margin || i > this.outputHeight - margin - 1 || j < margin || j > this.outputWidth - margin - 1) {
                    this.contents[i][j] = new Textel([margin_char, null, null], null)
                }
                else {
                    this.contents[i][j] = new Textel([' ',null,null],null);
                }
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
             this.contents[i][j] = new Textel([' ', null, null], null);
          }
       }
       hoverIndexCount = 1; // keep border homepage link
       enabledHoverIndex = null;
    },
 
    /**
     * Changes color of the display.
     * @param {string} foreground Changes color of all characters with 
     * undefined or null color values.
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
     * Displays a grid of rainbow color box characters set by various parameters.
     */
    displayColorGrid : function(sRow, eRow, sCol, eCol, rowSpacing, colSpacing) {
        // take care of undefined values
        if(sRow === undefined) {sRow = margin+2;}
        if(eRow === undefined) {eRow = display.outputHeight-margin-3;}
        if(sCol === undefined) {sCol = margin+2;}
        if(eCol === undefined) {eCol = display.outputWidth-margin-3;}
        if(rowSpacing === undefined) {rowSpacing = 2;}
        if(colSpacing === undefined) {colSpacing = 4;}


        for(let row = sRow; row <= eRow; row += rowSpacing) {
            let lit = Math.floor(50 * (1-Math.sqrt((row-sRow)/(eRow-sRow))));
            for(let col = sCol; col <= eCol; col += colSpacing) {
                let hue = Math.floor(((col-sCol) / (eCol - sCol)) * 360);
                this.drawText(row,col,["█",null,"hsl(" + hue + ",100%," + lit + "%)"], null);
            }
        }  
    }
};


class MenuManager {
    constructor() {
        // Start the menu closed
        this.current_tab = 0;
    }

    draw() {

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
       display.displayColorGrid();
    }
    if (typeof contents !== 'undefined') {
    //    document.addEventListener("mousemove",mouseMove);
    //    document.addEventListener("mousedown",mouseDown);
    //    document.addEventListener("mouseup",mouseUp);
    //    if (display.isTouchDevice()) {
    //       console.info("%c Display supports touch. Mouse cursor has been hidden.", "color:green;");
    //    }
    //    else {
    //       display.displayMouse = true;
    //    }
    //    clearTimeout(lineTimer);
    //    display.drawText(1,0,["                ", null, null], null);
    //    if (skipClickToStart) {
    //       parseLink(["reset"]);
    //    }
    //    else {
    //       document.addEventListener("mousedown",introMouseDown);
    //       display.drawBox(Math.floor(display.outputHeight/2)-1,Math.floor(display.outputWidth/2-7)-1,3,16,null,null);
    //       display.drawText(Math.floor(display.outputHeight/2),Math.floor(display.outputWidth/2-7),["Click to begin",null,null],null);
    //       display.blit();
    // 
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
 * Prevents the user from going back a page when backspace is pressed.
 */
function preventBackspaceHandler(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 8) {
        return false;
    }
}

function onWindowResize() {
    clearTimeout(windowResizeID);
    windowResizeID = setTimeout(onWindowResizeComplete, 100);
}

function onWindowResizeComplete() {
    display.init()
}

// Page-load initialization
document.onkeydown = preventBackspaceHandler;
display.init();
loadAssets(0);