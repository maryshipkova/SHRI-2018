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

app.get('/status', (request, response) => {
    response.send(getFormatTime());
});

app.get('/api/events', (request, response) => {

    let events =' JSON.parse(data)';
    fs.readFile('./events.json', function(err, data){
        if(err){
            console.error(err);
        }else{
            let events = JSON.parse(data);
            // console.log(JSON.parse(data));
            // response.send(events);
            response.send(events);
        }
    });
    console.log('ok');
    // response.send(events);
});

app.use((err, request, response, next) => {
    // логирование ошибки, пока просто console.log
    console.log(err);
    response.status(500).send('Something broke!');
})

app.listen(port);