let logger = null;
module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
        logger = app.get("logger");
    },
    deleteAllUsuarios: function () {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                console.log(err);
            } else {
                let collection = db.collection('usuarios');
                collection.remove({}, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        logger.trace("Collection usuarios deleted");
                        module.exports.insertarAllUsuarios();
                    }
                    db.close();
                });
            }
        });
    },
    deleteAllMensajes: function () {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                console.log(err);
            } else {
                let collection = db.collection('mensajes');
                collection.remove({}, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        logger.trace("Collection mensajes deleted");
                        module.exports.insertarAllMensajes();
                    }
                    db.close();
                });
            }
        });
    },
    deleteAllInvitaciones: function () {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                console.log(err);
            } else {
                let collection = db.collection('invitaciones');
                collection.remove({}, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        logger.trace("Collection invitaciones deleted");
                        module.exports.insertarAllInvitaciones();
                    }
                    db.close();
                });
            }
        });
    },
    insertarAllUsuarios: function () {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                console.log(err);
            } else {
                //@formatter:off
                let usuarios = [
                    {"email":"prueba1@prueba1","password":"57420b1f0b1e2d07e407a04ff8bbc205a57b3055b34ed94658c04ed38f62daa7","name":"nombre1","surname":"apellidos1","friends":["prueba2@prueba2","prueba3@prueba3","prueba4@prueba4","prueba5@prueba5","prueba6@prueba6"]},
                    {"email":"prueba2@prueba2","password":"767b99cac9736794a079924ea108fc3614754c2c44d10f57c9a8d490018f0fdc","name":"nombre2","surname":"apellidos2","friends":["prueba1@prueba1"]},
                    {"email":"prueba3@prueba3","password":"fc9dcc48d6e0412b46b0538f880beea892d7ae86d9d5bc6d442031ba8df7f4c2","name":"nombre3","surname":"apellidos3","friends":["prueba1@prueba1"]},
                    {"email":"prueba4@prueba4","password":"a42369becb4bf8e50b04536f4a259ce5de632d674c222f3293eee937b831e60b","name":"nombre4","surname":"apellidos4","friends":["prueba1@prueba1"]},
                    {"email":"prueba5@prueba5","password":"d42172705d149c286a0245624c171a26897724773f7d3921aa06b314af4675dc","name":"nombre5","surname":"apellidos5","friends":["prueba1@prueba1"]},
                    {"email":"prueba6@prueba6","password":"3426f86635d0a9502b4fb4db77a2652d76d06da299378d0c2043a35a6e4dfdd3","name":"nombre6","surname":"apellidos6","friends":["prueba1@prueba1"]},
                    {"email":"prueba7@prueba7","password":"9caf5e22c4506068a5fedde7a828658d53c8599a8f93574e2cb50b0c33753a48","name":"nombre7","surname":"apellidos7","friends":[]},
                    {"email":"prueba8@prueba8","password":"5330b5b9b1e7e467f1f701bbcd6ded4b4d68bcaf5100aba25d4f05f9d1a8dd85","name":"nombre8","surname":"apellidos8","friends":[]},
                    {"email":"prueba9@prueba9","password":"37c776ea3714484cedf53ca88305461c0d11f5786a7fd8728b92ed35856d46e4","name":"nombre9","surname":"apellidos9","friends":[]},
                    {"email":"prueba10@prueba10","password":"1d4e2df342c81f75a021d5e77e4b068a36345c2068f2668fcabccd2debfed8a8","name":"nombre10","surname":"apellidos10","friends":[]},
                    {"email":"prueba11@prueba11","password":"04c3d223c6366575b65477cb2471becb749da4fdd508ac89caf7bb72ba9a1d89","name":"nombre11","surname":"apellidos11","friends":[]},

                ];
                //@formatter:on
                let collection = db.collection('usuarios');
                collection.insertMany(usuarios, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        logger.trace("Collection usuarios restarted");
                    }
                    db.close();
                });
            }
        });
    },
    insertarAllMensajes: function () {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                console.log(err);
            } else {
                //@formatter:off
                let mensajes = [
                    {"from":"prueba1@prueba1","to":"prueba2@prueba2","text":"hola","readed":false},
                    {"from":"prueba2@prueba2","to":"prueba1@prueba1","text":"hola!","readed":false},
                    {"from":"prueba1@prueba1","to":"prueba2@prueba2","text":"que tal?","readed":false},
                    {"from":"prueba2@prueba2","to":"prueba1@prueba1","text":"yo bien, y tu?","readed":false},
                    {"from":"prueba1@prueba1","to":"prueba2@prueba2","text":"yo tambien estoy bien, gracias por preguntar","readed":false},
                    {"from":"prueba2@prueba2","to":"prueba1@prueba1","text":"de nada!","readed":false},
                    {"from":"prueba1@prueba1","to":"prueba2@prueba2","text":"has visto como mola esta app?","readed":false},
                    {"from":"prueba2@prueba2","to":"prueba1@prueba1","text":"Si!, es fantastica","readed":false},
                    {"from":"prueba1@prueba1","to":"prueba2@prueba2","text":"Voy a desinstalarme whatsapp","readed":false},
                    {"from":"prueba2@prueba2","to":"prueba1@prueba1","text":"yo tambien, esto es lo mejor","readed":false},
                    {"from":"prueba1@prueba1","to":"prueba2@prueba2","text":"bueno me voy","readed":false},
                    {"from":"prueba2@prueba2","to":"prueba1@prueba1","text":"hasta luego","readed":false},
                    {"from":"prueba1@prueba1","to":"prueba2@prueba2","text":"ten un buen dia!","readed":false},
                    {"from":"prueba2@prueba2","to":"prueba1@prueba1","text":"igualmente!","readed":false},
                ];
                //@formatter:on
                let collection = db.collection('mensajes');
                collection.insertMany(mensajes, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        logger.trace("Collection mensajes restarted");

                    }
                    db.close();
                });
            }
        });
    },
    insertarAllInvitaciones: function () {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                console.log(err);
            } else {
                //@formatter:off
                let invitaciones = [
                    {"from":"prueba3@prueba3","to":"prueba2@prueba2","dateTime":Date.now()},
                    {"from":"prueba4@prueba4","to":"prueba2@prueba2","dateTime":Date.now()},
                    {"from":"prueba5@prueba5","to":"prueba2@prueba2","dateTime":Date.now()},
                    {"from":"prueba6@prueba6","to":"prueba2@prueba2","dateTime":Date.now()},
                    {"from":"prueba3@prueba3","to":"prueba4@prueba4","dateTime":Date.now()},
                    {"from":"prueba2@prueba2","to":"prueba4@prueba4","dateTime":Date.now()},
                    {"from":"prueba5@prueba5","to":"prueba4@prueba4","dateTime":Date.now()},
                    {"from":"prueba6@prueba6","to":"prueba4@prueba4","dateTime":Date.now()},
                    {"from":"prueba7@prueba7","to":"prueba1@prueba1","dateTime":Date.now()},
                    {"from":"prueba8@prueba8","to":"prueba1@prueba1","dateTime":Date.now()},
                    {"from":"prueba9@prueba9","to":"prueba1@prueba1","dateTime":Date.now()},
                    {"from":"prueba10@prueba10","to":"prueba1@prueba1","dateTime":Date.now()},
                ];
                //@formatter:on
                let collection = db.collection('invitaciones');
                collection.insertMany(invitaciones, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        logger.trace("Collection invitaciones restarted");
                    }
                    db.close();
                });
            }
        });
    },
    restartDatabase: function () {
        this.app.get("logger").trace("Restarting database. Deleting all collections and inserting new ones");

        module.exports.deleteAllUsuarios();
        module.exports.deleteAllMensajes();
        module.exports.deleteAllInvitaciones();


    },
    logCompleteAction: function(collection){
    }

};
