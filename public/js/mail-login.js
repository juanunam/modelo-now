/**
 * Created by daniel on 07/01/16.
 */

$("#mail-login-btn").click(function(){

        //console.log('Probando el click del login');

        var pwd = $("#password-credential").val();
        var mail = $("#mail-credential").val();

        if (!pwd || !mail){
            showMessage('error','Aviso!','El usuario y la contrase&ntilde;a son obligatorios para ingresar a su cuenta');
            return;
        }


        $.ajax({
            type: "POST",
            url: "./access/mail-login",
            data: {
                email: mail,
                password: md5(pwd)
            },
            success: function(resp){
                //reload page once OK, so we can show the 'logged in' message
                //do here what you want, of course
                //console.log(resp.status)
                sendEvent('Shopping Funnel','Log in Into Account',1);
                if(resp.status === 'SUCCESS'){
                    //$("#modelonow-menu").fadeIn().load("./updateMenu");
                    showMessage('info','Bienvenido!','Bienvenido a ModeloNow');
                    //$(".sidebar--register").css("display","none");
                    //$("#btn-order").attr("data-goto",'ubication');
                    loadSession(resp.data);
                    location.reload();
                }else{
                    showMessage('error','Aviso!','El usuario y la contrase&ntilde;a son incorrectos');
                    $(".sidebar--cart, .sidebar--register").css("display","none");
                }

                //console.log('Contenido de la respuesta del login: '+resp);
            },
            error: function(error){
                //console.log(error)
                sendEvent('Shopping Funnel','Log in Into Account',0);
                $(".sidebar--cart, .sidebar--register").css("display","none");
            },
            headers : {
                'X-CSRF-Token' : $("meta[name='_csrf']").attr("content")
            }
        });

    }
);
