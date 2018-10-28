export interface IEventModel {
    [key: string]: object| string | null | undefined;
    type: string;
    title: string;
    source: string;
    time: string;
    icon: string;
    size: string;
    description?: string | null;
    data?: {
        type?: string;
        image?: string;
        temperature?: number,
        humidity?: number,
        albumcover?: string,
        artist?: string,
        track?: {
            name?: string,
            length?: string,
        },
        volume?: number,
        buttons?: string[],
    };

}
