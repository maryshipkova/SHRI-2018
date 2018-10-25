import {Analyse, resetCanvas} from "./Analyse";
import {IControls, ISstvSelectors, IVIdeoELement} from "./utils";

export class ExpandedCamera {
    private analyser: Analyse;
    private video: IVIdeoELement;
    private properties: IControls;
    private canvas: HTMLCanvasElement;
    private sstvSelectors: ISstvSelectors;

    constructor(video: IVIdeoELement, controls: IControls, sstvSelectors: ISstvSelectors, canvas: HTMLCanvasElement) {

        this.video = video;
        this.properties = controls;
        this.canvas = canvas;
        this.sstvSelectors = sstvSelectors;

        // web audio api analyser
        this.analyser = new Analyse(this.video.element);

        this._close = this._close.bind(this);

        this._eventsHandling();
        this._expand();
        this.analyser.draw();
    }

    // setting events listeners
    public _eventsHandling() {
        if (this.sstvSelectors.closeBtn) {
            this.sstvSelectors.closeBtn.addEventListener("click", this._close);
        }

        if (this.properties.brightness) {
            this.properties.brightness.addEventListener("change", () => this._updateView());
        }

        if (this.properties.contrast) {
            this.properties.contrast.addEventListener("change", () => this._updateView());
        }
    }

    // set filters for video
    public _updateView() {
        if (this.properties.contrast && this.properties.brightness) {
            this.video.element.style.filter = `brightness(${this.properties.brightness.value}%) contrast(${this.properties.contrast.value}%)`;
        }
    }

    // delete filters from video and set input ranges to initial values
    public _resetView() {
        this.video.element.style.filter = "";
        if (this.properties.brightness) {
            this.properties.brightness.value = "100";
        }
        if (this.properties.contrast) {
            this.properties.contrast.value = "100";
        }
        resetCanvas();
    }

    // delete video from parent node and add to popup node
    public _expand() {
        if (this.sstvSelectors.videoContainers) {
            this.sstvSelectors.videoContainers[this.video.id].removeChild(this.video.element);
        }
        if (this.sstvSelectors.sstvContainer) {
            this.sstvSelectors.sstvContainer.appendChild(this.video.element);
        }

        this._animateVideo();
        this.video.element.muted = false;
        this.video.element.controls = true;
        this.video.element.play();
    }

    // animation of expanding
    public _animateVideo() {
        if (!this.sstvSelectors.sstvContainer) {
            return;
        }
        const sstvBoundingRect = this.sstvSelectors.sstvContainer.getBoundingClientRect();


        this.sstvSelectors.sstvContainer.animate({
            opacity: [0.5, 1],
            transform: ['scale(0.5)', 'scale(1)']
        }, {
            duration: 200,
        });

        // this.sstvSelectors.sstvContainer.animate([
        //     { // from
        //         width: `${this.video.boundingClientRect.width}px`,
        //         height: `${this.video.boundingClientRect.height}px`,
        //         top: `${this.video.boundingClientRect.top}px`,
        //         left: `${this.video.boundingClientRect.left}px`,
        //     },
        //     { // to
        //         width: `${sstvBoundingRect.width}px`,
        //         height: `${sstvBoundingRect.height}px`,
        //         top: `${sstvBoundingRect.top}px`,
        //         left: `${sstvBoundingRect.left}px`,
        //     },
        // ], 200);
    }

    // delete video from popup and add to previous parent element then delete this class instance
    public _close() {
        this._resetView();
        if (this.sstvSelectors.closeBtn) {
            this.sstvSelectors.closeBtn.removeEventListener("click", this._close);
        }
        if (this.sstvSelectors.sstvContainer) {
            if (this.sstvSelectors.videoContainers) {
                this.sstvSelectors.videoContainers[this.video.id].appendChild(this.video.element);
            }
            if (this.sstvSelectors.sstvContainer.children.length) {
                this.sstvSelectors.sstvContainer.removeChild(this.sstvSelectors.sstvContainer.children[0]);
            }
        }

        this.analyser.isDrawing = false;
        this.video.element.muted = true;
        this.video.element.controls = false;
        this.video.element.play();

    }
}
