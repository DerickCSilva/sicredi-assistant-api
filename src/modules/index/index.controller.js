class IndexController {
    async index(req, res) {
        res.render('index', {});
    }
}

module.exports = new IndexController();
