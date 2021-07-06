module.exports = {
	host: "127.0.0.1",
	port: 3000,
	maxConnections: 2000, // 最大链接数
	timeout: 600000, // 闲置超时时间
	secret: "version_secret",
	uploadDir: 'src/uploads',
	couchdb: {
		entry: `http://${process.env.COUCHDB_USERNAME || "admin"}:${process.env.COUCHDB_PWD || "mypass123"}@${process.env.COUCHDB_HOST || "127.0.0.1"}:${process.env.COUCHDB_PORT || "5984"}`,
		database: process.env.COUCHDB_DB || "bfh",
	},
	mq: {
		host: process.env.MQ_HOST || "nx02.dev.zdbx.net",
		port: process.env.MQ_PORT || 8289,
		user: process.env.MQ_USER || "zdbx",
		password: process.env.MQ_PWD || "zdbx2020",
		default: {
			channel: process.env.MQ_DEFAULT_CHANNEL || "normal"
		}
	},
	session: {
		ttl: 3600 // ss
	},
	cors: {
		allowoOrigins: ["http://127.0.0.1:8000", "http://0.0.0.0:8000"],
		allowHeaders: ["Origin", "X-Requested-With", "Content-Type", "Set-Cookie", "Pragma", "Accept", "Cache-Control", "Authorization", "x-site-id"],
		allowMethods: ["PUT", "POST", "GET", "DELETE", "PATCH", "OPTIONS"]
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