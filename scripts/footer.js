
// adds standardized footer
// so dont have to update each page individually

var footer = document.createElement('footer')
footer.innerHTML = 
`
    <p style="font-family:'Didot';font-size:medium" class="logo">Hack4Homeless</p>
    <p>Karol Grondelski & Amin Smith</p>
`

document.body.appendChild(footer)
