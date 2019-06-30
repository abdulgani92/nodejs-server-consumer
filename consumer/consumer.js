const config = require('config');
const QUEUE_NAME = config.get('queue_name');

var amqp = require('amqplib/callback_api');
const create = require('../video-creator/create-video');
const convert = require('../video-converter/convert-video');

var fs = require('fs');
var dir = './video';

amqp.connect('amqp://localhost', function (connError, connection) {

    if (connError) {
        //Throw connection error
        throw connError;
    }

    connection.createChannel(function (channelError, channel) {

        if (channelError) {
            //Throw channel error
            throw channelError;
        }

        channel.assertQueue(QUEUE_NAME, {
            durable: false
        });

        console.log(`Waiting for messages in ${QUEUE_NAME}`);

        channel.consume(QUEUE_NAME, async (msg) => {

            try {
                let videoCreated = await create.createVideo(msg.content.toString());
                console.log("Received", videoCreated);

                if (!fs.existsSync(`${dir}/${videoCreated._fileName}`)) {
                    fs.mkdirSync(`${dir}/${videoCreated._fileName}`);
                }

                const promiseArray = [];
                promiseArray.push(convert.convertVideo(videoCreated, 1080));
                promiseArray.push(convert.convertVideo(videoCreated, 720));
                promiseArray.push(convert.convertVideo(videoCreated, 480));
                promiseArray.push(convert.convertVideo(videoCreated, 360));
                promiseArray.push(convert.convertVideo(videoCreated, 240));

                Promise.all(promiseArray)
                    .then((result) => {
                        console.log("Video Converted and Stored into Unique Directory", result);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } catch (err) {
                console.log(err);
            }
        },
            { noAck: true });
    });
});