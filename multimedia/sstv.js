// let video1 = document.querySelector('#video-1');
const CONTROLS = {
    'brightness':{
        view: document.querySelector('#input-brightness'),
        value:100
    },
    'contrast':{
        view: document.querySelector('#input-contrast'),
        value:100
    }
}

let videoList = [];
document.querySelectorAll('.sstv__video').forEach((video,num) =>{
    let expandBtn = document.querySelector(``);
    videoList.push({
        element:document.querySelector(`#video-${item}`),
        expandBtn:expandBtn
    });
    
    expandBtn.addEventListener('click', expandVideo);
});

function expandVideo(){
    let SSTVControlSystem = new SSTVControl(CONTROLS,this);

}
class SSTVControl{
    constructor(properties,video){
        this._properties = properties;
        this._video = video;
        this._closeBtn =  document.querySelector(`#close-btn`);
    }
}

