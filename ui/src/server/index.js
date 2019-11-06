const http = require('http');

http.createServer((req, res) => {
    if (req.url === '/api/v1/vcard') {
        // home(req, res);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('hello');
    }
}).listen(3000, () => console.log('Сервер работает'));
