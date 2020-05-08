function enviar( ) {
    $.ajax({
        url: URLbase + "/mensajes",
        type: "POST",
        data: {
            to : yourFriendsEmail,
            text : $("#input-mensaje").val(),
        },
        dataType: 'json',
        headers: { "token": token },
        success: function(respuesta) {
            console.log(respuesta); // <-- Prueba
            //$( "#contenedor-principal" ).load( "widget-canciones.html");
            cargarMensajes();

        },
        error : function (error){
            $( "#contenedor-principal" ).load("widget-login.html");
        }
    });
}

$("#friendID").text(yourFriendFullName);


function cargarMensajes() {
    $.ajax({
        url: URLbase + "/mensajes",
        type: "GET",
        data: {},
        dataType: 'json',
        headers: {
            "token": token,
            user1: yourID,
            user2: idAmigoSeleccionado
        },
        success: function (respuesta) {
            mensajes = respuesta;
            console.log(yourID);
            console.log(idAmigoSeleccionado);
            console.log(mensajes);
            if($("#tablaConversacion").length !== 0)
                actualizarTabla(mensajes);
        },
        error: function (error) {
            $("#contenedor-principal").load("widget-login.html");
        }
    });
}

function actualizarTabla(mensajes) {
    $("#tablaConversacion").empty(); // Vaciar la tabla
    for (i = 0; i < mensajes.length; i++) {
        if(mensajes[i].from === yourEmail){
            $("#tablaConversacion").append(
                "<tr id=" + mensajes[i]._id + ">" +
                "<td>" + mensajes[i].text + "</td>" +
                "<td></td>" +
                "</tr>");
        }
        else{
            $("#tablaConversacion").append(
                "<tr id=" + mensajes[i]._id + ">" +
                "<td></td>" +
                "<td>" + mensajes[i].text + "</td>" +
                "</tr>");
        }
    }
}

function loadWidgetAmigos(){
    window.clearInterval(conversacionIntervalID);
    widgetAmigos();
}

cargarMensajes();

/*let conversacionIntervalID = setInterval(function () {
    cargarMensajes();
}, 1000);
*/