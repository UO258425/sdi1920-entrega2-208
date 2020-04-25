module.exports = function (app, swig, gestorBD) {


    app.get('/amigos', function (req, res) {
        let criterio = {
            email: req.session.usuario
        };

        let pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            let usuario = usuarios[0];
            let friends = usuario.friends;

            let ultimaPg = friends.size / 4;
            if (friends.size % 4 > 0) { // Sobran decimales
                ultimaPg = ultimaPg + 1;
            }
            let paginas = []; // paginas mostrar
            for (let i = pg - 2; i <= pg + 2; i++) {
                if (i > 0 && i <= ultimaPg) {
                    paginas.push(i);
                }
            }
            let criterio = {
                email: {$in: friends}
            };
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                app.get("logger").info("User "+req.session.usuario+" listed page "+pg+ " of friends");
                let respuesta = swig.renderFile('views/amigos.html',
                    {
                        friends: usuarios,
                        paginas: paginas,
                        actual: pg,
                        mensaje: req.session.mensaje,
                        tipoMensaje: req.session.tipoMensaje,
                        sesion: req.session.usuario
                    });
                req.session.mensaje = null;
                req.session.tipoMensaje = null;
                res.send(respuesta);
            });

        });

    });

};