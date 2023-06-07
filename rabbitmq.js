const amqp = require('amqplib/callback_api');

let channelPromise = null;

function getChannel() {
    if (!channelPromise) {
        channelPromise = new Promise((resolve, reject) => {
            amqp.connect('amqp://localhost', function (error0, connection) {
                if (error0) {
                    reject(error0);
                }

                console.log("Connected to RabbitMQ");

                connection.createChannel(function (error1, ch) {
                    if (error1) {
                        reject(error1);
                    }

                    ch.assertQueue('daum', {
                        durable: true
                    });

                    resolve(ch);
                });
            });
        });
    }

    return channelPromise;
}

module.exports = getChannel;