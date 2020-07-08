const jwt = require("jsonwebtoken");
const uuid = require("uuid");


module.exports = {
	sign: (data, secret) => {
		return jwt.sign({data}, secret || conf.secret, {
			expiresIn:1000,
			notBefore: 0
		});
	},
	verify: (token, secret) => {
		return jwt.verify(token, secret || conf.secret);
	}
};
