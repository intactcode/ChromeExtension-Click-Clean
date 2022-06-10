// Extension by BrowserNative apps@browsernative.com https://browsernative.com/click-and-clean-chrome-extension/

$(window).on('load', function() {
    let whitelist = localStorage.getItem("whitelist");
    if(whitelist) whitelist = whitelist.split(",");
    else whitelist = [];
    for(i=0; i<whitelist.length; i++){
        document.getElementById(whitelist[i]).checked = false;
    }
});

whitelist = localStorage.getItem("whitelist");
if(whitelist) whitelist = whitelist.split(",");
else whitelist = [];

$(document).on('change', "input", function() {
    if(!this.checked) {
        whitelist.push(this.id);
    }
    else if(this.checked) {
        var index = whitelist.indexOf(this.id);
        if (index > -1) whitelist.splice(index, 1);
    }
    localStorage.setItem("whitelist", whitelist);
});