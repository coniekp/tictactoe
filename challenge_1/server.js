var express = require('express');
var server = express();

server.listen(3000, () => console.log('Listening locally'));

server.use(express.static('client'));
