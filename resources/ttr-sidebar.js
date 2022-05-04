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

// Handles sidebar operations such as retaining the current page and drawing the page tree
class Sidebar {
    constructor(sidebar_dom) {
       // Build the grid and load the text sections from main
       this.dom = sidebar_dom;
    }

    set_page_id(id) {
        // Sets the ID of the current page and draws the sidebar to screen
        this.page_id = id;
        this.draw();
    }

    get_page_html(id) {
        // Returns formatted html for a single page table entry, respectng the current active page id
        let name = "";
        let url = null;
        let output = "";
        
        if(id.length == 1) {
            name = PAGE_TREE[id[0]].name;
            url = PAGE_TREE[id[0]].url;
        }
        else if(id.length == 2) {
            name = PAGE_TREE[id[0]].children[id[1]].name;
            url = PAGE_TREE[id[0]].children[id[1]].url;
        }
        else {
            name = PAGE_TREE[id[0]].children[id[1]].children[id[2]].name;
            url = PAGE_TREE[id[0]].children[id[1]].children[id[2]].url;
        }

        output += "<span class=\"inline-mono\">";

        if(id.toString() == this.page_id.toString()) {
            output += "&gt;"
        }
        else {
            output += "&nbsp;"
        }

        output += "</span>"

        output += "&nbsp;".repeat(4 * id.length - 4);

        if (url != null) {
            output += "<a href=\"" + url + "\">";
        }

        output += name

        if (url != null) {
            output += "</a>";
        }

        output += "<br/>";

        return output;
        
    }

    draw() {
        // Draws the sidebar links into the sidebar
        let output = "";

        for(let a = 0; a < PAGE_TREE.length; a++) {
            if(PAGE_TREE[a].invisible && this.page_id[0] != a) {
                continue;
            }

            output += this.get_page_html([a]);

            for(let b = 0; b < PAGE_TREE[a].children.length; b++) {
                if(PAGE_TREE[a].children[b].invisible && this.page_id[1] != b) {
                    continue;
                }

                output += this.get_page_html([a, b]);

                for(let c = 0; c < PAGE_TREE[a].children[b].children.length; c++) {
                    if(PAGE_TREE[a].children[b].children[c].invisible && 
                        this.page_id[2] != c) {
                        continue;
                    }

                    output += this.get_page_html([a, b, c]);
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