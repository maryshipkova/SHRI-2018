"use strict";
exports.__esModule = true;
var bodyParser = require("body-parser");
var express_1 = require("express");
var fs = require("fs");
var app = express_1["default"]();
var port = 8000;
var startTime = Date.now();
// const variables
var CORRECT_EVENT_TYPES = ["info", "critical"];
var EVENTS_FILE = "./events.json";
var EVENTS_PER_PAGE = 5;
app.use(bodyParser.json()); // support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
// returns date in format hh::mm::ss
function getFormatTime() {
    var millisecondsFromStart = Date.now() - startTime;
    var seconds = Math.round((millisecondsFromStart / 1000) % 60);
    var minutes = Math.round((millisecondsFromStart / (1000 * 60)) % 60);
    var hours = Math.round((millisecondsFromStart / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds;
}
function filterEventsByType(events, eventTypes) {
    return eventTypes ? events.filter(function (event) { return eventTypes.includes(event.type); }) : events;
}
// returns true if request types are correct
function validateRequestTypes(eventTypes) {
    return !eventTypes || eventTypes.every(function (type) { return CORRECT_EVENT_TYPES.includes(type); });
}
function getEventsbyPage(events, page) {
    return page ? events.slice((page - 1) * EVENTS_PER_PAGE, page * EVENTS_PER_PAGE) : events;
}
app.get("/status", function (request, response) {
    response.send(getFormatTime());
});
app.post("/api/events", function (request, response) {
    fs.readFile(EVENTS_FILE, function (err, data) {
        if (err) {
            console.error(err);
        }
        else {
            var EVENTS = JSON.parse(data.toString()).events;
            var REQUEST_EVENT_TYPES = request.body.type ? request.body.type.split(":") : null;
            var REQUEST_PAGE = request.body.page > 0 ? request.body.page : null;
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
app.get("*", function (request, response) {
    response.status(404).send("<h1>Page not found</h1>");
});
app.listen(port);
