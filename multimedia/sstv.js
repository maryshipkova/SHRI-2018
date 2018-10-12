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

        this._videoList.forEach(videoItem => {
            videoItem.expandBtn.addEventListener('click', this._expandVideo.bind(videoItem));
        });

    }

    _expandVideo() {
        this._expandedCamera = new ExpandedCamera(this, CONTROLS, canvas);
    }

    closeVideo() {

        delete this._expandedCamera;
    }
}

class ExpandedCamera {
    constructor(video, properties, canvas) {
        this._video = video;
        this._properties = properties;
        this._canvas = canvas;
        this._closeBtn = document.querySelector(`#close-btn`);
        this._container = document.querySelector('.sstv__expanded');
        this._videoContainer = this._video.element.parentElement;
        this._analyser = new Analyse(this._video.element);
        this._eventsHandling();
        this._expand();
        this._analyser.draw();



    }
    _eventsHandling() {
        this._closeBtn.addEventListener('click', this._close.bind(this));
        this._properties.brightness.addEventListener('change', () => this._updateView());
        this._properties.contrast.addEventListener('change', () => this._updateView());
    }

    _updateView() {
        this._video.element.style.filter = `brightness(${this._properties.brightness.value}%) contrast(${this._properties.contrast.value}%)`;
    }

    _resetView() {
        this._video.element.style.filter = '';
        this._properties.brightness.value = 100;
        this._properties.contrast.value = 100;
        this._canvas.context.fillStyle = '#000000';
        this._canvas.context.fillRect(0, 0, this._canvas.element.width, this._canvas.element.height);
    }

    _expand() {
        this._videoContainer.removeChild(this._video.element);
        this._container.appendChild(this._video.element);
        this._video.element.muted = false;
        this._video.element.controls = true;
        this._video.element.play();


    }
    _close() {
        //TODO:
        // delete this._analyser; &&cancel animation frame
        this._resetView();
        this._container.removeChild(this._video.element);
        this._videoContainer.appendChild(this._video.element);
        this._video.element.muted = true;
        this._video.element.controls = false;
        this._video.element.play();
        SSTVControlSystem.closeVideo();
    }



}


class Analyse {
    constructor(videoElement) {

        let AudioContext = window.AudioContext || window.webkitAudioContext;

        //Создание источника
        this.video = videoElement;

        //Создаем аудио-контекст
        this.context = new AudioContext();
        this.node = this.context.createScriptProcessor(2048, 1, 1);
        //Создаем анализатор
        this.analyser = this.context.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.fftSize = 512;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        //    отправляем на обработку в  AudioContext 
        this.source = this.context.createMediaElementSource(this.video);
        //связываем источник и анализатором
        this.source.connect(this.analyser);
        //связываем анализатор с интерфейсом, из которого он будет получать данные
        this.analyser.connect(this.node);
        //Связываем все с выходом
        this.node.connect(this.context.destination);
        this.source.connect(this.context.destination);
        this.ifFilled = false;

    }


    draw() {

        requestAnimationFrame(() => this.draw());
        this.analyser.getByteFrequencyData(this.dataArray);

        let barHeight = average(this.dataArray);

        if (!this.ifFilled) {
            canvas.context.fillStyle = '#FF0000';
            canvas.context.fillRect(0, canvas.element.height - barHeight, canvas.element.width, barHeight);
        } else {
            canvas.context.fillStyle = '#000000';
            canvas.context.fillRect(0, 0, canvas.element.width, canvas.element.height);
        }


        this.ifFilled = !this.ifFilled;


    }
}

const CONTROLS = {
    'brightness': document.querySelector('#input-brightness'),
    'contrast': document.querySelector('#input-contrast')

}

let SSTVControlSystem = new SSTVControl('.sstv__video');

let canvasElement = document.getElementById("analyzer")
let canvas = {
    element: canvasElement,
    context: canvasElement.getContext("2d")
}

canvas.context.fillStyle = 'rgb(0, 0, 0)';
canvas.context.fillRect(0, 0, canvas.element.width, canvas.element.height);



const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;