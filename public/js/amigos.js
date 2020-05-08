window.history.pushState("", "", "/cliente.html?w=canciones");

var canciones;

function cargarAmigos() {
    $.ajax({
        url: URLbase + "/amigos",
        type: "GET",
        data: {},
        dataType: 'json',
        headers: {"token": token},
        success: function (respuesta) {
            amigos = respuesta;
            if($("#tablaAmigos").length !== 0)
                actualizarTabla(amigos);
        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });
}
function actualizarTabla(amigos) {
    $("#tablaAmigos").empty(); // Vaciar la tabla
    for (i = 0; i < amigos.length; i++) {
        $("#tablaAmigos").append(
            "<tr id=" + amigos[i]._id + ">" +
            "<td> <a onclick=conversacion('" +  amigos[i]._id+"','"+amigos[i].name+amigos[i].surname+"','"+amigos[i].email+"')>"+ amigos[i].name + "</a></td>" +
            "<td>" + amigos[i].surname + "</td>" +
            "<td>" + amigos[i].email + "</td>" +
            "</tr>");

    }
}

cargarAmigos();



$('#filtro-nombre').on('input',function(e){
    var amigosFiltrados = [];
    var nombreFiltro = $("#filtro-nombre").val();

    for (i = 0; i < amigos.length; i++) {
        if (amigos[i].name.indexOf(nombreFiltro) != -1 ){
            amigosFiltrados.push(amigos[i]);
        }
    }
    actualizarTabla(amigosFiltrados);
});

function conversacion(_id, fullName, email) {
    idAmigoSeleccionado = _id;
    yourFriendFullName = fullName;
    yourFriendsEmail =email;
    $( "#contenedor-principal" ).load( "widget-conversacion.html");
    conversacionIntervalID = setInterval(function () {
        cargarMensajes()
    },2500);
}