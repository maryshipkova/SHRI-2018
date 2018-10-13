const express = require('express');
const app = express();
const port = 3000;
const fs =  require('fs');
let startTime = Date.now();

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
app.get('/status', (request, response) => {
    response.send(getFormatTime());
});

app.get('/api/events', (request, response) => {

    fs.readFile('./events.json', function(err, events){
        if(err){
            console.error(err);
        }else{
            if(request.query.type){
                response.json(filterEventsByType(JSON.parse(events), request.query.type.split(':')));
            }else{
                response.json(JSON.parse(events));
            }
        }
    });
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('Something broke!');
})

app.listen(port);