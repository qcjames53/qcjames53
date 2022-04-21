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

// HTML access variables
let header = document.getElementById("ttr-header");

function center_start(text_len, start, end) {

}

// Handles header-wide operations like animations
class Header {
    constructor(header_dom) {
       // Build the grid and load the text sections from main
       this.grid = new Grid(header_dom);
       this.draw();
       this.grid.blit();
 
       // // Try the SVD animation. If any step fails, render the page normally
       // try {
       //    // Get the singular values of this grid
       //    let sv = this.grid.get_singular_values();
       //    this.U = sv.U;
       //    this.S = sv.S;
       //    this.V = sv.V;
       //    this.n = this.grid.get_rows();
 
       //    // Remove trailing 0s from S
       //    while(this.S[this.S.length - 1] == 0) {
       //       this.S.pop();
       //    }
 
       //    // resize U to size n x n
       //    this.U = resize_matrix(this.U, this.n, this.n);
 
       //    // transpose V, resize V to size d x d
       //    this.V = numeric.transpose(this.V);
       //    this.V = resize_matrix(this.V, GRIDWIDTH, GRIDWIDTH);
 
       //    // Quickly blit and unblit images to request resource load from browser
       //    this.image_handler.blit();
       //    this.image_handler.clear();
       //    this.image_handler.blit();
 
       //    // run svd animation on page load
       //    let start_i = Math.max(1, this.S.length - SVD_ANIMATION_FRAMES);
       //    this.animate_svd(this, start_i, 75, start_i);
       // }
       // catch (error) {
       //    // Blit the rendered screen without animation
       //    this.print_to_grid();
       //    this.grid.blit();
       // }
    }
 
    // Resizes the grid to the current header size
    resize() {
       this.grid.resize();
       this.draw();
       this.grid.blit();
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

    draw() {
        this.title_simple();
    }

    title_simple() {
        let text = "[Quinn James Online]";
        let row = Math.floor(this.grid.get_rows() / 2) - 1;
        let col = Math.floor(this.grid.get_cols() / 2 - text.length / 2) - 1;
        this.grid.draw_text(text, row, col);
    }
 }
 
 let header_manager = new Header(header);
 
 // Handle resizing window
 let header_resize_timeout;
 window.onresize = function() {
    clearTimeout(header_resize_timeout);
    header_resize_timeout = setTimeout(header_resize2, 500);
 }
 
 function header_resize2 () {
    header_manager.resize();
 }