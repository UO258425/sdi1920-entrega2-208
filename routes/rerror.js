module.exports = function(app, swig) {

    app.get('/error', function(req, res) {
        app.get("logger").error("Error occurred: "+mensaje);
        res.send(swig.renderFile("views/error.html", {
            mensaje:req.session.mensaje,
            tipoMensaje:req.session.tipoMensaje
        }));
    });

};