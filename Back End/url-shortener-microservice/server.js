require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const express = require('express');
const cors = require('cors');
const app = express();

//DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.catch(error => console.log(error));;
mongoose.connection.on('error', err => {
  console.log(err);
});
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
const getCount = async function() {
  modelCounter.findOne({count: {$gte: 0}}, (err, data) => {
    if (err) console.log(err);
    if (data) {
      console.log(data.count);
      return data.count;
    } else {
      modelCounter.create([{count: 0}], (err, data) => {
        if (err) console.log(err);
        console.log("created counter document in mongodb");
      });
    }
  });
}

// Basic Configuration
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
  res.json({ error: "Invalid URL"});
});

// GET for REDIRECT to short URL
app.get('/api/shorturl/:number([0-9]+)', function(req, res) {
  let cacheNumber = req.params.number;
  modelCacheUrl.findOne({ cacheNumber: cacheNumber}, (err,cacheData) => {
    if (err) console.log(err);
    if (cacheData) {
      // Cache number exists, redirect there
      res.redirect(cacheData.url);
    } else {
      // Cache number DNE, 404
      res.status(404).send();
    }
  });
});

// POST
app.post('/api/shorturl', function(req, res) {
  //validate if URL is valid
  let url = req.body.url;
  try {
    let URL = new URL(url);
  } catch(e) {
    res.json({ error: "Invalid URL"}).send();
  }
  
  // Check for Mongo document with URL shortner
  modelCacheUrl.findOne({ url: url }, (err, urlData) => {
    if (err) console.log(err);
    if (urlData) {
      // Mongo document already exists, redirect and show JSON of cache number
      console.log("url already exists at /api/shorturl/" + urlData.cacheNumber);
      res.redirect('/api/shorturl/' + urlData.cacheNumber);
    } else {
      // Mongo document DNE, create document, then show JSON of cache number
      let currCount = await getCount();
      modelCounter.findOneAndUpdate({count: {$gte: 0}}, {count: currCount + 1}, (err, countData) => {
        if (err) console.log(err);
        if (countData) {
          await modelCacheUrl.create({ cacheNumber: currCount + 1, url: url });
          console.log("cached " + url + " at /api/shorturl/" + (currCount + 1))
          // res.redirect('/api/shorturl/' + (urlData.currCount + 1));
          res.json({"original_url": url, "short_url": currCount + 1});
        } else {
          throw new Error("counter document not found");
        }
      });
    }
  });
});