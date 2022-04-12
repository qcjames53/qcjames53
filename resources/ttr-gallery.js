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

// This script handles the display of image galleries on webpages

let galleries = document.getElementsByClassName("ttr-gallery");
let overlay_outer = document.getElementById("ttr-gallery-overlay-outer");
let overlay_inner = document.getElementById("ttr-gallery-overlay-inner");

// Handles the gallery generation on page load. Sets up the trendy stacking effect
for(let i = 0; i < galleries.length; i++) {
    let gallery = galleries[i];
    for(let j = 0; j < gallery.children.length; j++) {
        // Margin starting at 0% and increasing to 20% based on # of children
        let marginSize = (gallery.children.length - j - 1) * 20 / (gallery.children.length - 1);
        gallery.children[j].style.marginTop = marginSize / 8 + "%";
        gallery.children[j].style.marginLeft = marginSize + "%";
    }
}

// Handles opening a gallery in scroll view on click
function open_overlay(gallery) {
    overlay_inner.innerHTML = "";
    let gal_children = gallery.children;
    for(let i = gal_children.length - 1; i >= 0 ; i--) {
        img_src = gal_children[i].children[0].src;
        img_alt = gal_children[i].children[0].alt;
        overlay_inner.innerHTML += "<img src=\"" + img_src + "\" alt=\"" + img_alt + "\"/>"
    }

    overlay_outer.style.display = "block";
    overlay_inner.scrollTo(0,0);
}

// Closes the gallery overlay on click
function close_overlay() {
    overlay_outer.style.display = "none";
}