const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8 "});
    res.end('Привет!')
})

server.listen(process.argv[2], () =>{
    console.log('Сервер запущен')
})