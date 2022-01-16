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
const DEFAULT_CHAR = ' ';

// HTML access variables
let main = document.getElementById("ttr");

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
      if(col < 0 || col > GRIDWIDTH) {
         throw "Getchar at col " + col + " out of current bounds."
      }
      return this.grid[row][col];
   }

   // Add a GridChar to the grid, extend if neccesary, filling with default char
   add_char(char, row, col) {
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
      if(col + this.text.length > GRIDWIDTH && this.text.length <= GRIDWIDTH) {
         row++;
         col = 0;
      }

      // Print to grid, with wrapping when hitting max col
      for(let char of this.text) {
         let temp_char = new GridChar(char, this.link);
         this.grid.add_char(temp_char, row, col);
         
         // adjust next letter pos
         col++;
         if(col >= GRIDWIDTH) {
            col = 0;
            row++;
         }
      }

      // Return the next row, col
      return [row, col];
   }
}

// Text section object
class textSection {
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

// Load the starting text
let grid = new Grid(main);
text_sections = [];
for(let child of main.children) {
   let temp_text_section = new textSection(grid, child);
   text_sections.push(temp_text_section);
}

// Print the text sections to the grid
print_row = 0;
for(let section of text_sections) {
   print_row = section.print_to_grid(print_row) + 1;
}

// Blit the grid
grid.blit();