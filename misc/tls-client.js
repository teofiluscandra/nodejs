/*
* TCP (net) Client
* it connects to port 6000 and send ping to server
*/

const tls = require('tls');
const fs = require('fs');
const path = require('path');

// server options
const options = {
	ca: fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
};

const outboundMessage = 'ping';

const client = tls.connect(6000, options, () => {
	// send the message
	client.write(outboundMessage);
});

// when server writes back, log
client.on('data', (inboundMessage) => {
	const messageString = inboundMessage.toString();
	console.log(`i wrote ${outboundMessage} and they said ${messageString}`);
	client.end();
});
