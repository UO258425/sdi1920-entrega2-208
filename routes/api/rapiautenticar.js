module.exports = function (app, gestorBD) {


    app.post("/api/autenticar/", function(req,res){
        let seguro = app.get("crypto")
            .createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email : req.body.email,
            password : seguro
        };

        gestorBD.obtenerUsuarios(criterio, function(usuarios){
            if(usuarios == null || usuarios.length === 0){
                app.get("logger").warn("API: User "+criterio.email+" tried to autenticate and failed");
                res.status(401);
                res.json({
                    autenticado : false
                });
            }else{
                app.get("logger").info("API: User "+criterio.email+" autenticated");
                var token = app.get('jwt').sign({
                    usuario:criterio.email,
                    tiempo: Date.now()/1000
                }, "secreto");
                res.status(200);
                res.json({
                    autenticado : true,
                    token:token,
                    yourID: usuarios[0]._id
                });
            }
        });
    });

};
