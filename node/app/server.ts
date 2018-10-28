import * as bodyParser from "body-parser";
import express from "express";
import * as fs from "fs";
import {IEventModel} from "./IEventModel";

const app: express.Application = express();
const port = 8000;

const startTime = Date.now();

// const variables
const CORRECT_EVENT_TYPES = ["info", "critical"];
const EVENTS_FILE = "./events.json";
const EVENTS_PER_PAGE = 5;

app.use(bodyParser.json());       // support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // support URL-encoded bodies
    extended: true,
}));

// returns date in format hh::mm::ss
function getFormatTime(): string {

    const millisecondsFromStart: number | string = Date.now() - startTime;

    let seconds: number | string = Math.round((millisecondsFromStart / 1000) % 60);
    let minutes: number | string = Math.round((millisecondsFromStart / (1000 * 60)) % 60);
    let hours: number | string = Math.round((millisecondsFromStart / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;

}

function filterEventsByType(events: IEventModel[], eventTypes: string[]) {
    return eventTypes ? events.filter((event) => eventTypes.includes(event.type)) : events;

}

// returns true if request types are correct
function validateRequestTypes(eventTypes: string[]): boolean {
    return !eventTypes || eventTypes.every((type) => CORRECT_EVENT_TYPES.includes(type));
}

function getEventsbyPage(events: IEventModel[], page: number) {
    return page ? events.slice((page - 1) * EVENTS_PER_PAGE, page * EVENTS_PER_PAGE) : events;
}

app.get("/status", (request: express.Request, response: express.Response) => {
    response.send(getFormatTime());
});

app.post("/api/events", (request: express.Request, response: express.Response) => {

    fs.readFile(EVENTS_FILE, (err: Error, data: Buffer) => {
        if (err) {
            console.error(err);
        } else {
            const EVENTS: IEventModel[] = JSON.parse(data.toString()).events;
            const REQUEST_EVENT_TYPES: string[] = request.body.type ? request.body.type.split(":") : null;
            const REQUEST_PAGE: number = request.body.page > 0 ? request.body.page : null;

            if (validateRequestTypes(REQUEST_EVENT_TYPES)) {
                response.json({events: getEventsbyPage(filterEventsByType(EVENTS, REQUEST_EVENT_TYPES), REQUEST_PAGE)});
            } else {
                response.status(400).send("incorrect type");
                return;
            }
        }
    });
});

// not found
app.get("*", (request: express.Request, response: express.Response) => {
    response.status(404).send("<h1>Page not found</h1>");
});

app.listen(port);
