import OSS from "ali-oss";
import co from "co";

const STS = OSS.STS;
const oss = new OSS({
    region: conf.aliyun.region,
    accessKeyId: conf.aliyun.accessKeyId,
    accessKeySecret: conf.aliyun.accessKeySecret
});

const sts = new STS({
    accessKeyId: conf.aliyun.accessKeyId,
    accessKeySecret: conf.aliyun.accessKeySecret
});

var policy = {
    "Statement": [{
        "Action": "oss:*",
        "Effect": "Allow",
        "Resource": "*"
    }],
    "Version": "1"
};

let getToken = co.wrap(function*() {
    let token = yield sts.assumeRole("acs:ram::1869244890976593:role/oss", policy);
    return token;
});

oss.getToken = getToken;

export default oss;
