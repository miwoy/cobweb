require("lib/global")
const amqp = require("amqplib");
const db = require("lib/service/couchdb")


const queue = "initial";
const debug = require("debug")("version.bfh.zdbx.net:mq")

const {
    batch,
    bottle,
    donor,
    container,
    sampleSource,
    sample,
    project
} = require("application")

const handler = {
    sites: project,
    containers: container,
    donors: donor,
    bottles: bottle,
    batches: batch,
    samples: sample,
    sample_sources: sampleSource
}

async function receiveMessage() {
    // "amqp://zdbx:zdbx2020@nx02.dev.zdbx.net:8289"
    const connection = await amqp.connect(`amqp://${conf.mq.user}:${conf.mq.password}@${conf.mq.host}:${conf.mq.port}`);
    connection.on("error", async(error)=> {
        console.error(error);
        await receiveMessage(queue)
    })
    const channel = await connection.createConfirmChannel();
    channel.on("error", async(error)=> {
        console.error(error);
        await receiveMessage(queue)
    })
    await channel.assertQueue(queue);
    await channel.prefetch(1)
    await channel.consume(queue, function (message) {
        let content = message.content.toString()
        debug("收到消息", message)
        if (typeof content === "string") {
            content = JSON.parse(content)
        }

        if (handler[content.table]) {
            handler[content.table].insert(content.model).then(() => {
                channel.ack(message);
            }).catch((err) => {
                if (err.message == "Document update conflict.") {
                    channel.ack(message);
                } else {
                    // throw err
                }
                
            })
        } else {
            channel.ack(message);
        }

    });
}

receiveMessage().then(debug).catch(debug);

module.exports = {
    start: () => {
        receiveMessage().then(debug).catch(debug);
    }
}