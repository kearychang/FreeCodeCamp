'use strict';
var crawler = require('./crawler.js');

//arg1 path of node installation (always present)
//arg2 path of this file (always present)
//arg3 -n
//arg4 number of workers
//arg5 url of website to crawl
function main() {
    try {
        let args = process.argv;
        if (args.length != 5) {
            throw Error("too few arg");
        }
        if (args[2] !== "-n") {
            throw Error("expected first argument -n");
        }
        if (!Number.isInteger(parseInt(args[3])) && args[3] >= 1) {
            throw Error("expected second argument integer");
        }
        console.log("Starting webcrawler...");
        crawler.init(args[3], args[4]);
    } catch (error) {
        console.log(error.message);
    }
}

main();