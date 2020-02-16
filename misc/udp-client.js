/*
* UDP Client
* Creating a message to UDP server
*/

const dgram = require('dgram');

// create a client
const client = dgram.createSocket('udp4');

// define a message and pull it into a buffer
const messageStr = 'This is a message';
const messageBuffer = Buffer.from(messageStr);

// send off the message
client.send(messageBuffer, 6000, 'localhost', (err) => {
	client.close();
});
