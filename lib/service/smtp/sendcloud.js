const _ = require("lodash");
const config = require("../../config");
const Debug = require("debug");

let http = require("http");
let urlutil = require("url");

const debug = Debug("cobweb:service:smtp");

const send = async(data) => {
	data.apiUser = config.sendcloud.appUser;
	data.apiKey = config.sendcloud.appKey;
	if (_.isArray(data.to)) data.to = data.to.join(";");
	// data.from = data.from || config.sendcloud.from.register;
	let r = await postForm("http://api.sendcloud.net/apiv2/mail/send", data);
	return r;
};

const sendTemplateMsg = async() => {

};

const postForm = async(url, data) => {
	return new Promise(function(resolve, reject) {
		var postData = [];
		for (let key in data) {
			postData.push(key + "=" + data[key]);
		}
		postData = postData.join("&");

		var opt = urlutil.parse(url, false, true);
		opt.method = "POST";
		opt.headers = {
			"Content-Type": "application/x-www-form-urlencoded",
			"Content-Length": Buffer.byteLength(postData)
		};
		debug("POST", opt, data);
		var req = http.request(opt, (res) => {
			let rawData = "";
			res.setEncoding("utf8");
			res.on("data", (chunk) => rawData += chunk);
			res.on("end", () => {
				if (res.statusCode === 200) {
					let parsedData = JSON.parse(rawData);
					if (parsedData.errno) {
						reject(new Error(parsedData.errmsg));
					} else {
						resolve(parsedData);
					}
				} else {
					reject(new Error(rawData));
				}

			});
		});

		req.on("error", (e) => {
			reject(e);
		});

		// 写入数据到请求主体
		req.write(postData);
		req.end();
	});
};

module.exports = { send, sendTemplateMsg };
