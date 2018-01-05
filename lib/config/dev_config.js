export default {
	host: "127.0.0.1",
	port: 8888,
	maxConnections: 2000, // 最大链接数
	timeout: 600000, // 闲置超时时间
	secret: "self secret",
	session: {
		ttl: 3600 // ss
	},
	mysql: {
		host: "127.0.0.1",
		port: "3306",
		username: "root",
		password: "123456",
		database: "cobweb",
		dialect: "mysql",
		timezone: "+08:00",
		benchmark: false,
		logging: console.log,
		pool: {
			maxConnections: 20,
			minConnections: 0,
			maxIdleTime: 10000
		}
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
