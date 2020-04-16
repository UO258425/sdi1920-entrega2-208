let express = require('express');
let app = express();

let rest = require('request');
app.set('rest',rest);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    // Debemos especificar todas las headers que se aceptan. Content-Type , token
    next();
});

var jwt = require('jsonwebtoken');
app.set('jwt', jwt);

let fs = require('fs');
let https = require('https');

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

let crypto = require('crypto');

let mongo = require('mongodb');
let swig = require('swig');

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let gestorBD = require("./modules/gestorDB.js");
gestorBD.init(app, mongo);

// routerUsuarioToken
var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function(req, res, next) {
    // obtener el token, vía headers (opcionalmente GET y/o POST).
    var token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', function(err, infoToken) {
            if (err || (Date.now()/1000 - infoToken.tiempo) > 240 ){
                res.status(403); // Forbidden
                res.json({
                    acceso : false,
                    error: 'Token invalido o caducado'
                });
                // También podríamos comprobar que intoToken.usuario existe
                return;

            } else {
                // dejamos correr la petición
                res.usuario = infoToken.usuario;
                next();
            }
        });

    } else {
        res.status(403); // Forbidden
        res.json({
            acceso : false,
            mensaje: 'No hay Token'
        });
    }
});
// Aplicar routerUsuarioToken
app.use('/api', routerUsuarioToken);


// routerUsuarioSession
let routerUsuarioSession = express.Router();
routerUsuarioSession.use(function (req, res, next) {
    console.log("routerUsuarioSession");
    if (req.session.usuario) {
        // dejamos correr la petición
        next();
    } else {
        console.log("va a : " + req.session.destino)
        res.redirect("/login");
    }
});
app.use("/usuarios", routerUsuarioSession);
app.use("/invitacion", routerUsuarioSession);
app.use("/invitaciones", routerUsuarioSession);
app.use("/amigos", routerUsuarioSession);


app.use(express.static('public'));

app.set('port', 8081);
app.set('db', 'mongodb://mysocialnetworkadmin:4P10lOy5gR0px5s5@mysocialnetwork-shard-00-00-zsypy.mongodb.net:27017,mysocialnetwork-shard-00-01-zsypy.mongodb.net:27017,mysocialnetwork-shard-00-02-zsypy.mongodb.net:27017/test?ssl=true&replicaSet=MySocialNetwork-shard-0&authSource=admin&retryWrites=true');
app.set('clave', 'abcdefg');
app.set('crypto', crypto);



require("./routes/rusuarios.js")(app, swig, gestorBD);
require("./routes/rinvitacion.js")(app, swig, gestorBD);
require("./routes/ramigos.js")(app, swig, gestorBD);
require("./routes/rerror.js")(app, swig);


app.get('/', function (req, res) {
    //res.redirect('/index');
    res.send(swig.renderFile("views/index.html",  {
        sesion:req.session.usuario
    }));
});


app.use(function(err,req,res,next){
    console.log("Error producido: "+err);
    if(!res.headersSent){
        res.status(400);
        res.send("Recurso no disponible");
    }
});


https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt')
}, app).listen(app.get('port'), function() {
    console.log("Servidor activo");
});