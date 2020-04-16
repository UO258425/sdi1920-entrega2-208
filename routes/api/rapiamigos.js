module.exports = function (app, gestorBD) {


    app.get("/api/amigos", function (req, res) {
        gestorBD.obtenerUsuarios({}, function (usuario) {

            gestorBD.obtenerUsuarios({email: res.usuario}, function (usuario) {
                gestorBD.obtenerUsuarios({email: {$in: usuario[0].friends}}, function (friends) {
                    let friendsIDs = friends.map(friend => friend._id);
                    res.status(200);
                    res.json(friendsIDs);
                });
            });

        });
    });


};