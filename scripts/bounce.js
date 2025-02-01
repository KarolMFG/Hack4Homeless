
// makes ul elements bounce when hovered over


var els = document.getElementsByTagName('li')// elements
// console.log(els.length)

setTimeout(function(){// needs to be delayed or doesnt work??? idek

    // funky mouseover effect - buggyish but apparently not noticeable according to karol mf g
    for(var i = 0; i < els.length; i++){

        if(els[i].parentNode.parentNode.nodeName == "NAV"){continue} // dont apply to navbar, since horizontal disp. looks bad

        els[i].addEventListener('mouseover', function(){
            clearTimeout(this.currentTimer)
            iterate = () => {
                var cML = this.childNodes[0].style.marginLeft
                cML = Number(cML.substring(0, cML.length-2))
                if(cML%2 == 0){
                cML+=2
                }else{cML-=2}
                if(cML > 20){
                    cML-=1
                }
                if(cML<=1){cML=0}
                this.childNodes[0].style.marginLeft=cML + "px"
                if(cML!=0){
                    this.currentTimer=setTimeout(iterate, 10)
                }
            }
            this.currentTimer=setTimeout(iterate, 10)

            setTimeout(()=>{this.childNodes[0].style.marginLeft="0px"}, 1000)
        })
        els[i].addEventListener('mouseout', function(){
            clearTimeout(this.currentTimer)
            setTimeout(()=>{this.childNodes[0].style.marginLeft='0px'},100)
        })
    }
}, 100)

