import _ from "lodash";

/**
 * 第一个参数是db repository
 */
export default {
	getList: async function(db, queryData) {
		queryData = queryData || {};
		queryData.pageSize = queryData.pageSize || 10;
		queryData.pageIndex = queryData.pageIndex || 1;
		queryData.query = queryData.query || {};
		queryData.query.$andCount = 1;
		queryData.query.$limit = [queryData.pageSize * (queryData.pageIndex - 1), queryData.pageSize];

		let r = await db.test.find(queryData.query);
		return r;
	},
	getById: async function(db) {
		let a = await db.query("select * from test", []);
		return a;
	},
	begin: async function(db) {
		await db.test.create({
			name: "a"
		});
		await db.test.create({
			name: "b"
		});


		return "ok";
	},
	create: async function(db, data) {
		let r = await db.test.create(data);
		return r;
	},
	update: async function(db, queryData, data) {
		let r = await db.test.update(queryData, data);
		return r;
	},
	del: async function(db, queryData) {
		if (!queryData || !_.isObject(queryData)) throw new ArgsGeneralityError("必须存在删除条件");
		let r = await db.test.del(queryData);
		return r;
	}
};
