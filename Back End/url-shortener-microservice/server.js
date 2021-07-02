require('dotenv').config();
const url = require('url');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const express = require('express');
const cors = require('cors');
const app = express();

//DB setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(error => console.log(error));
mongoose.connection.on('error', err => {
  console.log(err);
});

//Schema and document setup
const cacheUrlSchema = new Schema({
  cacheNumber: {
    type : Number,
    required : true
  },
  url: {
    type : String,
    required : true
  }
});
var modelCacheUrl = mongoose.model("cacheUrl", cacheUrlSchema);
const counterSchema = new Schema({
  count: Number
});
var modelCounter = mongoose.model("counter", counterSchema);

//Express Middleware Setup
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use('/public', express.static(`${process.cwd()}/public`));
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

// GET for HOME PAGE
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// GET
app.get('/api/shorturl', function(req, res) {
  res.json({ error: "invalid url"});
});

// GET for REDIRECT to short URL
app.get('/api/shorturl/:number([0-9]+)', function(req, res) {
  let cacheNumber = req.params.number;
  modelCacheUrl.findOne({ cacheNumber: cacheNumber}, (err,cacheData) => {
    if (err) console.log(err);
    if (cacheData) {
      // Cache number exists, redirect there
      console.log("cache url is " + cacheData.url);
      res.redirect(cacheData.url);
    } else {
      // Cache number DNE, 404
      console.log("404 not found");
      res.status(404).send();
    }
  });
});

// POST
app.post('/api/shorturl', function(req, res) {
  //validate if URL is valid
  let urlStr = req.body.url;
  try {
    let reqURL = new URL(urlStr);
  } catch(e) {
    res.json({ error: "invalid url"});
    return;
  }
  
  // Check for Mongo document with URL shortner
  modelCacheUrl.findOne({ url: urlStr }, (err, urlData) => {
    if (err) console.log(err);
    if (urlData) {
      // Mongo document already exists, redirect and show JSON of cache number
      console.log("url already exists at /api/shorturl/" + urlData.cacheNumber);
      res.redirect('/api/shorturl/' + urlData.cacheNumber);
    } else {
      // Mongo document DNE, create document, then show JSON of cache number
      modelCounter.findOneAndUpdate({count: {$gte: 0}}, {$inc : {'count' : 1}}, (err, countData) => {
        if (err) console.log(err);
        if (countData) {
          var count = countData.count + 1; 
          modelCacheUrl.create({ cacheNumber: count, url: urlStr }, (err) => {
            if (err) {
              console.log(err);
            } else {
              res.json({"original_url": urlStr, "short_url": count});
              console.log("cached " + urlStr + " at /api/shorturl/" + count)
            }
          });
        } else {
          throw new Error("counter document not found");
        }
      });
    }
  });
});