// require
const ip = require("ip");
const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const publicIp = require('public-ip');
const projectPath = path.resolve(__dirname, '..');
const bodyParser = require('body-parser');
const mailer = require('./liron_modules/util/mail/m_email.js');

// environment variables
const PORT = process.env.NODE_PORT;
const SERVER_ENV = process.env.NODE_ENV;

// db data
var projects = fs.readFileSync(projectPath + '/website/templates/projects.json', 'utf8');
var upcoming = fs.readFileSync(projectPath + '/website/templates/upcoming.json', 'utf8');


var logger = (req, res ,next) => {
  let url = req.url;
  let time = new Date();
  console.log(`Received request for ${url} at ${time}`);
  next();
};

var errorHandling = () => {
  if (SERVER_ENV === "development") {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
  }
  else if (SERVER_ENV === "production") {
    app.use(express.errorHandler())
  }
};

// init
const app = express();
app.set("view engine", "ejs");  // set view to ejs files
app.set('views', projectPath + '/website/templates');  // set ejs files path
app.use(express.static(projectPath));  // add project path
app.use(bodyParser.urlencoded({ extended: true }));  // form method post body parser
app.use(logger); // add logger

app.use('/contact', (req, res) => {
  console.log(req.body);
  mailer.sendEmail(req.body.name, req.body.email, req.body.subject, req.body.message);
  res.redirect(301, '/');
});

app.use('/', (req, res) => {
  res.render("home", {
    // adding db data
    projects:JSON.parse(projects),
    upcoming:JSON.parse(upcoming)
  });
});

app.use(/*default*/ (req, res) => {
  res.status(404).render("404", {url:req.url});
});


function startInfo(port) {
  console.log(`Server type is: ${SERVER_ENV}`);
  console.log(`Server internal ip address ${ip.address()}`);
  console.log(`Server local address is http://localhost:${port}`);
  (async () => {
    console.log(`Server public address is http://${await publicIp.v4()}:${port}`);
  })();
}

let httpServer = http.createServer(app);
httpServer.listen(PORT, () => { startInfo(PORT); });
