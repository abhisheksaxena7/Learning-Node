var http = require('http');
var dt = require('./MyFirstModule');

http.createServer(function(req, res){
	res.writeHead(200,{'Content-Type': 'text/html'});
	res.write("The Date and Time are currently: "+dt.myDateTime());
	res.end();
}).listen(8080);