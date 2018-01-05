import test from "./impl/test";


export default (db) => {
	return {
		getList: async(queryData) => {
			let r = await test.getList(db, queryData);
			return r;
		},
		getById: async(id) => {
			let r = await test.getById(db, id);
			return r;
		},
		create: async(data) => {
			let r = await test.create(db, data);
			return r;
		},
		update: async(queryData, data) => {
			let r = await test.update(db, queryData, data);
			return r;
		},
		del: async(queryData) => {
			let r = await test.del(db, queryData);
			return r;
		}
	};
};
