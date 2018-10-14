//web audio api analyser
class Analyse {
	constructor(videoElement) {
		this.video = videoElement;

		//creating analyser
		this.node = context.createScriptProcessor(2048, 1, 1);
		this.analyser = context.createAnalyser();
		this.analyser.smoothingTimeConstant = 0.3;
		this.analyser.fftSize = 512;
		this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

		this.isDrawing = true;

		//prevent bugs with createMediaElementSource()
		if (!source) {
			source = context.createMediaElementSource(videoElement);
			SOURCES.set(videoElement,source);
		} else {
			if(SOURCES.get(videoElement)){
				source = SOURCES.get(videoElement);
			}else{
				const options = {
					mediaElement: videoElement,
				};
				source = new MediaElementAudioSourceNode(context, options);
				SOURCES.set(videoElement,source);
			}
        }
        
        //connections to audio source and destination
		source.connect(this.analyser);
		this.analyser.connect(this.node);
		this.node.connect(context.destination);
		source.connect(context.destination);
	}

    //drawing volume level on canvas
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
const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

// global source and context for preventing bugs with createMediaElementSource()
const context = new (window.AudioContext || window.webkitAudioContext)();
let source = 0;

//holds MediaElementAudioSourceNode for each video, prevent bugs with createMediaElementSource()
let SOURCES = new WeakMap();

//initial value of canvas element
function resetCanvas() {
	canvas.context.fillStyle = "#FFFFFF";
	canvas.context.fillRect(0, 0, canvas.element.width, canvas.element.height);
}

//displays volume level
const canvasElement = document.getElementById("analyzer");
let canvas = {
	element: canvasElement,
	context: canvasElement.getContext("2d"),
};
resetCanvas();

export {canvasElement as CANVAS,Analyse,resetCanvas};
