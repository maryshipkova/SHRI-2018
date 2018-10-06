const element = document.querySelectorAll('.card__data__image--img')[1];
const zoomField = document.querySelectorAll('.settings--zoom')[1];
const brightnessField = document.querySelectorAll('.settings--brightness')[1];

let transformProperties = {
    'translateX': 0,
    'translateY': 0,
    'scale': 1.0,
    'brightness': 100
}

console.log(element.style);

//reset settings
zoomField.addEventListener('touchstart', (event)=>{
    updateProterty('translateX', 0);
    updateProterty('translateY', 0);
    updateProterty('scale', 1.0);
    zoomField.innerHTML = 100;
});

brightnessField.addEventListener('touchstart', (event)=>{
    brightnessField.innerHTML = 100;
});

function updateProterty(property, value) {
    transformProperties[property] = value;
    element.style.transform = `translateX(${transformProperties.translateX}%) translateY(${transformProperties.translateY}%) scale(${transformProperties.scale})`;
    element.style.filter = `brightness(${transformProperties.brightness}%)`;
}

function handleRotation(eventRotation){
    if(!element.dataset.prevRotation){
        element.dataset.prevRotation = eventRotation;
        return;
    }
    if (Math.abs(eventRotation - element.dataset.prevRotation) > 3 ) {
        updateProterty('brightness', (element.dataset.prevRotation < eventRotation) ? transformProperties.brightness + 2 : transformProperties.brightness - 2);
        element.dataset.prevRotation = eventRotation;
        brightnessField.innerHTML = transformProperties.brightness;
    }
}
element.addEventListener('gesturechange', (event) => {
    handleRotation(event.rotation);
    if(event.scale > 1.0){
        updateProterty('scale', event.scale);
        zoomField.innerHTML = (event.scale*100).toPrecision(3);
    }


});

element.addEventListener('touchstart', (event) => {
    element.dataset.prevX = '';
    element.dataset.prevY = '';
    element.dataset.prevRotation = '';
});

element.addEventListener('touchmove', (event) => {
    event.preventDefault();
    if (event.touches.length === 1 && transformProperties.scale > 1.0) {
        let clientX = event.touches[0].clientX;
        let clientY = event.touches[0].clientY;
        if(!element.dataset.prevX || ! element.dataset.prevY){
            element.dataset.prevX = clientX;
            element.dataset.prevY = clientY;
            return;
        }
        if (Math.abs(clientX - element.dataset.prevX) > 3 ) {
            updateProterty('translateX', (element.dataset.prevX < clientX) ? transformProperties.translateX + 2 : transformProperties.translateX - 2);
            element.dataset.prevX = clientX;
        }
        if (Math.abs(clientY - element.dataset.prevY) > 3 ) {
            updateProterty('translateY', (element.dataset.prevY < clientY) ? transformProperties.translateY + 2 : transformProperties.translateY - 2);
            element.dataset.prevY = clientY;
        }

    }

});