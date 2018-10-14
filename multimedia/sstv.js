class SSTVControl {
	constructor(videoSelector) {
		this._videoList = [];
		document.querySelectorAll(videoSelector).forEach((video, num) => {
			const expandBtn = document.querySelectorAll(".sstv__btn-expand")[num];
			this._videoList.push({
				id: num,
				element: document.querySelector(`#video-${num + 1}`),
				expandBtn,
			});
		});

		this._videoList.forEach((videoItem) => {
			videoItem.boundingClientRect = videoItem.element.getBoundingClientRect();
			videoItem.expandBtn.addEventListener("click", this._expandVideo.bind(videoItem));
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
		this._analyser = new Analyse(this._video.element);
		this._eventsHandling();
		this._expand();
		this._analyser.draw();
	}

	_eventsHandling() {
		SSTVSELECTORS.closeBtn.addEventListener("click", this._close.bind(this));
		this._properties.brightness.addEventListener("change", () => this._updateView());
		this._properties.contrast.addEventListener("change", () => this._updateView());
	}

	_updateView() {
		this._video.element.style.filter = `brightness(${this._properties.brightness.value}%) contrast(${this._properties.contrast.value}%)`;
	}

	_resetView() {
		this._video.element.style.filter = "";
		this._properties.brightness.value = 100;
		this._properties.contrast.value = 100;
		resetCanvas();
	}

	_expand() {
		SSTVSELECTORS.videoContainers[this._video.id].removeChild(this._video.element);
		SSTVSELECTORS.sstvContainer.appendChild(this._video.element);
		this._animateVideo();
		this._video.element.muted = false;
		this._video.element.controls = true;
		this._video.element.play();
	}

	_animateVideo() {
		const sstvBoundingRect = SSTVSELECTORS.sstvContainer.getBoundingClientRect();

		SSTVSELECTORS.sstvContainer.animate([
			{ // from
				width: `${this._video.boundingClientRect.width}px`,
				height: `${this._video.boundingClientRect.height}px`,
				top: `${this._video.boundingClientRect.top}px`,
				left: `${this._video.boundingClientRect.left}px`,
			},
			{ // to
				width: `${sstvBoundingRect.width}px`,
				height: `${sstvBoundingRect.height}px`,
				top: `${sstvBoundingRect.top}px`,
				left: `${sstvBoundingRect.left}px`,
			},
		], 200);
	}

	_close() {
		this._resetView();
		SSTVSELECTORS.closeBtn.removeEventListener("click", this._close.bind(this));
		this._analyser.isDrawing = false;
		SSTVSELECTORS.videoContainers[this._video.id].appendChild(this._video.element);
		if (SSTVSELECTORS.sstvContainer.children.length) SSTVSELECTORS.sstvContainer.removeChild(SSTVSELECTORS.sstvContainer.children[0]);
		this._video.element.muted = true;
		this._video.element.controls = false;
		this._video.element.play();
		SSTVControlSystem.closeVideo();
	}
}
const context = new (window.AudioContext || window.webkitAudioContext)();
let source = 0;
let sources = new WeakMap();
class Analyse {
	constructor(videoElement) {
		this.video = videoElement;

		this.node = context.createScriptProcessor(2048, 1, 1);
		this.analyser = context.createAnalyser();
		this.analyser.smoothingTimeConstant = 0.3;
		this.analyser.fftSize = 512;
		this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
		this.isDrawing = true;

		if (!source) {
			source = context.createMediaElementSource(videoElement);
			sources.set(videoElement,source);
		} else {
			if(sources.get(videoElement)){
				source = sources.get(videoElement);
			}else{
				const options = {
					mediaElement: videoElement,
				};
				source = new MediaElementAudioSourceNode(context, options);
				sources.set(videoElement,source);
			}
		}
		source.connect(this.analyser);
		this.analyser.connect(this.node);
		this.node.connect(context.destination);
		source.connect(context.destination);
	}


	draw() {
		if (!this.isDrawing) {
			return;
		}
		requestAnimationFrame(() => this.draw());
		this.analyser.getByteFrequencyData(this.dataArray);

		const barHeight = average(this.dataArray);

		resetCanvas();
		canvas.context.fillStyle = "#FF0000";
		canvas.context.fillRect(0, canvas.element.height - barHeight, canvas.element.width, barHeight);
	}
}
function resetCanvas() {
	canvas.context.fillStyle = "#FFFFFF";
	canvas.context.fillRect(0, 0, canvas.element.width, canvas.element.height);
}

const CONTROLS = {
	brightness: document.querySelector("#input-brightness"),
	contrast: document.querySelector("#input-contrast"),

};
const SSTVSELECTORS = {
	closeBtn: document.querySelector("#close-btn"),
	sstvContainer: document.querySelector(".sstv__expanded"),
	videoContainers: document.querySelectorAll(".sstv__video__container"),
};

let SSTVControlSystem = new SSTVControl(".sstv__video");

const canvasElement = document.getElementById("analyzer");
let canvas = {
	element: canvasElement,
	context: canvasElement.getContext("2d"),
};

resetCanvas();


const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
