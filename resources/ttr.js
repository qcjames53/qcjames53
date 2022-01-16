//    ████████╗████████╗██████╗ 
//    ╚══██╔══╝╚══██╔══╝██╔══██╗
//       ██║      ██║   ██████╔╝
//       ██║      ██║   ██╔══██╗
//       ██║      ██║   ██║  ██║
//       ╚═╝      ╚═╝   ╚═╝  ╚═╝   CHARACTER ENGINE
//    version 5.0                          
//    by Quinn James 
//
//    This project is libre, and licenced under the terms of the
//    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENCE, version 3.1,
//    as published by dtf on July 2019. See the COPYING file or
//    https://ph.dtf.wtf/w/wtfpl/#version-3-1 for more details.

// Constants
const GRIDWIDTH = 80;
const TEXTWIDTH = 78;
const DEFAULT_CHAR = ' ';

// HTML access variables
let main = document.getElementById("ttr");

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
            output += this.grid[row][col].char;
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
   constructor(grid, div) {
      this.words = [];

      // parse the div word-by-word. Handle links.
      // regex matches markdown links and space-seperated words
      let div_elems = div.innerHTML.match(/(\([^)]+\)\[[^\]]+\])|([^ ]+)/g);

      for(let word_text of div_elems) {
         // if is an a markdown link, get address and text
         let link = null;
         if(word_text.slice(0,1) == "(") {
            link = word_text.match(/\[[^\]]+\]/g)[0];
            link = link.slice(1, link.length - 1);
            word_text = word_text.match(/\([^)]+\)/g)[0];
            word_text = word_text.slice(1, word_text.length - 1);
         }

         // create and push the word
         let temp_word = new SectionWord(grid, word_text, link);
         this.words.push(temp_word);
      }
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
}

// Handles page-wide operations like animations
class Page {
   constructor(main) {
      // Build the grid and load the text sections from main
      this.grid = new Grid(main);
      this.text_sections = [];
      for(let child of main.children) {
         let temp_text_section = new TextSection(this.grid, child);
         this.text_sections.push(temp_text_section);
      }

      // Print the text sections to the grid
      this.print_to_grid();

      // Get the singular values of this grid
      let sv = this.grid.get_singular_values();
      this.U = sv.U;
      this.S = sv.S;
      this.V = sv.V;
      this.n = this.grid.get_rows();

      // resize U to size n x n
      this.U = resize_matrix(this.U, this.n, this.n);

      // transpose V, resize V to size d x d
      this.V = numeric.transpose(this.V);
      this.V = resize_matrix(this.V, GRIDWIDTH, GRIDWIDTH);

      // run svd animation on page load
      this.animate_svd(this, 1, 10);
   }

   // Prints all of the text sections to the grid
   print_to_grid() {
      let print_row = 0;
      for(let section of this.text_sections) {
         print_row = section.print_to_grid(print_row) + 1;
      }
   }

   animate_svd(self, i, delay) {
      // Check for exit, base case run full print to grid
      if(i > self.S.length) {
         self.print_to_grid();
         self.grid.blit();
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
   
      // Blit the grid
      self.grid.blit();
   
      setTimeout(self.animate_svd, delay, self, i+1, delay); 
   }
}

let page = new Page(main);