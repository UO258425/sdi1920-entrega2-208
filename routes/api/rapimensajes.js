module.exports = function (app, gestorBD) {


    app.post("/api/mensajes", function (req, res) {
        const mensaje = {
            from: res.usuario,
            to: req.body.to,
            text: req.body.text,
            readed: false
        };
        gestorBD.obtenerUsuarios({email: res.usuario}, function (usuario) {
            gestorBD.obtenerUsuarios({email: {$in: usuario[0].friends}}, function (friends) {
                if(friends.find(f => f.email===req.body.to).size === 0){
                    res.status(400);
                    res.json({
                        message : "El destinatario no es tu amigo"
                    });
                }
                gestorBD.insertarMensaje(mensaje, function(id){
                    if(!id){
                        res.status(500);
                        res.json({
                            message : "Error al enviar el mensaje"
                        });
                    }else{
                        res.status(201);
                        res.json({
                            message: "Mensaje enviado"
                        });
                    }
                });
            });
        });
    });


};