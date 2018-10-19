import mysql = require("mysql");
import SqlString = require('sqlstring');
/*import timers = require('timers');*/

import { localConfig } from './local_config';
// Singleton Database class, only one instance needed:w
//
export class Database {
	public static getInstance() {
		return this._instance || (this._instance = new this(localConfig, localConfig.database));
	}

	private static _instance: Database;

	/*private connection: mysql.Connection;*/
	private pool: mysql.Pool;

	constructor(config: any, database: string) {
		console.log(new Date(), " Connected to Database (getInstance)" + localConfig.database );
		config.database = database;
		/*this.connection  = mysql.createConnection(config);*/
		this.pool = mysql.createPool({
			connectionLimit: localConfig.connectionLimit,
			host: localConfig.host,
			port : localConfig.port,
			user: localConfig.user,
			password: localConfig.password,
			database: localConfig.database
		});
		/*this.connection.connect((err) => {
		 *  if (err) {
		 *    throw err;
		 *  }
		 *  [>this.connection.destroy();<]
		 *  setTimeout(() => {
		 *    console.log("Connection ended!");
		 *    process.nextTick(() => {
		 *      this.query("SELECT * FROM test.all_cluster").then(console.log).catch(console.error);
		 *    });
		 *  }, 5000);
		 *  console.log(`Database connected successfully on ${config.user}@${config.host}`);
		 *});*/
	}

	// getPoolConnection() can be made private for the case when you're
	// not using MySQL TRANSACTIONS and where you just have normal SELECT/INSERT/UPDATE
	// statements.
	//
	// For TRANSACTIONS, a single connection must be used for all the queries and 
	// hence db.query shouldn't be used...since it fetches a new connection from the
	// connection pool.
	public getPoolConnection(): Promise<mysql.PoolConnection> {
		return new Promise((resolve, reject) => {
			this.pool.getConnection((err, connection) => {
				if (err)
					return reject(err);
				return resolve(connection);
			});
		});
	}

	/*tslint:disable*/
	public query(sql: string, args?: any) {
		return this.getPoolConnection()
			.then((conn) => {
				return new Promise((resolve, reject) => {
					conn.query(sql, args, (err, results, fields) => {
						if(err)
							return reject(err);	
						conn.release();
						return resolve(results)	;
					}) 
				})
			})
			.catch(err => Promise.reject(err));
	}

	public getQueryResults(connection: mysql.Connection, sql: string, args?: any) : Promise<mysql.RowDataPacket[] | any[]> {
		return new Promise((resolve, reject) => {
			connection.query(sql, args, (err, results, fields) => {
				if (err)
					return reject(err);
				return resolve(results);
			})
		})
	}
	/*
	 *   Below methods were suitable for non-pooled connection, i.e
	 *   directly creating connections using mysql.createConnection
	 */


	/*public query(sql: string, args?: any) {
	 *  return new Promise((resolve, reject) => {
	 *    this.connection.query(sql, args, (err, rows: any) => {
	 *      if (err) {
	 *        return reject(err);
	 *      }
	 *      resolve(rows);
	 *    });
	 *  });
	 *}*/
	/*public closeConnection() {
	 *  return new Promise((resolve, reject) => {
	 *    this.connection.end( (err) => {
	 *      if (err) {
	 *        return reject(err);
	 *      }
	 *      resolve();
	 *    } );
	 *  });
	 *}*/
	
	public escape(input: any) {
		return SqlString.escape(input);
	}

}
