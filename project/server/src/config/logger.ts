import winston = require('winston');
import stream = require('stream');
import morgan = require('morgan');

const tsFormat = () => (new Date()).toLocaleTimeString();

export const logger = winston.createLogger({
	transports: [
		new winston.transports.File({
			filename: '../logs/error.log',
			level: 'error',
			handleExceptions: true,
		}),
		new winston.transports.File({
			filename: '../logs/console.log',
			level: 'info',
		}),
		new (winston.transports.Console as any)({
			level: 'info',
			timestamp: tsFormat(),
			handleExceptions: true,
			showLevel : false,
			prettyPrint: true,
			colorize: true 
		}),
	],
	exitOnError: false
});
export const morganOptions: morgan.Options = {
	stream: {
		write: function (message: string) {
			logger.info(message);
		}
	}
}
