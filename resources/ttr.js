//    ████████╗████████╗██████╗ 
//    ╚══██╔══╝╚══██╔══╝██╔══██╗
//       ██║      ██║   ██████╔╝
//       ██║      ██║   ██╔══██╗
//       ██║      ██║   ██║  ██║
//       ╚═╝      ╚═╝   ╚═╝  ╚═╝   CHARACTER ENGINE
//    version 5.0                          
//    by Quinn James 
//
// Copyright © 2022 Quinn James
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the “Software”), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Constants
const DEFAULT_CHAR = ' ';
const SVD_ANIMATION_FRAMES = 50;
const UL = '┌';
const UR = '┐';
const LL = '└';
const LR = '┘';
const HO = '─';
const VE = '│';
const UT = '┬';
const FF = '█';
const HF = '▒';
const DLT = '╞';
const DRT = '╡';
const DHO = '═';
const HEADER_LOGO = "&nbsp;#######&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;####&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;###&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;########&nbsp;&nbsp;######&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#######&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;####&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;########<br/>##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;##&nbsp;&nbsp;###&nbsp;&nbsp;&nbsp;##&nbsp;###&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;###&nbsp;&nbsp;&nbsp;###&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;###&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;###&nbsp;&nbsp;&nbsp;##&nbsp;##<br/>##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;##&nbsp;&nbsp;####&nbsp;&nbsp;##&nbsp;####&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;####&nbsp;####&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;####&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;####&nbsp;&nbsp;##&nbsp;##<br/>##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;##&nbsp;&nbsp;##&nbsp;##&nbsp;##&nbsp;##&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;###&nbsp;##&nbsp;######&nbsp;&nbsp;&nbsp;&nbsp;######&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;##&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;##&nbsp;##&nbsp;##&nbsp;######<br/>##&nbsp;&nbsp;##&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;##&nbsp;&nbsp;##&nbsp;&nbsp;####&nbsp;##&nbsp;&nbsp;####&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;#########&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;####&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;##&nbsp;&nbsp;####&nbsp;##<br/>##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;##&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;###&nbsp;##&nbsp;&nbsp;&nbsp;###&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;###&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;###&nbsp;##<br/>&nbsp;#####&nbsp;##&nbsp;&nbsp;#######&nbsp;&nbsp;####&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;######&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;########&nbsp;&nbsp;######&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#######&nbsp;&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;########&nbsp;####&nbsp;##&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;########<br/>";
const LINKS = [
    ["Home", "https://quinnjam.es"],
    ["Personal Projects", "https://quinnjam.es/coding"],
    ["CSGO Level Design", "https://quinnjam.es"],
    ["Minecraft Maps", "https://quinnjam.es"]
]
const CHAR_WIDTH = 7.113;
const CHAR_HEIGHT = 15.4;

// Utility function to resize a matrix and fill empty space with 0s
function resize_matrix(matrix, rows, cols) {
   // check that matrix is smaller than rows and cols count
   if(matrix.length > rows || matrix[0].length > cols) {
      throw "Could not resize matrix. Size [" + matrix.length + "," + matrix[0].length + "] larger than requested resize of [" + rows + "," + cols + "]";
   }

   let output = [];
   for(let row = 0; row < rows; row++) {
      temp_row = [];
      for(let col = 0; col < cols; col++) {
         if(row < matrix.length && col < matrix[row].length) {
            temp_row.push(matrix[row][col]);
         } 
         else {
            temp_row.push(0);
         }
      }
      output.push(temp_row);
   }
   return output;
}

// Utility function to round all values in a matrix to the nearest integer
function round_matrix(matrix) {
   for(let row = 0; row < matrix.length; row++) {
      for(let col = 0; col < matrix[row].length; col++) {
         matrix[row][col] = Math.round(matrix[row][col]);
      }
   }
   return matrix;
}


// Holds a grid of GridChars in memory which can be displayed on the webpage
class Grid {
   constructor(html_elem) {
      this.html_elem = html_elem;
      this.grid = [];
      this.width;
      this.height;

      this.resize();
      this.blit();
   }

   test() {
      console.log("test");
   }

   // resizes the grid to the current DOM object size
   resize() {
      this.width = Math.floor(this.html_elem.clientWidth / CHAR_WIDTH);
      this.height = Math.floor(this.html_elem.clientHeight / CHAR_HEIGHT);
      this.clear();
   }

   // Get a GridChar at given coordinates
   get_char(row, col) {
      if(row < 0 || row > this.grid.length) {
         throw "Getchar at row " + row + " out of current bounds."
      }
      if(col < 0 || col > TEXTWIDTH) {
         throw "Getchar at col " + col + " out of current bounds."
      }
      return this.grid[row][col];
   }

   // Return the grid as a character code matrix
   get_grid_as_char_code() {
      let output = [];
      for(let row = 0; row < this.height; row++) {
         let temp_row = [];
         for(let col = 0; col < this.width; col++) {
            temp_row.push(this.grid[row][col].char.charCodeAt(0));
         }
         output.push(temp_row);
      }
      return output;
   }

   // Return the singular values of this grid uing numeric.js
   get_singular_values() {
      return numeric.svd(this.get_grid_as_char_code());
   }

   // Returns the row count of the grid
   get_rows() {
      return this.height;
   }

   // Returns the col count of the grid
   get_cols() {
      return this.width;
   }

   // Sets a linkless grid from a grid of char codes. Only overwrites provided
   // elements in the input codes grid
   set_grid_from_char_code(codes) {
      for(let row = 0; row < codes.length; row++) {
         for(let col = 0; col < codes[row].length; col++) {
            let char_code = codes[row][col];

            // handle invalid char codes
            if(char_code <= 31) {
               char_code = 32;
            }

            let char_val = String.fromCharCode(char_code);
            let grid_char = new GridChar(char_val, null);
            this.set_char(grid_char, row, col);
         }
      }
   }

   // Add a GridChar to the grid, extend if neccesary, filling with default char
   set_char(char, row, col) {
      // do nothing if out of bounds
      if (row >= this.height || col >= this.width) {
         console.error("Tried to draw outside grid: " + row + "," + col);
         return;
      }

      // put the character in position
      this.grid[row][col] = char;
   }

   // Draws a box at row, col of hig, wid
   draw_box(row, col, hig, wid) {
      this.set_char(new GridChar(UL, null), row, col);
      this.set_char(new GridChar(UR, null), row, col + wid - 1);
      this.set_char(new GridChar(LL, null), row + hig - 1, col);
      this.set_char(new GridChar(LR, null), row + hig - 1, col + wid - 1);
      for(let c = col + 1; c < col + wid - 1; c++) {
         this.set_char(new GridChar(HO, null), row, c);
         this.set_char(new GridChar(HO, null), row + hig - 1, c);
      }
      for(let r = row + 1; r < row + hig - 1; r++) {
         this.set_char(new GridChar(VE, null), r, col);
         this.set_char(new GridChar(VE, null), r, col + wid - 1);
      }
   }

   // Draws a string of text at given coordinates. No wrapping
   draw_text(text, row, col) {
      for(let c = 0; c < text.length && c + col < this.width; c++) {
         this.set_char(new GridChar(text[c], null), row, col + c)
      }
   }

   // Clears the grid with the default character
   clear() {
      this.grid = [];
      for(let row = 0; row < this.height; row++) {
         let temp_row = new Array(this.width).fill(new GridChar(DEFAULT_CHAR, null));
         this.grid.push(temp_row);

         for(let col = 0; col < this.width; col++) {
            this.set_char(new GridChar(DEFAULT_CHAR, null), row, col);
         }
      }
   }

   // Copy grid to screen
   blit() {
      let prev_link = null;
      let output = "";

      // run left to right for every character on the grid
      for(let row = 0; row < this.height; row++) {
         for(let col = 0; col < this.width; col++) {
            // handle opening and closing a tags if previous link is different
            // from the current link
            let curr_link = this.grid[row][col].link;
            if(prev_link != curr_link) {
               // handle closing the a tag if not null link
               if(prev_link != null) {
                  output += "</a>";
               }

               // handle opening new a tag if not null link
               if(curr_link != null) {
                  output += "<a href=\"" + curr_link + "\">";
               }

               prev_link = curr_link;
            }

            // output the char at this location
            let temp_char = this.grid[row][col].char;
            if(temp_char == " ") {
               output += "&nbsp;";
            } else {
               output += this.grid[row][col].char;
            }
         }
         output += "<br/>"
      }

      // Copy output to HTML object
      this.html_elem.innerHTML = output;
   }
}

// One character on the grid
class GridChar {
   constructor(char, link) {
      this.char = char;
      this.link = link;
   }
}