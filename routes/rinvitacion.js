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


};