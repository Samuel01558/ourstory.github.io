function changeColor() {
    var element = event.target;
    
    if (element.style.color === 'black'){
        element.style.color = 'red'
        element.style.fontVariationSettings = "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48";
    } 
    else {
        element.style.color='black'
        element.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48";
    }
}

function likeColor() {
    var element = event.target;
    
    if (element.style.color === 'black'){
        element.style.color = 'blue'
        element.style.fontVariationSettings = "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48";
    } 
    else {
        element.style.color='black'
        element.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48";
    }
}
  