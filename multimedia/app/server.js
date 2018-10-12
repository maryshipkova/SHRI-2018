const express = require('express');
const app = express();
const port = 3000;
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


    // `${timeFromStart.getHours()}:${timeFromStart.getMinutes()}:${timeFromStart.getSeconds()}`

    // timeFromStart.setHours(0,0,0,0);
    console.log(request.url);

    response.send(getFormatTime());

});

app.use((err, request, response, next) => {
    // логирование ошибки, пока просто console.log
    console.log(err);
    response.status(500).send('Something broke!');
})

app.listen(port);