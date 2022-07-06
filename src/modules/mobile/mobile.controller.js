class MobileController {
    async mobile(req, res) {
        res.render('mobile', {});
    }
}

module.exports = new MobileController();
