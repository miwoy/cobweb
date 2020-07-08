const redis = require("redis");
const _ = require("lodash");
const Debug = require("debug");

let redisClient;
const debug = Debug("cobweb:service:redis");

redisClient = redisClient || redis.createClient({ host: conf.redis.host, port: conf.redis.port, password: conf.redis.pass });

redisClient.on("error", function(err) {
	let e = new RedisRefError(err.message);
	debug("Redis Error:", e);
});

redisClient.on("connect", function() {
	debug("Redis connect success.");
});

function get(key) {
	return new Promise(function(resolve, reject) {
		redisClient.get(key, function(err, result) {
			if (err) {
				reject(err);
			} else {
				result = JSON.parse(result);
				resolve(result);
			}
		});
	});
}

function set(key, value, ttl) {
	ttl = ttl || conf.session.ttl;
	value = JSON.stringify(value);
	return new Promise(function(resolve, reject) {
		redisClient.setex(key, ttl, value, function(err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
}

function expire(key, ttl) {
	ttl = ttl || conf.session.ttl;

	return new Promise(function(resolve, reject) {
		redisClient.expire(key, ttl, function(err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
}

function ttl(key) {
	return new Promise(function(resolve, reject) {
		redisClient.ttl(key, function(err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
}

function del() {
	let keys = _.values(arguments);
	return new Promise(function(resolve, reject) {
		redisClient.del(keys, function(err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
}

module.exports = {
	get: get,
	set: set,
	expire: expire,
	ttl: ttl,
	del: del
};
