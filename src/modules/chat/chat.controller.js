class ChatController {
    async chat(req, res) {
        res.render('chat', {});
    }
}

module.exports = new ChatController();
