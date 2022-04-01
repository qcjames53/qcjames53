let galleries = document.getElementsByClassName("ttr-gallery");

for(let i = 0; i < galleries.length; i++) {
    let gallery = galleries[i];
    for(let j = 0; j < gallery.children.length; j++) {
        // Margin starting at 0% and increasing to 20% based on # of children
        let marginSize = (gallery.children.length - j - 1) * 20 / (gallery.children.length - 1);
        gallery.children[j].style.marginTop = marginSize / 8 + "%";
        gallery.children[j].style.marginLeft = marginSize + "%";
    }
}
