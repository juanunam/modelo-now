/**
 * Created by daniel on 08/01/16.
 */

$(document).on("click",".salir-modelonow",function(){

        //console.log('Logout de modelo now');
        $.ajax({
            type: "POST",
            url: "./logout",
            success: function(resp){
                //reload page once OK, so we can show the 'logged in' message
                //do here what you want, of course
                //location.reload();
                //console.log('Contenido de la respuesta del logout: '+resp);
                $.session.set('ecommerceUser','');
                $.session.set('ecommerceCar','');
                location.reload();
            },
            error: function(error){
                //console.log(error)
            },
            headers : {
                'X-CSRF-Token' : $("meta[name='_csrf']").attr("content")
            }
        });

    }
);

