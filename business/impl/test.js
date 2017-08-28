import uuid from 'node-uuid';

/**
 * prototype func
 * service
 * common
 * 第一个参数是repository
 */
export default {
    getTests: async function(db) {
        // let tests = await db.test.find().exec();

        return "This is test list.";
    },
    setTest: async function(db) {
    	// let r = await db.test.create({
    	// 	id: uuid.v1(),
    	// 	name: "test"
    	// }).exec();

    	return "Set success.";
    },
    begin: async function(db) {
        let r = await db.test.create({
            id: uuid.v1(),
            name: "testBegin1"
        }).exec();
        return r;
    }
}
