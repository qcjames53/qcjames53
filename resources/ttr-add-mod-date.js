let MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let date = new Date(document.lastModified);
document.getElementById("ttr-body-h1-sub").innerHTML += " | Updated: " + MONTHS[date.getMonth()] +
" " + date.getFullYear();