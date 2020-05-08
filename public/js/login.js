window.history.pushState("", "", "/cliente.html?w=login");

$("#boton-login").click(function(){
    $.ajax({
        url:URLbase+"/autenticar",
        type:"POST",
        data:{
            email: $("#email").val(),
            password: $("#password").val()
        },
        dataType:'json',
        success: function(respuesta){
            console.log(respuesta.token);
            token = respuesta.token;
            yourID = respuesta.yourID;
            yourEmail = $("#email").val();
            Cookies.set('token', respuesta.token);
            $("#contenedor-principal").load("widget-amigos.html");
        },
        error: function(error){
            Cookies.remove('token');
            $("#widget-login").prepend("<div class='alert alert-danger'>Autenticación fallida</div>");
        }
    });
});
