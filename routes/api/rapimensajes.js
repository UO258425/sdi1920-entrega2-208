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
                if (friends.find(f => f.email === req.body.to) === undefined) {
                    res.status(400);
                    app.get("logger").warn("API: "+res.usuario+" tried to send a message to a non friend");
                    res.json({
                        message: "El destinatario no es tu amigo"
                    });
                } else {
                    gestorBD.insertarMensaje(mensaje, function (id) {
                        if (!id) {
                            res.status(500);
                            app.get("logger").error("API: Error while storing a message");
                            res.json({
                                message: "Error al enviar el mensaje"
                            });
                        } else {
                            app.get("logger").warn("API: "+res.usuario+" sent a message to "+req.body.to);
                            res.status(201);
                            res.json({
                                message: "Mensaje enviado"
                            });
                        }
                    });

                }
            });
        });
    });

    app.get("/api/mensajes", function (req, res) {
        let user1Id = req.headers['user1'];
        let user2Id = req.headers['user2'];

        gestorBD.obtenerUsuarios({email: res.usuario}, function (usuario) {
            if (usuario[0]._id.toString() !== user1Id && usuario[0]._id.toString() !== user2Id) {
                app.get("logger").warn("API: "+res.usuario+" tried to read a conversation to which he does not belong");
                res.status(400);
                res.json({
                    message: "No formas parte de la conversacion"
                });
            } else {
                let criterio2 = {
                    $or: [
                        {_id: gestorBD.mongo.ObjectID(user1Id)},
                        {_id: gestorBD.mongo.ObjectID(user2Id)}
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
                        app.get("logger").info("API: "+res.usuario+" reads a conversation");
                        res.status(200);
                        res.json(mensajes);
                    });
                });


            }
        });

    });

    app.put("/api/mensajes/", function (req, res) {

        if(req.body.messageId.length !== 24){
            app.get("logger").warn("API: "+res.usuario+" tried to mark as readed a message with invalid id");
            res.status(400);
            res.json({
                message: "El id debe tener una longitud de 24 caracteres"
            });
            return;
        }

        gestorBD.obtenerMensajes({_id: gestorBD.mongo.ObjectID(req.body.messageId)}, function (messages) {
            if (messages[0] === undefined) {
                res.status(404);
                app.get("logger").warn("API: "+res.usuario+" tried to mark as readed an unexisting message");
                res.json({
                    message: "El mensaje no existe"
                });
            } else {
                if (messages[0].from === res.usuario || messages[0] === res.usuario) {
                    let mensaje = {
                        _id: messages[0]._id,
                        from: messages[0].from,
                        to: messages[0].to,
                        text: messages[0].text,
                        readed:true
                    };
                    gestorBD.modificarMensaje({_id: mensaje._id}, mensaje, function (result) {
                        if (result === null) {
                            res.status(500);
                            app.get("logger").error("API: Error while marking a message as readed");
                            res.json({
                                message: "Hubo un problema en el servidor al marcar como leído"
                            });
                        }else{
                            res.status(204);
                            app.get("logger").info("API: "+res.usuario+" marked the message "+req.body.messageId+" as readed");
                            res.json({
                                success: true,
                                message: "Mensaje marcado como leído"
                            });
                        }
                    });
                } else {
                    app.get("logger").warn("API: "+res.usuario+" tried to mark as readed a message that does not belong to him");
                    res.status(401);
                    res.json({
                        message: "El mensaje no pertenece a ninguna de tus conversaciones"
                    });
                }
            }
        });

    });


};