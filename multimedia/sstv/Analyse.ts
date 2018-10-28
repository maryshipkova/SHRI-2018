// web audio api analyser

export class Analyse {
    public isDrawing: boolean;
    private video: any;
    private node: ScriptProcessorNode;
    private analyser: AnalyserNode;
    private dataArray: Uint8Array;

    constructor(videoElement: HTMLMediaElement) {
        this.video = videoElement;

        // creating analyser
        this.node = context.createScriptProcessor(2048, 1, 1);
        this.analyser = context.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.fftSize = 512;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.isDrawing = true;

        // prevent bugs with createMediaElementSource()
        if (!source) {
            source = context.createMediaElementSource(videoElement);
            SOURCES.set(videoElement, source);
        } else {
            if (SOURCES.get(videoElement)) {
                source = SOURCES.get(videoElement);
            } else {
                const options = {
                    mediaElement: videoElement,
                };
                source = new MediaElementAudioSourceNode(context, options);
                SOURCES.set(videoElement, source);
            }
        }

        // connections to audio source and destination
        source.connect(this.analyser);
        this.analyser.connect(this.node);
        this.node.connect(context.destination);
        source.connect(context.destination);
    }

    // drawing volume level on canvas
    public draw(): void {
        if (!this.isDrawing) {
            return;
        }
        requestAnimationFrame(() => this.draw());
        this.analyser.getByteFrequencyData(this.dataArray);

        const barHeight = this.average(this.dataArray);

        resetCanvas();
        if (canvas.context) {
            canvas.context.fillStyle = "#FF0000";
            canvas.context.fillRect(0, canvas.element ? canvas.element.height - barHeight : 0,
                canvas.element ? canvas.element.width : 0, barHeight);
        }
    }

    private average(arr: Uint8Array): number {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }
}

// global source and context for preventing bugs with createMediaElementSource()
const context = new window.AudioContext();
let source: MediaElementAudioSourceNode;

// holds MediaElementAudioSourceNode for each video, prevent bugs with createMediaElementSource()
const SOURCES = new WeakMap();

// initial value of canvas element
export function resetCanvas() {
    if (canvas.context) {
        canvas.context.fillStyle = "#FFFFFF";
        canvas.context.fillRect(0, 0,
            canvas.element ? canvas.element.width : 0,
            canvas.element ? canvas.element.height : 0);
    }
}

// displays volume level
const canvasElement: HTMLCanvasElement = document.querySelector("#analyzer") as HTMLCanvasElement;
const canvas = {
    element: canvasElement,
    context: canvasElement.getContext("2d"),
};
resetCanvas();

export {canvasElement as CANVAS};
