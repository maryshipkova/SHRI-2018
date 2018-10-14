const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");


const app = express();
const port = 3000;


let startTime = Date.now();
const CORRECT_TYPES = ["info", "critical"];
const EVENTS_FILE = "./events.json";
//returns date in format hh::mm::ss
function getFormatTime() {

	let millisecondsFromStart = Date.now() - startTime;

	let seconds = parseInt((millisecondsFromStart / 1000) % 60),
		minutes = parseInt((millisecondsFromStart / (1000 * 60)) % 60),
		hours = parseInt((millisecondsFromStart / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return hours + ":" + minutes + ":" + seconds;

}

function filterEventsByType(requestEvents, requestEventTypes){
	
	let filteredEvents = requestEvents.events.filter(event => {
		if(requestEventTypes.indexOf(event.type) !== -1){
			return true;
		}
		return false;
	});

	return filteredEvents;

}

//returns true if request types are correct 
function validateRequestTypes(REQUEST_TYPES){
	let isCorrect = true;
	REQUEST_TYPES.forEach(type =>{
		if( CORRECT_TYPES.indexOf(type) === -1){
			isCorrect = false;
			return;
		}
	});
	return isCorrect;
}

app.use( bodyParser.json() );       // support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // support URL-encoded bodies
	extended: true
})); 


app.get("/status", (request, response) => {
	response.send(getFormatTime());
});



app.post("/api/events",  (request, response) => {
	const stream = new fs.ReadStream(EVENTS_FILE);
	stream.on("readable", function(){
		let events = stream.read();

		// readeble returns null
		if(request.body.type && events != null){
			const REQUEST_TYPES = request.body.type.split(":");

			if(validateRequestTypes(REQUEST_TYPES) === true){
				response.json( {"events":filterEventsByType(JSON.parse(events), REQUEST_TYPES)});
			}else{
				response.status(400).send("incorrect type");
			}
		}else{
			if(events != null)
				response.json(JSON.parse(events));
		}
	});
});

//not found
app.get("*", function(request, response){
	response.status(404).send("<h1>Page not found</h1>");
});

app.listen(port);