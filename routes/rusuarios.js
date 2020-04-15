module.exports = function (app, swig, gestorBD) {

    app.get("/signin", function (req, res) {
        let respuesta = swig.renderFile('views/register.html', {
            mensaje: req.session.mensaje,
            tipoMensaje: req.session.tipoMensaje
        });
        req.session.mensaje = null;
        req.session.tipoMensaje = null;
        res.send(respuesta);
    });

    app.post('/signin', function (req, res) {

        req.session.tipoMensaje = "alert-danger";

        if (!req.body.email) {
            req.session.mensaje = "Error al registrar usuario: email vacio";
            res.redirect("/signin");
        } else if (!req.body.name) {
            req.session.mensaje = "Error al registrar usuario: nombre vacio";
            res.redirect("/signin");
        } else if (!req.body.surname) {
            req.session.mensaje = "Error al registrar usuario: apellidos vacios";
            res.redirect("/signin");
        } else if (!(String(req.body.password) === String(req.body.passwordConfirmation))) {
            req.session.mensaje = "Error al registrar usuario: las contraseñas no coinciden";
            res.redirect("/signin");
        } else {

            let criterio = {email: req.body.email};
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if (usuarios == null || usuarios.length === 0) {

                    let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                        .update(req.body.password).digest('hex');
                    let usuario = {
                        email: req.body.email,
                        password: seguro,
                        name: req.body.name,
                        surname: req.body.surname
                    };
                    gestorBD.insertarUsuario(usuario, function (id) {
                        if (id == null) {
                            req.session.mensaje = "Error al registrar usuario: Hay un problema con nuestros servidores :(";
                            req.session.tipoMensaje = "alert-danger";
                            res.redirect("/error");
                        } else {
                            req.session.mensaje = "Nuevo usuario registrado";
                            req.session.tipoMensaje = "alert-success";
                            res.redirect('/login');
                        }
                    });
                } else {
                    req.session.mensaje = "Error al registrar usuario: No puede registrarse con ese email";
                    res.redirect("/signin");
                }
            });
        }
    });

    app.get("/login", function (req, res) {
        let respuesta = swig.renderFile('views/login.html', {
            mensaje: req.session.mensaje,
            tipoMensaje: req.session.tipoMensaje
        });
        req.session.mensaje = null;
        req.session.tipoMensaje = null;
        res.send(respuesta);
    });

    app.post("/login", function (req, res) {
        if (!req.body.email) {
            req.session.tipoMensaje = "alert-danger";
            req.session.mensaje = "Error al identificar usuario: email vacio";
            res.redirect("/login");
        } else if (!req.body.password) {
            req.session.tipoMensaje = "alert-danger";
            req.session.mensaje = "Error al identificar usuario: contraseña vacia";
            res.redirect("/login");
        } else {
            let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
            let criterio = {
                email: req.body.email,
                password: seguro
            }
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if (usuarios == null || usuarios.length === 0) {
                    req.session.usuario = null;
                    req.session.mensaje = "Email o password incorrecto";
                    req.session.tipoMensaje = "alert-danger";
                    res.redirect("/login");
                } else {
                    req.session.usuario = usuarios[0].email;
                    req.session.favoritos = [];
                    res.redirect("/");
                }
            });
        }
    });

    app.get('/logout', function (req, res) {
        req.session.usuario = null;
        req.session.mensaje = "Usuario desconectado";
        req.session.tipoMensaje = "alert-success";
        res.redirect('/login');
   });



    app.get("/usuarios/", function(req,res){
        let criterio = {};
        if (req.query.busqueda != null && req.query.busqueda !== "") {
            criterio = {
                $or:[
                    {email: {$regex: ".*" + req.query.busqueda + ".*"}},
                    {name: {$regex: ".*" + req.query.busqueda + ".*"}},
                    {surname: {$regex: ".*" + req.query.busqueda + ".*"}}
                ]
            };
        }
        let pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerUsuariosPg(criterio, pg, function (users, total) {
            if (users == null) {
                res.send("Error al listar ");
            } else {
                let ultimaPg = total / 4;
                if (total % 4 > 0) { // Sobran decimales
                    ultimaPg = ultimaPg + 1;
                }
                let paginas = []; // paginas mostrar
                for (let i = pg - 2; i <= pg + 2; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }
                let respuesta = swig.renderFile('views/usersList.html',
                    {
                        users: users,
                        paginas: paginas,
                        actual: pg,
                        mensaje: req.session.mensaje,
                        tipoMensaje: req.session.tipoMensaje,
                        sesion:req.session.usuario

                    });
                req.session.mensaje = null;
                req.session.tipoMensaje = null;
                res.send(respuesta);
            }
        });
    });


};