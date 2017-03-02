var nodemailer = require("nodemailer");
var _ = require("lodash");
var transporter;
var config = require("../../configs");

import nodemailer from "nodemailer";
import _ from "lodash";
import config from "../config";

let transporter;
transporter = transporter || nodemailer.createTransport(config.smtp.connStr);


export default {
    send: function(opt) {
        if (!config.smtp.enabled) return;
        if (!opt) new CustomError.InvalidArgsGeneralityError();
        if (_.isArray(opt.to)) opt.to = opt.to.join(",");
        if (opt.to === "") throw new CustomError.InvalidArgsGeneralityError("opt.to不能为空！");

        opt.template = opt.template || template.test({ user: "gkb" });

        var mail = _.assign(opt.template, { from: config.smtp.from, to: opt.to });
        return new Promise(function(resolve, reject) {
            // 发送邮件
            transporter.sendMail(mail, function(error, info) {
                if (error) {
                    return reject(error);
                }

                return resolve(info);
            });
        });

    },
    template: {
        test: function(opt) {
            return getTemplate("test", opt);
        }
    }

}

function getTemplate(key, opt) {
    var _template = {
        test: {
            subject: "test mail",
            text: "Hi ${user}! this a test mail."
        }

    };
    var r = _template[key];
    r.subject = _.template(r.subject)(opt);
    r.text = _.template(r.text)(opt);
    return r;

}
