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
let sidebar = document.getElementById("ttr-sidebar");

// Constants
// Page tree
// each entry is name, url, array of children
const PAGE_TREE = [
    {name:"Homepage", url:"/", invisible:false, children:[]},
    {name:"Debug Pages", url:null, invisible:true, children:[
        {name:"Debug Page", url:"/debug_page.html", invisible:false, children:[]},
        {name:"Template", url:"/template.html", invisible:false, children:[]},
        {name:"Lvl2", url:null, invisible:false, children:[
            {name:"Lvl3", url:null, invisible:false, children:[]}
        ]},
        {name:"Invisible", url:null, invisible:true, children:[]}
    ]},
    {name:"Projects", url:"/projects/", invisible:false, children:[
        {name:"MacPi", url:"/projects/macpi.html", invisible:false, children:[]}
    ]},
];

// Handles header-wide operations like animations
class Sidebar {
    constructor(sidebar_dom) {
       // Build the grid and load the text sections from main
       this.dom = sidebar_dom;
    }

    set_page_id(id) {
        this.page_id = id;
        this.draw();
    }

    draw() {
        let output = "";

        for(let a = 0; a < PAGE_TREE.length; a++) {
            if(PAGE_TREE[a].invisible && this.page_id[0] != a) {
                continue;
            }

            output += PAGE_TREE[a].name + "<br/>";

            for(let b = 0; b < PAGE_TREE[a].children.length; b++) {
                if(PAGE_TREE[a].children[b].invisible && this.page_id[1] != b) {
                    continue;
                }

                output += "&nbsp;".repeat(4) + PAGE_TREE[a].children[b].name + "<br/>";

                for(let c = 0; c < PAGE_TREE[a].children[b].children.length; c++) {
                    if(PAGE_TREE[a].children[b].children[c].invisible && 
                        this.page_id[2] != c) {
                        continue;
                    }

                    output += "&nbsp;".repeat(8) + PAGE_TREE[a].children[b].children[c].name + "<br/>";
                }
            }

            if(a < PAGE_TREE.length - 1) {
                output += "<br/>";
            }
        }

        this.dom.innerHTML = output;
    }
 }
 
 let sidebar_manager = new Sidebar(sidebar);