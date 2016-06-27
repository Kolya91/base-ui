/**
 *
 * Simple node server for Petroom client
 *
 * */
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/build/'));
app.get('*', function(req, res) {
	if (req.url === '/favicon.ico') {
		res.writeHead(200, {'Content-Type': 'image/x-icon'} );
		res.end();
		return;
	}
	res.sendFile(__dirname + '/build/index.html');
});

var server = app.listen(7007, function () {
	console.log('Petroom app listening at http://localhost:7007');
});
