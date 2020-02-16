/*
* TLS (net) Server
* Creating net server listening on 6000 and send the word pong to server
*/

const tls = require('tls');
const fs = require('fs');
const path = require('path');

// server options
const options = {
	key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
	cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
};

// Create server
const server = tls.createServer(options, (connection) => {
	const outboundMessage = 'pong';
	connection.write(outboundMessage);

	// When the client writes something, log it out
	connection.on('data', (inboundMessage) => {
		const messageString = inboundMessage.toString();
		console.log(`i wrote ${outboundMessage} and they said ${messageString}`);
	});
});

// Listen
server.listen(6000);
