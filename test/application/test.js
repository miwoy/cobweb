require("../../lib/global");
var should = require("should");
var request = require("supertest");
var { test } = require("../../application");
/**
 * 单元测试
 * http://shouldjs.github.io/#promisedassertion
 */
describe("tests", function() {
	describe("#测试获取数据接口", function() {
		it("should get struct", function() {
			should(null).be.a.Object();
			return test.getList().should.be.fulfilled().finally.equal(null);
		});
		it("should is error", function() {
			return test.getList().rejectedWith(Error, { message: "ArgsError" });
		});

	});
	describe("#测试接口", function() {
		var url = "http://localhost:3000";
		it("should get object", function(done) {
			request(url)
				.get("/user/getProfile")
				.set("Authorization", "token")
				.expect("Content-Type", /json/)
				.expect(200) //Status code
				.end(function(err, res) {
					if (err) {
						throw err;
					}

					// Should.js fluent syntax applied
					should(res.body.errno).equal(0);
					done();
				});
		});
	});
});
