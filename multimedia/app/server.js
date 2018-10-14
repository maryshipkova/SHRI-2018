const express = require('express');
const app = express();
const port = 3000;
const fs =  require('fs');

let startTime = Date.now();
const CORRECT_TYPES = ['info', 'critical'];


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
                const REQUEST_TYPES = request.query.type.split(':');

                //type checking
                REQUEST_TYPES.forEach(type =>{
                    if( CORRECT_TYPES.indexOf(type) === -1){
                        response.status(400).send('incorrect type');
                        return;
                    }
                });

                response.json(filterEventsByType(JSON.parse(events), REQUEST_TYPES));
            }else{
                response.json(JSON.parse(events));
            }
        }
    });
});

//not found
app.get('*', function(request, response){
    response.status(404).send('<h1>Page not found</h1>');
})

app.listen(port);