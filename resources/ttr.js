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

// HTML access variables
var main = document.getElementById("ttr");

// Load the starting text
main_elements = [];
for(let child of main.children) {
   main_elements.push(child);
}

console.log(main_elements);