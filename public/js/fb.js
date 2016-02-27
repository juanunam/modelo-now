/**
 * Created by daniel on 05/01/16.
 */

window.fbAsyncInit = function() {
    FB.init({
        appId      : '948415771874563', //'957592180956922', // todo se debe actualizar el id de fb con el productivo
        xfbml      : true,
        version    : 'v2.5'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


$(document).on('click',"#facebook-login",function() {
    function completeRegister(authRes,resp,response){
        var genero = response.gender === 'M' ? 1:0;
        //console.log('completar facebook');
        //console.log(response);
        $('#form-register').trigger("reset");
        $('#form-register #faceUser').val(response.id);
        $('#form-register #nameUser').val(response.first_name);
        $('#form-register #lastName').val(response.last_name);
        $('#form-register #phoneUser').val();
        $('#form-register #mobileUser').val();
        $('#form-register #dateUser').val();
        $('#form-register #emailUser').val(response.email);
        $('#form-register #gender').val(genero);
        $('#form-register #passUser,#repassUser').attr('readonly',true);
        $('#form-register .divpass').hide();
        processSale('register');
    };
    var fbResponse = '';
    FB.login(function(response) {
        //console.log('Click boton fb'+response);
        if (response.authResponse) {
            var authRes = response.authResponse;
            var connected = response.connected;
            $('#faceUser').val('');
            FB.api('/me', function(response) {
                fbResponse = response;
                $.ajax({
                    type: "POST",
                    url: "./access/facebook-login",
                    data: {
                        accessToken: authRes.accessToken,
                        expiresIn: authRes.expiresIn,
                        signedRequest: authRes.signedRequest,
                        connected: connected,
                        email: response.email,
                        firstName: response.first_name,
                        gender: response.gender,
                        id: response.id,
                        lastName: response.last_name,
                        name: response.name,
                        timezone: response.timezone,
                        verified: response.verified
                    },
                    success: function(resp){
                        var respServer = resp;
                        //location.reload();
                        //console.log(resp); // From modelonow
                        //console.log(response); // from FB

                        if(resp.status === 'SUCCESS'){
                            // if this user had been registered with FB previously
                            $('#faceUser').val(resp.data.idsocial);
                            if(resp.data.registered){
                                //console.log(resp.data);
                                //$("#modelonow-menu").fadeIn().load("./updateMenu");
                                showMessage('info','Bienvenido!','Bienvenido a ModeloNow');
                                //$(".sidebar--register").css("display","none");
                                //$("#btn-order").attr("data-goto",'ubication');
                                loadSession(resp.data);
                                location.reload();
                            }else{
                                showMessage('info','Bienvenido!','Te invitamos a completar la informaci&oacute;n faltante para empezar tu compra dentro de la tienda');
                                completeRegister(authRes,respServer,fbResponse);
                                $(".sidebar--register").css("display","block");
                            }

                        }else{
                            showMessage('error','Aviso!','El usuario ligado a Facebook no se encuentra registrado dentro de ModeloNow');
                            $(".sidebar--cart, .sidebar--register").css("display","none");
                        }

                    },
                    headers : {
                        'X-CSRF-Token' : $("meta[name='_csrf']").attr("content")
                    }
                });
            });
        } else {
            //user hit cancel button
            //console.log('User cancelled login or did not fully authorize.');
        }
    }, {
        //what do you want to retrieve?
        scope: 'public_profile,email'
    });
});

$(function(){
    if($.session.get('ecommerceUser') != undefined){
        $("#btn-order").attr("data-goto",'ubication');
    }
})
