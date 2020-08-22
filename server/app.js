const serverType = 'Development';
const local_IP = '127.0.0.1';
const port = 3000;

const ip = require("ip");
const fs = require('fs');
const path = require('path');
const express = require('express');
const publicIp = require('public-ip');
const app = express();

const filesPath = path.resolve(__dirname, '..');

app.set("view engine", "ejs");
app.set('views', filesPath + path.sep + 'templates');  // ejs files path
app.use(express.static(filesPath));  // main files path

app.use('/', (req, res) => {
  res.render("home");
});


  //res.status(200).type('html');
  /*
  fs.readFile('../templates/home.html', function(error, data) {
    if (error) {
	res.writeHead(404);
	res.write('Error: File Not Found');
      } else {
	res.writeHead(200);
	res.write(data);
      }
    console.log('Someone enter your website');
      res.end();
    });
});*/
/*
app.use('/a', (req, res) => {
  var method = req.method;
  var url = req.url;
  var agent = req.get('User-Agent');

  res.status(200).type('html');
  res.write('Hello World');
  res.end();
});


app.use('/about', (req, res) => {
  res.send('This is the about page.');
});

app.use('/login', (req, res) => {
  res.send('This is the login page.');
});
*/

app.use(/*default*/ (req, res) => {
  res.status(404).send('Not found!');
});

app.listen(port, () => {
  console.log(`Server type is: ${serverType}`);
  console.log(`Server internal ip address ${ip.address()}`);
  console.log(`Server local address is http://${local_IP}:${port}`);
  (async () => {
    console.log(`Server public address is http://${await publicIp.v4()}:${port}`);
  })();
});