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
const GRIDWIDTH = 80;
const TEXTWIDTH = 78;
const DEFAULT_CHAR = ' ';
const SVD_ANIMATION_FRAMES = 50;
const IMAGE_HEIGHT = 23;
const IMAGE_WIDTH = 80;
const HEADER_WIDTH = 162;
const HEADER_HEIGHT = 10;
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
const HEADER_LINKS = "<br/><a href=\"https://quinnjam.es\">Homepage</a><br/><br/>";
const FOOTER_COPYRIGHT = "Copyright © 2022 <a href=\"https://quinnjam.es\">Quinn James</a> | ";
const FOOTER_MODIFY_PREF = "This webpage was last modified on ";

// HTML access variables
let main = document.getElementById("ttr");
let images = document.getElementById("ttr-images");
let header = document.getElementById("ttr-header");
let footer = document.getElementById("ttr-footer");

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
      for(let row = 0; row < this.grid.length; row++) {
         let temp_row = [];
         for(let col = 0; col < GRIDWIDTH; col++) {
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
      return this.grid.length;
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
      // extend grid until row is reached
      while(row >= this.grid.length) {
         let temp_row = new Array(GRIDWIDTH).fill(new GridChar(DEFAULT_CHAR, null));
         this.grid.push(temp_row);
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
      for(let c = 0; c < text.length && c + col < GRIDWIDTH; c++) {
         this.set_char(new GridChar(text[c], null), row, col + c)
      }
   }

   // Clears the grid with the default character
   clear() {
      for(let row = 0; row < this.grid.length; row++) {
         for(let col = 0; col < GRIDWIDTH; col++) {
            this.set_char(new GridChar(DEFAULT_CHAR, null), row, col);
         }
      }
   }

   // Copy grid to screen
   blit() {
      let prev_link = null;
      let output = "";

      // run left to right for every character on the grid
      for(let row = 0; row < this.grid.length; row++) {
         for(let col = 0; col < GRIDWIDTH; col++) {
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

// A class which handles image placement on screen right
class ImageHandler {
   constructor(html_elem) {
      this.html_elem = html_elem;
      this.images = []; // 2d array holding [link, alt]
      this.first_open_row = 0;
   }

   // Put the stored contents of the image handler on screen
   blit() {
      let output = "";
      for(let entry of this.images) {
         if(entry != null) {
            output += "<img src=\"" + entry[0] + "\" alt=\"" + entry[1] + "\"/>";

            // If this image has a caption, display it with left padding
            if(entry[1] != null) {
               let padding_text = Array(IMAGE_WIDTH + 1).join(' ');
               let caption_left_pad = String(padding_text + entry[1]).slice(-IMAGE_WIDTH);
               output += "<br/>" + caption_left_pad.replaceAll(" ", "&nbsp;");
            }
         }
         output += "<br/>";
      }
      this.html_elem.innerHTML = output;
   }

   // Adds an image to the image handler
   // Returns the row after the image stops
   add_image(link, alt, row_requested) {      
      // Add newlines until the image is in line with (or beyond) the requested row.
      let row = this.first_open_row;
      while(row < row_requested) {
         this.images.push(null);
         row++;
      }
      
      // Add the image and return the next open row
      this.images.push([link, alt]);
      this.first_open_row = row + IMAGE_HEIGHT;

      // If the image has a caption, add one line
      if(alt != null) {
         this.first_open_row++;
      }

      return this.first_open_row;
   }

   // Returns the next open image row
   get_first_open_row() {
      return this.first_open_row;
   }

   // Clears and resets the image handler
   clear() {
      this.images = [];
      this.first_open_row = 0;
   }

}

// One character on the grid
class GridChar {
   constructor(char, link) {
      this.char = char;
      this.link = link;
   }
}

// One word in a text section
class SectionWord {
   constructor(grid, text, link) {
      this.grid = grid;
      this.text = text;
      this.link = link;
   }

   // Print this word to the grid at the given coords
   // Returns the character directly after this word
   print_to_grid(row, col) {
      // If the word is a newline, execute a newline and return
      if(this.text == "\n") {
         return [row + 1, 0];
      }

      // Three wrap possibilities
      // 1 - the word can fit on the current line. Start at row, col.
      // 2 - the word can fit on the next line. Start at row + 1, col = 0.
      // 3 - the word won't fit on any line. Start at row, col and wrap at a random char.
      if(col + this.text.length > TEXTWIDTH && this.text.length <= TEXTWIDTH) {
         row++;
         col = 0;
      }

      // Print to grid, with wrapping when hitting max col
      for(let char of this.text) {
         let temp_char = new GridChar(char, this.link);
         this.grid.set_char(temp_char, row, col);
         
         // adjust next letter pos
         col++;
         if(col >= TEXTWIDTH) {
            col = 0;
            row++;
         }
      }

      // Return the next row, col
      return [row, col];
   }
}

// Text section object
class TextSection {
   constructor(grid, image_handler, div) {
      this.grid = grid;
      this.image_handler = image_handler;
      this.words = [];
      this.images = [];
      this.image_alts = [];

      // parse the div word-by-word. Handle links.
      // regex matches markdown links, markdown images, space-seperated words
      let div_elems = div.innerText.match(/(\\n)|(\([^)]+\)\[[^\]]+\])|((\[[^\]]+\]\([^)]+\)))|([^ ]+)/g);

      for(let word_text of div_elems) {
         // if is an a markdown link, get address and text
         let link = null;
         if(word_text.slice(0,1) == "(") {
            link = word_text.match(/\[[^\]]+\]/g)[0];
            link = link.slice(1, link.length - 1);
            word_text = word_text.match(/\([^)]+\)/g)[0];
            word_text = word_text.slice(1, word_text.length - 1);
         }

         // if it is an image, get address and add to section
         if(word_text.slice(0,1) == "[") {
            let alt = word_text.match(/\[[^\]]+\]/g);
            if(alt != null) {
               alt = alt[0].slice(1, alt[0].length - 1);
            }
            this.image_alts.push(alt);
            let url = word_text.match(/\([^)]+\)/g)[0];
            url = url.slice(1, url.length - 1);
            this.images.push(url);
         }

         // create and push the word
         else {
            let temp_word = new SectionWord(grid, word_text, link);
            this.words.push(temp_word);
         }
      }
   }

   // Returns true if this section has images, false otherwise
   contains_image() {
      return this.images.length != 0;   
   }

   // Prints this section to the grid at the given row.
   // Returns the row directly after this section
   print_to_grid(row) {
      let col = 0;
      for(let word of this.words) {
         let new_pos = word.print_to_grid(row, col);

         // adjust next position
         row = new_pos[0];
         col = new_pos[1];
         if(col != 0) {  // add space unless first word in row
            col++;
         }
      }

      // If first word in row, return current row, otherwise return next row
      if(col == 0) {
         return row ;
      }
      return row + 1;
   }

   print_images(row) {
      // Do nothing if there are no images
      if(!this.contains_image()) {
         return row;
      }

      let start_row = row;

      // Add the images to the image handler
      for(let i = 0; i < this.images.length; i++) {
         let link = this.images[i];
         let alt = this.image_alts[i];
         row = this.image_handler.add_image(link, alt, row);
      }

      // Draw the image bracket
      let col = GRIDWIDTH - 1;
      this.grid.set_char(new GridChar(UT, null), start_row, col);
      this.grid.set_char(new GridChar(LL, null), row - 1, col);
      for(let i = start_row + 1; i < row - 1; i++) {
         this.grid.set_char(new GridChar(VE, null), i, col);
      }

      return row;
   }
}

// Handles page-wide operations like animations
class Page {
   constructor(main, images, header) {
      // Build the image handler
      this.image_handler = new ImageHandler(images);
      this.header = header;
      
      // Build the grid and load the text sections from main
      this.grid = new Grid(main);
      this.text_sections = [];
      for(let child of main.children) {
         let temp_text_section = new TextSection(this.grid, this.image_handler, child);
         this.text_sections.push(temp_text_section);
      }

      // Print the text sections to the grid
      this.print_to_grid();

      // Try the SVD animation. If any step fails, render the page normally
      try {
         // Get the singular values of this grid
         let sv = this.grid.get_singular_values();
         this.U = sv.U;
         this.S = sv.S;
         this.V = sv.V;
         this.n = this.grid.get_rows();

         // Remove trailing 0s from S
         while(this.S[this.S.length - 1] == 0) {
            this.S.pop();
         }

         // resize U to size n x n
         this.U = resize_matrix(this.U, this.n, this.n);

         // transpose V, resize V to size d x d
         this.V = numeric.transpose(this.V);
         this.V = resize_matrix(this.V, GRIDWIDTH, GRIDWIDTH);

         // Quickly blit and unblit images to request resource load from browser
         this.image_handler.blit();
         this.image_handler.clear();
         this.image_handler.blit();

         // run svd animation on page load
         let start_i = Math.max(1, this.S.length - SVD_ANIMATION_FRAMES);
         this.animate_svd(this, start_i, 75, start_i);
      }
      catch (error) {
         // Blit the rendered screen without animation
         this.print_to_grid();
         this.grid.blit();
         this.image_handler.blit();
      }
   }

   // Prints all of the text sections to the grid
   print_to_grid() {
      this.grid.clear();
      this.image_handler.clear();

      let print_row = 0;
      for(let section of this.text_sections) {
         // For text sections (no image), print to the next open row
         if(!section.contains_image()) {
            print_row = section.print_to_grid(print_row) + 1;
         }

         // For image sections, print at either the next open image row or the
         // next text row, lowest row takes precedent.
         else {
            print_row = Math.max(this.image_handler.get_first_open_row() + 1, print_row);
            section.print_images(print_row);
            print_row = section.print_to_grid(print_row) + 1;
         }
      }

      // Print the header and footer
      header.innerHTML = HEADER_LOGO + HEADER_LINKS;
      footer.innerHTML = FOOTER_COPYRIGHT + FOOTER_MODIFY_PREF + new Date(document.lastModified).toDateString();
   }

   animate_svd(self, i, max_delay, start_i) {
      // Check for exit, base case run full print to grid
      if(i > self.S.length) {
         self.print_to_grid();
         self.grid.blit();
         self.image_handler.blit();
         return;
      }
      
      // limit S to an arbitrary numer of values
      let new_S = self.S.slice(0, i);
   
      // diagonalize S, resize to size n x d
      new_S = resize_matrix(numeric.diag(new_S), self.n, GRIDWIDTH);
   
      // Compute U * S * V
      let result = numeric.dot(numeric.dot(self.U, new_S), self.V);
   
      // Round values to nearest int
      result = round_matrix(result);
   
      // Load the result
      self.grid.set_grid_from_char_code(result);

      // Display the progress
      let progress_text = "Projecting singular values (" + i + "/" + self.S.length + "): "
      let progress_perc = (i - start_i) / (self.S.length - start_i);

      let bar_width = HEADER_WIDTH - 2 - progress_text.length;
      let bar_progress = Math.round(progress_perc * bar_width);
      let bar_text = new Array(bar_progress + 1).join('#');
      let newline_text = new Array(HEADER_HEIGHT + 1).join("<br/>")
      let header_text = "&nbsp;" + progress_text + bar_text + newline_text;
      self.header.innerHTML = header_text
   
      // Blit the grid
      self.grid.blit();
      
      // Calculate delay
      let delay = Math.round(progress_perc * max_delay);

      setTimeout(self.animate_svd, delay, self, i+1, max_delay, start_i); 
   }
}

let page = new Page(main, images, header);