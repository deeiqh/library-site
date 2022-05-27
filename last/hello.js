const http = require("http");

const hostname = "127.0.0.1";
const port = 8000;

let requestsCounter = 0;
const server = http.createServer(
    (req, res) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end((++requestsCounter).toString(), () => console.log(`Response sent to requested ${req.url}`));
    }
);

// function listen(server, port, hostname) { 
//     server.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}`));
// }

// listen(server, 8000, hostname);

// console.log('antes');
// let str = '';
// for(let i=0; i<20000000; i++) str+='1';
// console.log('despues');

// listen(server, 8001, hostname);

server.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}`));