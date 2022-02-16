const bodyParser = require('body-parser')
const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid')
const app = express();
// var cors = require("cors");
// app.use(cors());
const dataPath = "./db/db.json";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/notes", function (req, res) {
  res.sendFile(__dirname + "/public/notes.html");
});
app.get("/api/notes", function (req, res) {
  console.log('here-in-get')
  fs.readFile(dataPath, "utf8", function (err, data) {
    if (err) {
      throw err;
    }

    res.send(JSON.parse(data));
  });
});
app.post("/api/notes", function (req, res) {
  const note = { title: req.body.title, text: req.body.text, id: uuidv4() }
  fs.readFile(dataPath, "utf8", function (err, data) {
    if (err) {
      throw err;
    }
    const toDos = (JSON.parse(data)); toDos.push(note)
    console.log(toDos)
    fs.writeFile(dataPath, JSON.stringify(toDos), 'utf8', function (err) {
      console.log(err)
    })
    res.sendFile(__dirname + "/public/notes.html");
  });
});

app.delete('/api/notes/:id', function (req, res) {
  const clicked = req.params.id
  fs.readFile(dataPath, "utf8", function (err, data) {
    if (err) {
      throw err;
    }
    const db = JSON.parse(data)
    var filteredDb = db.filter(item => item.id !== clicked)

    fs.writeFile(dataPath, JSON.stringify(filteredDb), 'utf8', function (err) {
      console.log(err)
    })
    res.sendFile(__dirname + "/public/notes.html");

  })
})

app.get("/assets/js/index.js", function (req, res) {
  res.sendFile(__dirname + "/public/assets/js/index.js");
});
app.get("/assets/css/styles.css", function (req, res) {
  res.sendFile(__dirname + "/public/assets/css/styles.css");
});
const port = 4000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
