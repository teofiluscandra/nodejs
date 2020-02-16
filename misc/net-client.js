/*
* TCP (net) Client
* it connects to port 6000 and send ping to server
*/

const net = require('net');

const outboundMessage = 'ping';

const client = net.createConnection({ port: 6000 }, () => {
	// send the message
	client.write(outboundMessage);
});

// when server writes back, log
client.on('data', (inboundMessage) => {
	const messageString = inboundMessage.toString();
	console.log(`i wrote ${outboundMessage} and they said ${messageString}`);
	client.end();
});
