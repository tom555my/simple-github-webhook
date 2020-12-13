const http = require('http');
const micro = require('micro');
const index = require('./index');

const server = new http.Server(micro(index));

server.listen(5000);
