
// adds standardized footer
// so dont have to update each page individually

var footer = document.createElement('footer')
footer.innerHTML = 
`
    <p style="font-family:'Didot';font-size:medium" class="logo">Hack4Homeless</p>
    <p><span onclick="location.href='https://github.com/karolmfg'">Karol Grondelski</span> &amp; <span onclick="location.href='https://github.com/r128w'">Amin Smith</span></p>
`

document.body.appendChild(footer)
