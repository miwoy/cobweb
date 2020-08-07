module.exports = {
	host: "127.0.0.1",
	port: 3000,
	maxConnections: 2000, // 最大链接数
	timeout: 600000, // 闲置超时时间
	secret: "self secret",
	uploadDir: 'src/uploads',
	session: {
		ttl: 3600 // ss
	},
	cors: {
		allowoOrigins: ["http://127.0.0.1:8000", "http://0.0.0.0:8000"],
		allowHeaders: ["Origin", "X-Requested-With", "Content-Type", "Set-Cookie", "Pragma", "Accept", "Cache-Control", "Authorization", "x-site-id"],
		allowMethods: ["PUT", "POST", "GET", "DELETE", "PATCH", "OPTIONS"]
	},
	mysql: {
		host: "127.0.0.1",
		port: "8272",
		username: "root",
		password: "voM2KahVApx6",
		database: "test",
		dialect: "mysql",
		timezone: "+08:00",
		benchmark: false,
		// logging: false,
		pool: {
			maxConnections: 20,
			minConnections: 0,
			maxIdleTime: 10000
		},
		sync: {
			enabled: false,
			options: {
				// alter: true,
				force: true
			},
			match: /^test$/

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