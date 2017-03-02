var redis = require("redis");
import config from "../config";
import redis from "redis";
import _ from "lodash";

let redisClient;
redisClient = redisClient || redis.createClient({ port: config.redis.port, password: config.redis.pass });

redisClient.on("error", function(err) {
    var e = new CustomError.RedisRefError(err.message);
    debug(e);
    common.mongoLogger.log(e);
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
    ttl = ttl || config.session.ttl;
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
    ttl = ttl || config.session.ttl

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

function del(key) {
    var keys = _.values(arguments);
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

export default {
    get: get,
    set: set,
    expire: expire,
    ttl: ttl,
    del: del
}
