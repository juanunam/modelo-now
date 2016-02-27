/**
 * Created by daniel on 11/01/16.
 */

// submit of the password recovery form
$("#recoveryPasswordBtn").click(function () {

        //console.log('Recuperación de contraseña');

        var mail = $("#recoveryPasswordEmail").val();
        var recaptcha =  grecaptcha.getResponse(recaptchaPWDRecoveryWidget);

        //console.log('recaptcha response: '+recaptcha)

        if (!mail){
            showMessage('error', 'Aviso!', 'Captura de correo es necesario para recuperar la contrase&ntilde;a');
            return;
        }


        if (!isValidEmail(mail)){
            showMessage('error','Aviso!', 'Correo inv&aacute;lido');
            return;
        }


        if (!recaptcha){
            showMessage('error', 'Aviso!', 'Captura de recaptcha es necesario para poder continuar');
            return;
        }


        $.ajax({
            type: "POST",
            url: "./access/password-recovery",
            data: {
                email: mail,
                recaptcha: recaptcha
            },
            success: function (resp) {
                //reload page once OK, so we can show the 'logged in' message
                //do here what you want, of course
                //console.log(resp.status)
                if (resp.status === 'SUCCESS') {
                    showMessage('info', 'Bienvenido!', 'Ha sido enviado el correo electr&oacute;nico con las instrucciones ' +
                        'para recuperar su contrase&ntilde;a.');
                } else {
                    showMessage('info', 'Aviso!', 'No se ha podido recuperar la contrase&ntilde;a.');
                }

                //location.reload();
            },
            error: function (error) {
                //console.log(error)
            },
            headers: {
                'X-CSRF-Token': $("meta[name='_csrf']").attr("content")
            }
        });

    }
);


function isValidEmail(mail)
{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    {
        return true;
    }
    //console.log("You have entered an invalid email address!")
    return false;
}

