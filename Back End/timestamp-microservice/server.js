/*
I can pass a string as a parameter, and it will check to see whether that string contains either a unix timestamp or a natural language date 
(example: January 1, 2016).

If it does, it returns both the Unix timestamp and the natural language form of that date.

If it does not contain a date or Unix timestamp, it returns null for those properties.
*/

var http = require("http");
var url = require("url");

var response = function(res, json) {
  res.writeHead(200, {"Content-Type": "application/json"});
  res.write(JSON.stringify(json));  //JSON.stringify(json)
  res.end();
}

var server = http.createServer(function(req, res) {
  var q = url.parse(req.url,true).pathname;
  var str = q.substring(1,q.len);
  var date_arr = str.split("%20");
  var json = {"unix": null, "natural": null};
  
  
  if (date_arr[0].length > 0 && date_arr.length== 1) {
    var date = new Date(parseInt(date_arr[0]));
    if (!isNaN(date)) {
      json["unix"] = parseInt(date_arr[0]);
      json["natural"] = date.toDateString();
    }
  } else if (date_arr.length == 3) {
    var date = new Date(date_arr.join(" "));
    if (!isNaN(date)) {
      json["unix"] = date.getTime();
      json["natural"] = date.toDateString();
    }
  }
  
  response(res, json);
  
});

server.listen(process.env.PORT);