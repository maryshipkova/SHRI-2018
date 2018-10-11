const CONTROLS = {
    'brightness': document.querySelector('#input-brightness'),
    'contrast' :document.querySelector('#input-contrast')
    
}


class SSTVControl {
    constructor(videoSelector) {

        this._videoList = [];
        document.querySelectorAll(videoSelector).forEach((video, num) => {
            let expandBtn = document.querySelectorAll(`.sstv__btn-expand`)[num];
            this._videoList.push({
                element: document.querySelector(`#video-${num+1}`),
                expandBtn: expandBtn,
            });
        });

        this._videoList.forEach(videoItem=>{
            videoItem.expandBtn.addEventListener('click', this._expandVideo.bind(videoItem));
        });
      
    }

    _expandVideo() {
        this._expandedCamera = new ExpandedCamera(CONTROLS, this);
    }
    closeVideo(){
        delete this._expandedCamera;
    }
}
class ExpandedCamera {
    constructor(properties, video) {
        this._properties = properties;
        this._video = video;
        this._closeBtn = document.querySelector(`#close-btn`);
        this._container = document.querySelector('.sstv__expanded');
        this._videoContainer = this._video.element.parentElement;
        this._eventsHandling();
        this._expand();
    }
    _eventsHandling(){
        this._closeBtn.addEventListener('click', this._close.bind(this));
        this._properties.brightness.addEventListener('change',()=>this._updateView());
        this._properties.contrast.addEventListener('change',()=>this._updateView());
    }

    _updateView(){
        this._video.element.style.filter = `brightness(${this._properties.brightness.value}%) contrast(${this._properties.contrast.value}%)`;
        console.log ( this._properties.contrast.value, this._video.element);
    }
    _resetView(){
        this._video.element.style.filter='';
        this._properties.brightness.value = 100;
        this._properties.contrast.value = 100;
    }

    _expand(){
        this._videoContainer.removeChild(this._video.element);
        this._container.appendChild(this._video.element);
        this._video.element.play();
    }
    _close(){
        this._resetView();
        this._container.removeChild(this._video.element);
        this._videoContainer.appendChild(this._video.element);
        this._video.element.play();
        SSTVControlSystem.closeVideo();
    }
}

let SSTVControlSystem = new SSTVControl('.sstv__video');