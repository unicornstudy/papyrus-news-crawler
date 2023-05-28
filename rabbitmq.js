const amqp = require('amqplib/callback_api');

let channel;

async function setupChannel() {
    return new Promise((resolve, reject) => {
        amqp.connect('amqp://localhost', function(error0, connection) {
            if (error0) {
                reject(error0);
            }
            connection.createChannel(function(error1, ch) {
                if (error1) {
                    reject(error1);
                }
                channel = ch;
                resolve(ch);
            });
        });
    });
}

// Ensure that the channel is set up at the start
setupChannel().catch(err => console.error(err));

module.exports = () => channel;
