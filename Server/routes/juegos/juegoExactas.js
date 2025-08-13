
const {
    isLogged,
    router,
} = require('./../../config/dependencies.js');
router.get('/exactas', isLogged, (req, res) => {

    res.render('exactas', {
        session: req.session
    });

});


// Exporta todas las rutas definidas
module.exports = router;