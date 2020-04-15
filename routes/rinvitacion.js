module.exports = function (app, swig, gestorBD) {

    app.get('/invitacion/enviar/:to_id', function (req, res) {

        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.to_id)};

        gestorBD.obtenerUsuarios(criterio, function(usuarios){
           if(usuarios[0] === null){
               req.session.mensaje = "Error: el usuario no existe";
               req.session.tipoMensaje = "alert-danger";
               res.redirect("/usuarios");
           }
           else{
               if(usuarios[0].email === req.session.usuario){
                   req.session.mensaje = "Error: no puedes enviarte una petición a ti mismo";
                   req.session.tipoMensaje = "alert-danger";
                   res.redirect("/usuarios");
                   return;
               }
               let criterio = {
                   $and:[
                       {from:{$eq: req.session.usuario}},
                       {to:{$eq: usuarios[0].email}}
                   ]
               };
               gestorBD.obtenerInvitaciones(criterio, function(invitaciones){
                   if (invitaciones[0]==null) {
                       let invitacion = {
                           from:req.session.usuario,
                           to:usuarios[0].email,
                           dateTime:Date.now()
                       }
                       gestorBD.insertarInvitacion(invitacion, function (id) {
                           if (id == null) {
                               req.session.mensaje = "Error al añadir invitacion: Hay un problema con nuestros servidores :(";
                               req.session.tipoMensaje = "alert-danger";
                               res.redirect("/usuarios");
                           } else {
                               req.session.mensaje = "Invitacion enviada";
                               req.session.tipoMensaje = "alert-success";
                               res.redirect('/usuarios');
                           }
                       });
                   } else {
                       req.session.mensaje = "Error: ya hay una petición pendiente";
                       req.session.tipoMensaje = "alert-danger";
                       res.redirect("/usuarios");
                   }
               });
           }
        });
    });

    app.get('/invitaciones', function (req, res) {
        let criterio = {
            to: req.session.usuario
        };

        let pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerInvitacionesPg(criterio, pg, function (invitaciones, total) {
            if (invitaciones == null) {
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
                let criterio = {};
                gestorBD.obtenerUsuarios(criterio, function (users) {
                    if (users == null) {
                        res.send("Error al listar ");
                    } else {
                        let invitacionesCompletas = invitaciones.map( invi => {
                            invi.from = users.find(user => user.email === invi.from);
                            return invi;
                        });
                        console.log(invitacionesCompletas[0].from.name);

                        let respuesta = swig.renderFile('views/invitaciones.html',
                            {
                                invitaciones: invitacionesCompletas,
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


            }
        });
    });


};