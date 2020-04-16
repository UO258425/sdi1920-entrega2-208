module.exports = function (app, gestorBD) {


    app.post("/api/mensajes/", function (req, res) {
        const mensaje = {
            from: res.usuario,
            to: req.body.to,
            text: req.body.text,
            readed: false
        };
        gestorBD.obtenerUsuarios({email: res.usuario}, function (usuario) {
            gestorBD.obtenerUsuarios({email: {$in: usuario[0].friends}}, function (friends) {
                if (friends.find(f => f.email === req.body.to).size === 0) {
                    res.status(400);
                    res.json({
                        message: "El destinatario no es tu amigo"
                    });
                }
                gestorBD.insertarMensaje(mensaje, function (id) {
                    if (!id) {
                        res.status(500);
                        res.json({
                            message: "Error al enviar el mensaje"
                        });
                    } else {
                        res.status(201);
                        res.json({
                            message: "Mensaje enviado"
                        });
                    }
                });
            });
        });
    });

    app.get("/api/mensajes", function (req, res) {
        let user1Id = req.headers['user1'];
        let user2Id = req.headers['user2'];

        gestorBD.obtenerUsuarios({email: res.usuario}, function (usuario) {
            if (usuario[0]._id.toString() !== user1Id && usuario[0]._id.toString() !== user2Id) {
                res.status(400);
                res.json({
                    message: "No formas parte de la conversacion"
                });
            } else {
                let criterio2 = {
                    $or:[
                        {_id : gestorBD.mongo.ObjectID(user1Id)},
                        {_id : gestorBD.mongo.ObjectID(user2Id)}
                    ]
                };
                gestorBD.obtenerUsuarios(criterio2, function (usuarios) {
                    let criterio = {
                        $or: [
                            {
                                $and: [
                                    {to: {$eq: usuarios[0].email}},
                                    {from: {$eq: usuarios[1].email}}
                                ]
                            },
                            {
                                $and: [
                                    {to: {$eq: usuarios[1].email}},
                                    {from: {$eq: usuarios[0].email}}
                                ]
                            }
                        ]
                    };
                    gestorBD.obtenerMensajes(criterio, function (mensajes) {
                        res.status(200);
                        res.json(mensajes);
                    });
                });


            }
        });

    });


};