// server.js
// where your node app starts

// init project
//I can get the IP address, language and operating system for my browser.

var http = require("http");
var url = require("url");
var shortindex_obj = {};
var i = 0;

var response = function(res, json, redirect, redirectUrl) {
  if (redirect) {
    res.writeHead(301, {"location" : redirectUrl});
  } else {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(json));
  }
  res.end();
}


var server = http.createServer(function(req, res) {
  var json = {"original_url": null, "short_url": null};
  var q = url.parse(req.url,true).pathname;
  var redirectFlag = false;
  var redirectUrl = "";
  if (q.substring(0,4) == "/new") {
    json["original_url"] = req.headers.host + q;
    json["short_url"] = req.headers.host + "/" + i;
    var getUrl = q.split("/")[2];
    if (getUrl.length < 8 || getUrl.substring(0,8) != "https://") {
      shortindex_obj[i] = "https://" + getUrl;
    } else {
      shortindex_obj[i] = q.split("/")[2];
    }
    i += 1;
  } else {
     if (shortindex_obj[parseInt(q.substring(1,q.length))] != undefined) {
       redirectFlag = true;
       redirectUrl = shortindex_obj[parseInt(q.substring(1,q.length))];
     } else {
       json = {};
       json["error"] = "not in database";
     }
  }
  response(res, json, redirectFlag, redirectUrl);
});

server.listen(process.env.PORT);