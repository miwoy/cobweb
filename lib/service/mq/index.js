const amqp = require("amqplib");

const queue = conf.mq.default.channel;
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
    "sites": project,
    "containers": container,
    "donors": donor,
    "bottles": bottle,
    "batches": batch,
    "samples": sample,
    "sample_sources": sampleSource
}

async function receiveMessage(channelName) {
    // "amqp://zdbx:zdbx2020@nx02.dev.zdbx.net:8289"
    channelName = channelName || queue
    const connection = await amqp.connect(`amqp://${conf.mq.user}:${conf.mq.password}@${conf.mq.host}:${conf.mq.port}`);
    connection.on("error", async(error)=> {
        console.error(error);
        await receiveMessage(channelName)
    })
    const channel = await connection.createConfirmChannel();
    channel.on("error", async(error)=> {
        console.error(error);
        await receiveMessage(channelName)
    })
    await channel.assertQueue(channelName);
    await channel.prefetch(1)
    await channel.consume(channelName, function (message) {
        let content = message.content.toString()
        debug("收到消息", message)
        if (typeof content === "string") {
            content = JSON.parse(content)
        }

        if (handler[content.table]) {
            handler[content.table].update(content.type == "delete" ? {
                id: content.id,
                deleted: content.timestamp
            } : content.model).then(() => {
                channel.ack(message);
            }).catch((err) => {
                throw err
            })
        } else {
            channel.ack(message);
        }

    });
}

module.exports = {
    start: (channel) => {
        receiveMessage(channel).then(debug).catch(debug);
    }
}