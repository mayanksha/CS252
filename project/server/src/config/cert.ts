import fs = require('fs');
var key = fs.readFileSync('/home/msharma/.ssh/localhost.key');
var cert = fs.readFileSync('/home/msharma/.ssh/localhost.crt');

export const certOptions = {
	key : key,
	cert : cert,
}

