import {resetCanvas, Analyse} from "./Analyse.js";

class ExpandedCamera {
	constructor(video, properties, sstvSelectors, canvas) {

		this._video = video;
		this._properties = properties;
		this._canvas = canvas;
		this._sstvSelectors = sstvSelectors;

		//web audio api analyser
		this._analyser = new Analyse(this._video.element);

		this._close = this._close.bind(this);

		this._eventsHandling();
		this._expand();
		this._analyser.draw();
	}

	//setting events listeners
	_eventsHandling() {

		this._sstvSelectors.closeBtn.addEventListener("click", this._close);
		this._properties.brightness.addEventListener("change", () => this._updateView());
		this._properties.contrast.addEventListener("change", () => this._updateView());
	}

	//set filters for video
	_updateView() {
		this._video.element.style.filter = `brightness(${this._properties.brightness.value}%) contrast(${this._properties.contrast.value}%)`;
	}

	//delete filters from video and set input ranges to initial values
	_resetView() {
		this._video.element.style.filter = "";
		this._properties.brightness.value = 100;
		this._properties.contrast.value = 100;
		resetCanvas();
	}

	//delete video from parent node and add to popup node
	_expand() {
		this._sstvSelectors.videoContainers[this._video.id].removeChild(this._video.element);
		this._sstvSelectors.sstvContainer.appendChild(this._video.element);
		
		this._animateVideo();
		this._video.element.muted = false;
		this._video.element.controls = true;
		this._video.element.play();
	}

	//animation of expanding
	_animateVideo() {
		const sstvBoundingRect = this._sstvSelectors.sstvContainer.getBoundingClientRect();

		this._sstvSelectors.sstvContainer.animate([
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

	//delete video from popup and add to previous parent element then delete this class instance
	_close() {
		this._resetView();
		this._sstvSelectors.closeBtn.removeEventListener("click", this._close);
		this._sstvSelectors.videoContainers[this._video.id].appendChild(this._video.element);
		if (this._sstvSelectors.sstvContainer.children.length) this._sstvSelectors.sstvContainer.removeChild(this._sstvSelectors.sstvContainer.children[0]);
		
		this._analyser.isDrawing = false;
		this._video.element.muted = true;
		this._video.element.controls = false;
		this._video.element.play();ß
	}
}

export {ExpandedCamera};