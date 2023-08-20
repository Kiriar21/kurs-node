class PageController{
    showHome(req, res) {
        res.render('pages/home', {
            title: 'Strona Główna',
            user: req.session.user,
        });
    }

    showNotFound(req, res) {
        res.render('errors/404', {
            layout: 'layouts/minimalistic',
        });
    }
}

module.exports = new PageController();