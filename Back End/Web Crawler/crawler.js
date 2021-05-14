'use strict';
var https = require('https');
const { WorkerPool } = require('./workerpool.js');
const { isMainThread, parentPort } = require('worker_threads');

var Crawl = {
    alreadyVisited: {},
    host: null
};

function retrieveSite(url_str, ch) {
    var crawlUrl = new URL(url_str);
    var hostname = crawlUrl.hostname;
    Crawl.alreadyVisited[url_str] = true;
    
    //validate matching domain
    if (Crawl.host && hostname !== Crawl.host) {
        console.log("URL " + url_str + " does not share domain with " + hostname);
        return;
    }
    
    //visit url and find strings in body with same domain
    // console.log("Visiting " + url_str);
    https.get(url_str, (res) => {
        let body = '';
        res.on('data', (chunk) => {
            body += chunk.toString();
        });

        //escape URL and regex match domain, then append to a list
        res.on('end', () => {
            let hostEscaped = url_str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let hostRegex = new RegExp(hostEscaped + "[^\"]*", "g");
            let regexMatch = body.match(hostRegex);
            if (regexMatch) {
                let arr = [];
                for (let link of regexMatch) {
                    console.log("Found " + link);
                    arr.push(link);
                }
                ch.port1.postMessage(arr);
            }
        });

        res.on('error', (err) => {
            console.log(err.message);
        })
    });
}

function init(n, url_str) {
    var count = 1;
    const wp = new WorkerPool(n, 'crawler.js', true);
    let ch = wp.getChannel();
    let crawlUrl = new URL(url_str);
    Crawl.host = crawlUrl.hostname;
    ch.port2.on('message', (msg) => {
        if (msg instanceof Array) {
            for (let link of msg) {
                //check if site not already visited
                if (link in Crawl.alreadyVisited) {
                    console.log("URL " + link + " already visited");
                } else {
                    count++;
                    wp.runTask(retrieveSite(link, ch), (err, result) => {
                        console.log("Visited " + link);
                        if (err) console.log(err);
                        if (--count == 0) {
                            wp.close();
                            process.exit();
                        }
                    });
                }
            }
        }
    });
    wp.runTask(retrieveSite(url_str, ch), (err, res) => {
        if (err) console.log(err);
        count--;
        console.log("Visited " + url_str);
    });
}

if (!isMainThread) {
    parentPort.on('message', (task) => {
        parentPort.postMessage("");
    });
}

module.exports = {
    init
};