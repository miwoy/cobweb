const _ = require("lodash");
const config = require("../../config");
const sendcloud = require("./sendcloud");

/**
 * smpt.send({
 *     template: smpt.template.test({
 *         user: "gkb"
 *     }),
 *     to: []
 * })
 */

// const exportTransporter = function(type) {
// 	return nodemailer.createTransport(conf.smtp[type].connStr);
// };

module.exports = {
	send: async function(type, opt) {
		if (!conf.smtp.enabled) return;
		if (!type) throw new InvalidArgsGeneralityError("type");
		if (!opt) throw new InvalidArgsGeneralityError("opt");

		opt.template = opt.template || this.template.test({ user: "gkb" });

		var mail = _.assign(opt.template, { from: config.sendcloud.from[type], to: opt.to });
		// exportTransporter 方式发送邮件
		// return new Promise(function(resolve, reject) {
		//     // 发送邮件
		//     exportTransporter(type).sendMail(mail, function(error, info) {
		//         if (error) {
		//             return reject(error);
		//         }

		//         return resolve(info);
		//     });

		// });
		// console.log(sendcloud, mail);
		let r = await sendcloud.send(mail);
		return r;

	},
	template: {
		test: function(opt) {
			return getTemplate("test", opt);
		},
		register: function(opt) {
			return getTemplate("register", opt);
		},
		retrievePassword: function(opt) {
			return getTemplate("retrievePassword", opt);
		}
	}

};

function getTemplate(key, opt) {
	var _template = {
		test: {
			subject: "test mail",
			plain: `Hi ${opt.user}! this a test mail.`
		},
		register: {
			subject: "Peapad register validate mail",
			plain: "Click url and validated.",
			html: `<h1 align="center">Thanks for Signing up</h1>
        <h3 align="center">Please confirm you email address to get full access to Peapad Platform</h3>
        <div align="center"><a style="background: #63c961;padding: 15px 20px;display: inline-block;border-radius: 10px;font-size: 14px;color: white;text-decoration: none" href="${config.web.teacher.domain}/emailCheck.html?token=${opt.token}">Confirm Your Email</a></div>
        <h3 align="center">you're receiving this email because you (or someone using the email) created account on
            <a href="${config.web.teacher.domain}">Peapad Platform</a> using this address</h3>
        <h3 align="center">Didn't sign up for Peapad Platform? Please Ignore it!</h3>`
		},
		retrievePassword: {
			subject: "Peapad retrieve password verification code to email.",
			plain: `Click url retrieve password\n ${opt.token}`,
			html: `<img style="width: 200px;display: block;text-align: center;margin: auto;" src="http://teacher.peapad.cn/src/img/logo.png" alt="">
                   <div style="padding:30px">
                    <h2>Dear ${opt.username} :</h2>
                    <br/><p>A request for a new password was submitted for your Peapad Platform account.For your security.simply follow the link to reset your password.</p>
                    <p>Click url and validated.</p>
                    <a style="text-overflow: ellipsis;
                            white-space: nowrap;
                            width: 50%;
                            display: inline-block;
                            overflow: hidden;
                            color: #63c961;"
                         href='${config.web.teacher.domain}/resetPassword.html?token=${opt.token}'>${config.web.teacher.domain}/resetPassword.html?token=${opt.token}</a>
                    <p>if the above link does not work,please copy the above address to your web browser’s bar and enter our website from there.</p>
                    <b>Sincerely,</b>
                    <br> 
                    <b>The Peapad Team</b>
                   </div>`
		}

	};
	var r = _template[key];
	// r.subject = _.template(r.subject)(opt);
	// r.text = _.template(r.text)(opt);
	return r;

}
