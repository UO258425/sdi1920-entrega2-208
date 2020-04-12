module.exports = function (app, swig, gestorBD) {
    app.get("/usuarios", function (req, res) {
        res.send("ver usuarios");
    });

    app.get("/signin", function (req, res) {
        let respuesta = swig.renderFile('views/register.html', {});
        res.send(respuesta);
    });

    app.post('/usuario', function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let usuario = {
            email: req.body.email,
            password: seguro
        }
        gestorBD.insertarUsuario(usuario, function (id) {
            if (id == null) {
                req.session.mensaje = "Error al registrar usuario";
                req.session.tipoMensaje = "alert-danger";
                res.redirect("/error");
            } else {
                req.session.mensaje = "Nuevo usuario registrado";
                req.session.tipoMensaje = "alert-success";
                res.redirect('/login');
            }
        });
    });

    app.get("/login", function (req, res) {
        let respuesta = swig.renderFile('views/login.html',  {
            mensaje:req.session.mensaje,
            tipoMensaje:req.session.tipoMensaje
        });
        res.send(respuesta);
    });

    app.post("/identificarse", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {
            email: req.body.email,
            password: seguro
        }
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                req.session.mensaje = "Email o password incorrecto";
                req.session.tipoMensaje = "alert-danger";
                res.redirect("/error");
            } else {
                req.session.usuario = usuarios[0].email;
                req.session.favoritos = [];
                res.redirect("/");
            }
        });
    });

    app.get('/logout', function (req, res) {
        req.session.usuario = null;
        res.send("Usuario desconectado");
    })


};