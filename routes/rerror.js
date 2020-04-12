module.exports = function(app, swig) {

    app.get('/error', function(req, res) {
        res.send(swig.renderFile("views/error.html", {
            mensaje:req.session.mensaje,
            tipoMensaje:req.session.tipoMensaje
        }));
    });

};