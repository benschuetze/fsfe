const http = require('http')

http.createServer( function (req, res) {
res.write('Whats up Ninja!');
res.end();
}
).listen(3000);

console.log('Server started on PORT 3000');
