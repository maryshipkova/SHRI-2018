const element = document.querySelector('#image');
console.log('event')
element.addEventListener('gesturestart', (event)=>{
    console.log(event)
});

element.addEventListener('touchstart', (event)=>{
    console.log(event)
});