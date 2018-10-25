export interface IVIdeoELement {
    expandBtn: Element;
    boundingClientRect: ClientRect | DOMRect;
    id: number;
    element: HTMLVideoElement;
}

export interface IControls {
    brightness: HTMLInputElement | null;
    contrast: HTMLInputElement | null;
}
export interface ISstvSelectors {
    closeBtn: HTMLButtonElement | null;
    sstvContainer: HTMLDivElement | null;
    videoContainers: NodeListOf<Element> | null;
}
