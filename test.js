require("./lib/global");
const {
    batch,
    bottle,
    donor,
    container,
    sampleSource,
    sample,
    project
} = require("application")
const debug = require("debug")("version.bfh.zdbx.net:test")

let test = async () => {
    let bottles = [{
        id: 1,
        name: "测试小瓶",
        batch_id: 1,
        donor_id: 1,
        container_id: 1,
        sample_id: 1,
        sampleSource_id: 1
    }, {
        id: 2,
        name: "测试小瓶2",
        batch_id: 1,
        donor_id: 1
    }]


    let bottleInc = {
        id: 2,
        name: "测试增量更新",
        desc: "测试增量增加属性"
    }

    let bottleDel = {
        id: 2,
        desc: "测试删除",
        deleted: Date.now()
    }

    

    let batches = {
        id: 1,
        name: "测试采集"
    }

    let samples = {
        id:1,
        name: "测试样品"
    }

    let sampleSources = {
        id:1,
        name: "测试样品源"
    }

    let projects = {
        id:1,
        name: "测试项目"
    }

    let containers = {
        id:1,
        name: "测试容器"
    }

    let donors = {
        id: 1,
        name: "测试捐献者"
    }

    let docs
    try {
        debug("初始化小瓶")
        // 初始化小瓶信息
        // await bottle.update(bottles[0])
        // await bottle.update(bottles[1])
        // debug("增量更新")
        // await bottle.update(bottleInc)
        // debug("删除更新")
        // await bottle.update(bottleDel)
        debug("更新batch", batches)
        await batch.insert(batches)
        debug("更新container", containers)
        await container.insert(containers)
        debug("更新sample", samples)
        await sample.insert(samples)
        debug("更新sampleSource", sampleSources)
        await sampleSource.insert(sampleSources)
        debug("更新project", projects)
        await project.insert(projects)
        debug("更新donor", donors)
        await donor.insert(donors)
        await bottle.insert(bottles[0])
        debug("done")
    } catch (err) {
        console.log(err)
    }
}

test().then(console.log).catch(console.error)