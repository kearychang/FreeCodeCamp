'use strict';

var express = require('express');
var app = express();

function getDateString(date) {
    let options_date = {
        day: "numeric",
        month: "short",
        weekday: "short"
    };
    let options_clock = {
        year: "numeric",
        timeZone: "GMT",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short"
    };
    let str_date = date.toLocaleString("en-US", options_date);
    let str_clock = date.toLocaleString("en-US", options_clock);
    return str_date + " " + str_clock
}

app.get("/api/:unix([0-9]{4}-[0-1][0-9]-[0-3][0-9])", (req, res, next) => {
    let unix_time = req.params.unix;
    let date = new Date(unix_time);
    unix_time = date.getTime();
    res.json({"unix": unix_time, "utc": date.toUTCString()});
    next();
});

app.get("/api/:unix([0-9]+)", (req, res, next) => {
    let unix_time = req.params.unix;
    let date = new Date(parseInt(unix_time));
    res.json({"unix": unix_time, "utc": date.toUTCString()});
    next();
});

app.get("/", (req, res, next) => {
    res.end("done");
    next();
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })