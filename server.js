const http = require('http');
const app = require('./app');

var port = process.env.PORT || 3000;

var server = http.createServer(app);

server.listen(port, () => {
    console.log(`|/*~start swimming in the sea of unknown, magic island ${port} that's where the magic happens~*/|`);
});