const hostname = '127.0.0.1';
const port = 3000;

var fs = require('fs');
var express = require('express');
var app = express();

app.use('/home', (req, res) => {
 
  //res.status(200).type('html');
  fs.readFile('home.html', function(error, data) {
    if (error) {
	res.writeHead(404);
	res.write('Error: File Not Found');
      } else {
	res.writeHead(200, {'Content-Type': 'text/html' });
	res.write(data);
      }
      res.end();
    });
});

app.use('/a', (req, res) => {
  var method = req.method;
  var url = req.url;
  var agent = req.get('User-Agent');

  res.status(200).type('html');
  res.write('Hello World');
  res.end();
});


//app.use('/public', express.static('public folder');

app.use('/about', (req, res) => {
  res.send('This is the about page.');
});

app.use('/login', (req, res) => {
  res.send('This is the login page.');
});

app.use(/*default*/ (req, res) => {
  res.status(404).send('Not found!');
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
