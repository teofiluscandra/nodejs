/*
* TCP (net) Server
* Creating net server listening on 6000 and send the word pong to server
*/

const net = require('net');

// Create server
const server = net.createServer((connection) => {
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
