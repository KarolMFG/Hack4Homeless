
// automatically loads all scripts as specified in toLoad below
// adds elements to the dom head

document.addEventListener('DOMContentLoaded', function(){
    var toLoad = ['logo.js', 'footer.js']// can add
    for(var i = 0; i < toLoad.length; i++){
        var script = document.createElement('script')
        script.type='text/javascript'
        script.src='https://karolmfg.github.io/Hack4Homeless/scripts/' + toLoad[i]
        script.innerText="/* auto */"
        document.head.appendChild(script)
    }
})
