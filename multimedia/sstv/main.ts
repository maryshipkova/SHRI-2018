import {CANVAS} from "./Analyse";
import {ExpandedCamera} from "./ExpandedCamera";
import {IControls, ISstvSelectors, IVideoELement} from "./utils";

const CONTROLS: IControls = {
    brightness: document.querySelector("#input-brightness"),
    contrast: document.querySelector("#input-contrast"),

};
const SSTV_SELECTORS: ISstvSelectors = {
    closeBtn: document.querySelector("#close-btn"),
    sstvContainer: document.querySelector(".sstv__expanded"),
    videoContainers: document.querySelectorAll(".sstv__video__container"),
};

// class for holding videos info
class SSTVControl {
    private videoList: IVideoELement[];

    constructor(videoSelector: string) {

        this.videoList = [];

        // get videos from html
        document.querySelectorAll(videoSelector).forEach((video, num) => {
            const expandBtn = document.querySelectorAll(".sstv__btn-expand")[num];
            const videoElement: HTMLVideoElement | null = document.querySelector(`#video-${num + 1}`);
            this.videoList.push({
                id: num,
                element: videoElement ? videoElement : new HTMLVideoElement(),
                expandBtn,
            } as IVideoELement);
        });

        // saving additional info && adding click event to expand
        this.videoList.forEach((videoItem: IVideoELement) => {
            videoItem.boundingClientRect = videoItem.element.getBoundingClientRect();
            videoItem.expandBtn.addEventListener("click", (event) => {
                this._expandVideo(videoItem);
            });
        });
    }

    // init video opening
    private _expandVideo(videoItem: IVideoELement): void {
        const videoElement: IVideoELement = videoItem;
        const expandedCamera = new ExpandedCamera(videoElement, CONTROLS, SSTV_SELECTORS, CANVAS);
    }
}

const SSTVControlSystem = new SSTVControl(".sstv__video");
