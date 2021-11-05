require('dotenv').config();
const url = require('url');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());

//DB setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(error => console.log(error));
mongoose.connection.on('error', err => {
  console.log(err);
});

//Schema and document setup
const exerciseSchema = new Schema({
  description: {
    type: String,
    required: [true, "Path 'description' is required."]
  },
  duration: {
    type: Number,
    required: [true, "Path 'duration' is required."]
  },
  date: {
    type: Date,
    required: [true, "Path 'date' is required."]
  }
});
const usernameSchema = new Schema({
  username: {
    type : String,
    required : true
  },
  exercises: [exerciseSchema]
});
var modelUsername = mongoose.model("username", usernameSchema);

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

//GET for EXERCISE
app.get('/api/users/:_id/logs?', function(req, res) => {
// TO DO
});

//Create a new username if it doesn't already exist
app.post('/api/adduser', function(req, res) {
  let usernameStr = req.body.username;
  modelUsername.findOne({ "username": usernameStr })
    .then((getUser) => {
      if (getUser !== null) {
        reject();
      } else {
        modelUsername.create({ 
          "username": usernameStr,  
          "exercises": []
        })
        .then((createdUser) => {
          res.json({"username": usernameStr, "_id": createdUser.id});
        })
        .catch(err => {
          console.log(err);
        });
      }
    })
    .catch(() => {
      res.send("Username already taken")
    });
});

//Create an exercise for user
app.post('/api/addexercise', function(req, res) {
  let activityUserId = req.body.id;
  let activityDescription = req.body.description;
  let activityDuration = req.body.duration;
  let activityDate = req.body.date;
  if (activityUserId === "") {
    res.send("not found");
  } else if (isNaN(Number(activityDuration))) {
    res.send("Cast to Number failed for value `${activityDuration}` at path \"duration\"");
  } else if (isNaN(Date.parse(activityDate))) {
    res.send("Cast to Date failed for value `${activityDate}` at path \"date\"");
  } else {
    let activity = {
      date: new Date(activityDate),
      duration: Number(activityDuration),
      description: activityDescription
    };
    let user = new modelUsername({
      username: "0",
      exercises: [activity]
    });
    let err = user.validateSync();
    if (err) {
      res.send(err.errors["exercises.0.description"].message);
    } else {
      modelUsername.findById(activityUserId)
      .then((getUser) => {
        // username = getUser.username;
        getUser.exercises.push(activity);
        return getUser.save();
      })
      .then((getUser) => {
        activity._id = activityUserId;
        activity.username = getUser.username;
        res.json(activity);
      });
    }
  }
});