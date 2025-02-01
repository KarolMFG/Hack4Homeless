
// gives all elements of class 'logo' hyperlinking function to main page
// intended to be used on the h1s in the header of each subpage

// doesnt wait for domcontentloaded bc it is only loaded by script.js once that event has triggered anyway

const es = document.getElementsByClassName("logo")// elements
for(var i = 0; i < es.length; i++){
    es[i].addEventListener('click', function(){location.href="https://karolmfg.github.io/Hack4Homeless/index.html"})
}
