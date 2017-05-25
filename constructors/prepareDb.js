const postgres = require('pg');
const dbCfg = require('../configs/database.json');

module.exports = function() {

	return new Promise((resolve, reject) => {

		const db = new postgres.Client({
			user: dbCfg.user,
			password: dbCfg.password,
			database: 'postgres',
			host: dbCfg.host,
			port: dbCfg.port,
		});

		db.connect((err) => {
			if(err) reject(err);

			db.query(`DROP DATABASE IF EXISTS ${dbCfg.db}`, (err) => {
				if(err) reject(err);

				db.query(`CREATE DATABASE ${dbCfg.db}`, (err) => {
					if(err) reject(err);

					db.end();
					resolve();
				});

			});

		});

	});

};
