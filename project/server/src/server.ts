import httpLogger = require('morgan');
import mysql = require('mysql');
import express = require('express');
import bodyParser = require('body-parser');
import process = require('process');
import cors = require('cors');
import assert = require('assert');
import fs = require('fs');
import session = require('express-session');
import 	uuid = require('uuid/v4');
import ontime = require('ontime');

import connect_redis = require('connect-redis');
const redisStore: connect_redis.RedisStore = connect_redis(session);

const redisOptions: connect_redis.RedisStoreOptions = {
	host : '127.0.0.1',
	port : 6379,
	pass : 'bigbeardo'
	/*socket : '',
	 *url : ''*/
};
// Interfaces
import { Database } from './config/database';

import https = require('https');
import { certOptions } from './config/cert';
import { localConfig as Config } from './config/local_config';

import { studentData } from './scraper/studentData';

var db = Database.getInstance();
var app : express.Application = express();
app.use(httpLogger('combined'));

app.use(cors({
	origin: 'http://localhost:8080',
	credentials: true,
	optionsSuccessStatus: 200 
}));

// Enable OPTIONS requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

/*setTimeout(() => {
 *  console.log(studentData);
 *  studentData.forEach((elem) => {
 *    elem.courses.forEach((e) => {
 *      fs.appendFileSync("foo.txt", `${elem.rollno},${e}\n`);
 *    })
 *  })
 *}, 10);
 **/
app.use(session({
	store : new redisStore(redisOptions),
	genid : (req) => {
		return uuid();
	},
	cookie : {
		httpOnly : false,
		maxAge: 1000 * 500*1000
		/*expires : */
	},
	secret : 'linkinPark',
	resave : false,
	saveUninitialized : true
}));

ontime({
	cycle: ['00:00:00']
}, () => {
	const truncate = `truncate cs252.proxy_requests;`;
	let connection: mysql.Connection;
	db.getPoolConnection()
		.then((conn) => {
			connection = conn;
			return db.getQueryResults(connection, truncate); 
		})
		.then((rows: any) => JSON.parse(JSON.stringify(rows)))
		.then((rows: any[]) => {
			console.log(rows);
			console.log("ALL DATA CLEARED!");
		})
		.then(() => {
			connection.release();
		})
		.catch(console.error);
})
app.use('*', (req, res, next) => {
	console.log(`Session ID = ${req.sessionID}`);
	next();
})
app.get('/', (req, res) => {
	if(req.session!.page_views){
		req.session!.page_views++;
		res.send("You visited this page " + req.session!.page_views + " times");
	} else {
		req.session!.page_views = 1;
		res.send("Welcome to this page for the first time!");
	}
	res.end();
})
app.post('/getCourses', (req : express.Request, res : express.Response) => {
	const rollno = db.escape(Number(req.body.rollno));
	/*console.log(rollno);*/
	const searchQuery = `SELECT course_code FROM cs252.students WHERE rollno=${rollno}`;
	let connection: mysql.Connection;
	db.getPoolConnection()
		.then((conn) => {
			connection = conn;
			return db.getQueryResults(connection, searchQuery); 
		})
		.then((rows: any) => JSON.parse(JSON.stringify(rows)))
		.then((rows: any[]) => {
			let courses: any[] = [];
			rows.forEach((e) => courses.push(e.course_code));	
			const data = {
				"rollno": rollno,
				"courses": courses
			}
			res.send(JSON.stringify(data));
			res.status(200);
			res.end();
		})
		.then(() => {
			connection.release();
		})
		.catch(console.error);
})
app.post('/getProxyRequests', (req : express.Request, res : express.Response) => {
	const courseCode = db.escape(req.body.courseCode);

	let searchQuery = `SELECT id, course_code, sn.name, sn.rollno, proxy_marked FROM cs252.proxy_requests as pr  LEFT JOIN cs252.student_names as sn ON pr.rollno=sn.rollno WHERE course_code=${courseCode} AND proxy_marked=0 GROUP BY rollno;`;

	console.log(searchQuery);
	let connection: mysql.Connection;
	db.getPoolConnection()
		.then((conn) => {
			connection = conn;
			return db.getQueryResults(connection, searchQuery); 
		})
		.then((rows: any) => JSON.parse(JSON.stringify(rows)))
		.then((rows: any[]) => {
			let students :any[] = [];
			rows.forEach((e: any) => {
				students.push(e);
			})
			if (req.session!.views){
				req.session!.views += 1;
			}
			else {
				console.log("User coming first time!");
				req.session!.views = 1;
			}
			let sendObj = {
				"courseCode": courseCode,
				"students": students,
				"views": req.session!.views
			}
			res.send(JSON.stringify(sendObj));
			res.status(200);
			res.end();
		})
		.then(() => {
			connection.release();
		})
		.catch(console.error);
})
app.post('/requestProxy', (req : express.Request, res : express.Response) => {
	const rollno = db.escape(req.body.rollno);
	const courses = req.body.courses.map((e) => db.escape(e));

	let insertQuery = `INSERT INTO cs252.proxy_requests
	(id, course_code, rollno, proxy_marked, sessionID)
	VALUES `;

	for(let i = 0;i < courses.length; i++) {
		if (i != courses.length - 1){
			insertQuery += `(NULL, ${courses[i]}, ${rollno}, 0, ${db.escape(req.sessionID)}),`;
		}
		else {
			insertQuery += `(NULL, ${courses[i]}, ${rollno}, 0, ${db.escape(req.sessionID)});`;
		}
	}
	console.log(insertQuery);
	let connection: mysql.Connection;
	db.getPoolConnection()
		.then((conn) => {
			connection = conn;
			return db.getQueryResults(connection, insertQuery); 
		})
		.then((rows: any) => JSON.parse(JSON.stringify(rows)))
		.then((rows: any[]) => {
			res.send(rows);
			res.status(200);
			res.end();
		})
		.then(() => {
			connection.release();
		})
		.catch(console.error);
})
app.post('/markProxy', (req : express.Request, res : express.Response) => {
	console.log(req.body);
	const courseCode = db.escape(req.body.course_code);
	const rollnos = req.body.rollnos.map((e) => db.escape(e));
	
	let updateQuery = `UPDATE cs252.proxy_requests set proxy_marked=1 WHERE course_code=${courseCode} AND (`;

	for(let i = 0;i < rollnos.length; i++) {
		if (i != rollnos.length - 1){
			updateQuery += `rollno=${rollnos[i]} OR `;
		}
		else {
			updateQuery += `rollno=${rollnos[i]});`;
		}
	}
	console.log(updateQuery);
	let connection: mysql.Connection;
	db.getPoolConnection()
		.then((conn) => {
			connection = conn;
			return db.getQueryResults(connection, updateQuery); 
		})
		.then((rows: any) => JSON.parse(JSON.stringify(rows)))
		.then((rows: any[]) => {
			console.log(rows);
			res.status(200);
			res.end();
		})
		.then(() => {
			connection.release();
		})
		.catch(console.error);
})
app.post('/cancelMyRequests', (req : express.Request, res : express.Response) => {
	if (!req.sessionID){
		res.status(401);
		res.end();
		return;
	}
	const students = req.body.students;
	
	let deleteQuery = `DELETE FROM cs252.proxy_requests WHERE `;

	for(let i = 0;i < students.length; i++) {
		if (i != students.length - 1){
			deleteQuery += `(rollno=${db.escape(students[i].rollno)} AND sessionID=${db.escape(req.sessionID)} AND course_code=${db.escape(students[i].course_code)}) OR `;
		}
		else {
			deleteQuery += `(rollno=${db.escape(students[i].rollno)} AND sessionID=${db.escape(req.sessionID)} AND course_code=${db.escape(students[i].course_code)});`;
		}
	}
	console.log(deleteQuery);
	let connection: mysql.Connection;
	db.getPoolConnection()
		.then((conn) => {
			connection = conn;
			return db.getQueryResults(connection, deleteQuery); 
		})
		.then((rows: any) => JSON.parse(JSON.stringify(rows)))
		.then((rows: any[]) => {
			console.log(rows);
			res.status(200);
			res.end();
		})
		.then(() => {
			connection.release();
		})
		.catch(console.error);
})
app.get('/getMyRequests', (req, res) => {
	if (!req.sessionID){
		res.status(401);
		res.end();
		return;
	}
	const sessID = db.escape(req.sessionID);
	const searchQuery = `SELECT id, course_code, sn.name, sn.rollno, proxy_marked FROM cs252.proxy_requests as pr  LEFT JOIN cs252.student_names as sn ON pr.rollno=sn.rollno WHERE sessionID=${sessID}`;
	let connection: mysql.Connection;
	db.getPoolConnection()
		.then((conn) => {
			connection = conn;
			return db.getQueryResults(connection, searchQuery); 
		})
		.then((rows: any) => JSON.parse(JSON.stringify(rows)))
		.then((rows: any[]) => {
			console.log(rows);
			res.send(JSON.stringify(rows));
			res.status(200);
			res.end();
		})
		.then(() => {
			connection.release();
		})
		.catch(console.error);
})
app.use('/*', (req : express.Request, res : express.Response) => {
	res.status(404);
	res.end('404 : Not found');
})

app.use('/*', (err, req, res, next) => {
	// Assertions errors are wrong user inputs
	if(err.name === 'SyntaxError' || 
		err.code === 'ERR_ASSERTION' || 
		err.code === 'ER_DATA_TOO_LONG'){

		// Bad HTTP Request
		res.status(400);
		res.end('400 - BAD REQUEST');
	}
	else if (err.code === 'ER_DUP_ENTRY') {
		// Bad HTTP Request
		res.status(409);
		res.end('409 - BAD REQUEST');
	}
	else {

		// Internal Server Error 
		res.status(500);
		res.end('500 - INTERNAL SERVER ERROR!');
	}
});
/*let server = https.createServer(certOptions, app);*/

app.listen(3000, (err : express.ErrorRequestHandler) => {
	if (err) 
		throw err;
	else 
		console.log("Server Listening on Port 3000");
});
