// Repository
const conversation = require('./assistant.repository');

// Services
const services = require('./integrations/index.service');

const sendMessageToConversation = (message) =>
    new Promise((resolve, reject) => {
        conversation.message(message, (err, response) => {
            if (err) {
                reject(err);
            }

            resolve(response);
        });
    });

const processMessage = async (req, res) => {
    try {
        let messageToUser = await sendMessageToConversation(req.body);

        const { service } = messageToUser.context;

        if (service && services[service]) {
            const { context, mountComponent, result } = await services[service](messageToUser.context);
            messageToUser.context = context;

            req.body.input.text = '';
            req.body.context = messageToUser.context;

            messageToUser = await sendMessageToConversation(req.body);
        }

        return res.json(messageToUser);
    } catch (err) {
        console.error(err);
        return res.status(400);
    }
};

module.exports = { processMessage };
