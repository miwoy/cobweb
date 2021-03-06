module.exports = {
	host: "127.0.0.1",
	port: 8888,
	maxConnections: 2000, // 最大链接数
	timeout: 600000, // 闲置超时时间
	secret: "self secret",
	uploadDir: 'src/uploads',
	session: {
		ttl: 3600 // ss
	},
	mysql: {
		host: "host",
		port: "3306",
		user: "username",
		password: "password",
		database: "dbname",
		connectionLimit: 20,
		supportBigNumbers: true,
		debug: true,
		map: "none"
	},
	redis: {
		host: "127.0.0.1",
		port: 6366,
		pass: "password"
	},
	smpt: {
		connStr: "smpt connection string",
		from: "username"
	}
};
