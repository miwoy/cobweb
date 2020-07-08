require("../../lib/global");
const should = require("should");
const request = require("supertest");
const { test } = require("../../application");
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
			return test.getList().should.be.rejectedWith(Error, { message: "ArgsError" });
		});

	});
	describe("#测试接口", function() {
		var url = "http://localhost:3000";
		it("should get object", function(done) {
			request(url)
				.get("/api/test/getTests")
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
