const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');


const app = express();
const port = 8000;


let startTime = Date.now();

//const variables
const CORRECT_EVENT_TYPES = ['info', 'critical'];
const EVENTS_FILE = './events.json';
const EVENTS_PER_PAGE = 5;

app.use(bodyParser.json());       // support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // support URL-encoded bodies
	extended: true
}));

//returns date in format hh::mm::ss
function getFormatTime() {

	let millisecondsFromStart = Date.now() - startTime;

	let seconds = parseInt((millisecondsFromStart / 1000) % 60),
		minutes = parseInt((millisecondsFromStart / (1000 * 60)) % 60),
		hours = parseInt((millisecondsFromStart / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? '0' + hours : hours;
	minutes = (minutes < 10) ? '0' + minutes : minutes;
	seconds = (seconds < 10) ? '0' + seconds : seconds;

	return hours + ':' + minutes + ':' + seconds;

}

function filterEventsByType(events, eventTypes) {
	return events ? events.filter(event => eventTypes.includes(event.type)) : events;

}

//returns true if request types are correct 
function validateRequestTypes(eventTypes) {
	return eventTypes.every(type => CORRECT_EVENT_TYPES.includes(type));
}

function getEventsbyPage(events, page) {
	return page ? events.slice((page - 1) * EVENTS_PER_PAGE, page * EVENTS_PER_PAGE) : events;
}

app.get('/status', (request, response) => {
	response.send(getFormatTime());
});


app.post('/api/events', (request, response) => {

	fs.readFile(EVENTS_FILE, function (err, data) {
		if (err) {
			console.error(err);
		} else {
			const EVENTS = JSON.parse(data).events,
				REQUEST_EVENT_TYPES = request.body.type ? request.body.type.split(':') : null,
				REQUEST_PAGE = request.body.page ? (request.body.page > 0 ? request.body.page : null) : null;

			if (validateRequestTypes(REQUEST_EVENT_TYPES)) {
				response.json({'events': getEventsbyPage(filterEventsByType(EVENTS, REQUEST_EVENT_TYPES), REQUEST_PAGE)});
			}
			else {
				response.status(400).send('incorrect type');
				return;
			}
		}
	});
});

//not found
app.get('*', function (request, response) {
	response.status(404).send('<h1>Page not found</h1>');
});

app.listen(port);