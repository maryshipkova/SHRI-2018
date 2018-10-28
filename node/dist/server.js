"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs"));
const app = express_1.default();
const port = 8000;
const startTime = Date.now();
// const variables
const CORRECT_EVENT_TYPES = ["info", "critical"];
const EVENTS_FILE = "./events.json";
const EVENTS_PER_PAGE = 5;
app.use(bodyParser.json()); // support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true,
}));
// returns date in format hh::mm::ss
function getFormatTime() {
    const millisecondsFromStart = Date.now() - startTime;
    let seconds = Math.round((millisecondsFromStart / 1000) % 60);
    let minutes = Math.round((millisecondsFromStart / (1000 * 60)) % 60);
    let hours = Math.round((millisecondsFromStart / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds;
}
function filterEventsByType(events, eventTypes) {
    return eventTypes ? events.filter((event) => eventTypes.includes(event.type)) : events;
}
// returns true if request types are correct
function validateRequestTypes(eventTypes) {
    return !eventTypes || eventTypes.every((type) => CORRECT_EVENT_TYPES.includes(type));
}
function getEventsbyPage(events, page) {
    return page ? events.slice((page - 1) * EVENTS_PER_PAGE, page * EVENTS_PER_PAGE) : events;
}
app.get("/status", (request, response) => {
    response.send(getFormatTime());
});
app.post("/api/events", (request, response) => {
    fs.readFile(EVENTS_FILE, (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            const EVENTS = JSON.parse(data.toString()).events;
            const REQUEST_EVENT_TYPES = request.body.type ? request.body.type.split(":") : null;
            const REQUEST_PAGE = request.body.page > 0 ? request.body.page : null;
            if (validateRequestTypes(REQUEST_EVENT_TYPES)) {
                response.json({ events: getEventsbyPage(filterEventsByType(EVENTS, REQUEST_EVENT_TYPES), REQUEST_PAGE) });
            }
            else {
                response.status(400).send("incorrect type");
                return;
            }
        }
    });
});
// not found
app.get("*", (request, response) => {
    response.status(404).send("<h1>Page not found</h1>");
});
app.listen(port);
