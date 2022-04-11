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

function close_overlay() {
    overlay_outer.style.display = "none";
}