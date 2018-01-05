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
		host: "your mysql host",
		port: 8292,
		user: "your mysql user",
		password: "your mysql pwd",
		database: "your mysql db",
		connectionLimit: 20,
		supportBigNumbers: true
	}
};
