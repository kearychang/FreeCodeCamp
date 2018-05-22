// server.js
// where your node app starts

// init project
//I can get the IP address, language and operating system for my browser.

var http = require("http");

var response = function(res, json) {
  res.writeHead(200, {"Content-Type": "application/json"});
  res.write(JSON.stringify(json));
  res.end();
}


var server = http.createServer(function(req, res) {
  var json = {"ipaddress": null, "language": null, "software": null};
  json["ipaddress"] = req.headers["x-forwarded-for"].split(",")[0];
  json["language"] = req.headers["accept-language"].split(",")[0];
  json["software"] = req.headers["user-agent"].split("(")[1].split(")")[0];
  response(res, json);
});

server.listen(process.env.PORT);