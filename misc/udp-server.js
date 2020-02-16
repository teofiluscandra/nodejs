/*
* UDP Server
* Creating datagram server listening on 6000
*/

const dgram = require('dgram');

// create a server
const server = dgram.createSocket('udp4');

server.on('message', (messageBuffer, sender) => {
	const messageStr = messageBuffer.toString();
	console.log(messageStr);
});

// Bind to 6000
server.bind(6000);
