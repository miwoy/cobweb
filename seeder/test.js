const {
    test
} = require("models")
const user = require("./user")

module.exports = async (t)=> {
    let userIns = await user(t)
    let testIns = await test.scope().create({
        name: "test",
        desc: "hahahaa", 
        user1_id: userIns.id,
        user2_id: userIns.id
    }, {
        // transaction: t
    })
    let child = await test.scope().create({
        name: "child",
        desc: "test child", 
        user1_id: userIns.id,
        user2_id: userIns.id,
        parentId: testIns.id
    }, {
        // transaction: t
    })
    let child2 = await test.scope().create({
        name: "child2",
        desc: "test child2", 
        user1_id: userIns.id,
        user2_id: userIns.id,
        parentId: testIns.id
    }, {
        // transaction: t
    })
    let child3 = await test.scope().create({
        name: "child3",
        desc: "test child3", 
        user1_id: userIns.id,
        user2_id: userIns.id,
        parentId: child2.id
    }, {
        // transaction: t
    })
    let child4 = await test.scope().create({
        name: "child4",
        desc: "test child4", 
        user1_id: userIns.id,
        user2_id: userIns.id,
        parentId: child3.id
    }, {
        // transaction: t
    })

    return testIns;
}