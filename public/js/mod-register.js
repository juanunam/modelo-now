var fechatemp = '';
function drawMap(){
    $("#geocomplete").geocomplete({
        map: ".map_canvas",
        details: "#newAddress",
        location: "México",
        detailsAttribute: "data-geo",
        markerOptions: {
            draggable: true
        },
        mapOptions: {
            zoom: 3,
            scrollwheel: true
        },
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        fullscreenControl: true

    });//.trigger('resize');

    $("#geocomplete").bind("geocode:dragged", function(event, latLng){
        $("#lat").val(latLng.lat());
        $("#lon").val(latLng.lng());
        getCoverage();
    });
    $("#geocomplete").bind("geocode:click", function(events, result){
        console.log(result);
    });
    $("#reset").click(function(){
        $("#geocomplete").geocomplete("resetMarker");
        //$("#reset").hide();
        return false;
    });
    $("#geocomplete").geocomplete("find", $('#localityName').val()+",México");
    var map = $("#geocomplete").geocomplete("map");
    map.setZoom(3);
}
$(function(){
    $(document).on("click","#find",function(){
        var street = $('#street').val() != '' ? limpiar( $('#street').val() )+' ' : '';
        var number = $('#noExt').val() != '' ? $('#noExt').val()+', ' : '';
        var colonia = $('#neighborhood').val() != '' ? limpiar($('#neighborhood').val())+', ' : '';
        var codigo = $('#zipCode').val() != '' ? $('#zipCode').val()+', ' : '';
        var ciudad = $('#town').val() != null ? limpiar($('#town').val())+', ' : '';
        var state = $('#stateName').val() != null ? limpiar($('#stateName').val())+', ' : '';
        $('#geocomplete').val( utf8_decode(street)+number+utf8_decode(colonia)+codigo+ciudad+state );
        $("#geocomplete").trigger("geocode").trigger("geocode");
        setTimeout(getCoverage,100);
    });
});
function limpiar(text){
    if(text!=undefined){
        var text = text.toLowerCase(); // a minusculas
        text = text.replace(/[áàäâå]/, 'a');
        text = text.replace(/[éèëê]/, 'e');
        text = text.replace(/[íìïî]/, 'i');
        text = text.replace(/[óòöô]/, 'o');
        text = text.replace(/[úùüû]/, 'u');
        text = text.replace(/[ýÿ]/, 'y');
        /*text = text.replace(/[ñ]/, 'n');
         text = text.replace(/[ç]/, 'c');
         text = text.replace(/['"]/, '');
         text = text.replace(/[^a-zA-Z0-9-]/, '');
         text = text.replace(/\s+/, '-');
         text = text.replace(/' '/, '-');
         text = text.replace(/(_)$/, '');
         text = text.replace(/^(_)/, '');*/
        return text;
    }
}
function getCoverage(){
    $('#coverage').removeClass('green').removeClass('red');
    if( $("#newAddress #lat").val() != '' ){
        $.ajax({
            url: "./store/verify/locality",
            data: { lat: $("#newAddress #lat").val(), lon: $("#newAddress #lon").val() },
            success: function(response){
                if(response.status == 'SUCCESS' && response.data != null){
                    $('#coverage').addClass('green').removeClass('red');
                    //$('#btn-confirm').removeClass('disabled');
                }
                else{
                    $('#coverage').addClass('red').removeClass('green');
                    //$('#btn-confirm').addClass('disabled');
                }
            }
        });
    }
}
function processSale(pass){
    switch(pass){
        case 'initial' :
            break;
        case 'register' :
            break;
        case 'doregister':
            if($('#nameUser').val() == ''){
                showMessage('error','Verificar datos','Favor de introducir su nombre'); processSale('register'); return false; }
            if($('#lastName').val() == ''){
                showMessage('error','Verificar datos','Favor de introducir su apellido'); processSale('register'); return false; }
            if( $('#phoneUser').val().match(/^([0-9]+){9}$/) == null){
                showMessage('error','N&uacute;mero  telef&oacute;nico incorrecto','Favor de ingresar n&uacute;mero de 9 d&iacute;gitos'); processSale('register'); return false; }
            if($('#dateUser').val() == ''){
                showMessage('error','Verificar datos','Favor de introducir su fecha de nacimiento'); processSale('register'); return false; }
            if($('#emailUser').val() == '' || $('#emailUser').val().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/) == null ){
                showMessage('error','Verificar datos','Favor de introducir un email v&aacute;lido'); processSale('register'); return false; }

            fechatemp = $('#dateUser').val(); var anio='';
            if(fechatemp.indexOf('-') >= 0){
                fechatemp = fechatemp.split('-'); anio = fechatemp[0];
                if( $('#dateUser').val().match(/^([0-9]{4}[-][0-9]{2}[-][0-9]{2})$/) == null ) {
                    showMessage('error', 'Verificar datos', 'Fecha de nacimiento inv&aacute;lida');
                    processSale('register');
                    return false;
                }
            }else {
                fechatemp = fechatemp.split('/');
                anio = fechatemp[2];
                if ($('#dateUser').val().match(/^([0-9]{2}\/[0-9]{2}\/[0-9]{4})$/) == null) {
                    showMessage('error', 'Verificar datos', 'Fecha de nacimiento inv&aacute;lida');
                    processSale('register');
                    return false;

                }
            }

            if(Number(anio) > 1998){ showMessage('error','Usuario menor de edad','La persona que se registre debe ser mayor de edad'); processSale('register'); return false; }

            if($('#informationChannelId').val() == "") {showMessage('error','Verificar datos','Favor de introducir como se enter&oacute; del servicio'); processSale('register'); return false;}

            var tmpInformationChannel  = $('#informationChannelId').val();
            if (tmpInformationChannel == ''){
                showMessage('error', 'Aviso!', 'Seleccione el medio por el cu&aacute;l se enter&oacute; del servicio');return false;
            }else if(tmpInformationChannel == '1'){
                if( $('#prospectistaId').val() == '' ){
                    showMessage('error', 'Aviso!', 'Seleccione el c&oacute;digo de prospectista');return false;
                }
            }

            if($('#faceUser').val()== '' && $('#passUser').val() == ''){
                showMessage('error','Verificar datos','Favor de introducir su password'); processSale('register'); return false; }

            if($('#terms').prop('checked') == false ){
                showMessage('error','Verificar datos','Debe aceptar los t&eacute;rminos y condiciones para poder continuar'); return false; }
            var recaptcha =  grecaptcha.getResponse(recaptchaSignUpWidget);

            if (!recaptcha){ showMessage('error', 'Aviso', 'Captura de recaptcha es necesario para poder continuar');return false;}

            doRegister(recaptcha);
            break;
        case 'login' :
            break;
        case 'recover' :
            break;
        case 'ubication' :
            if($('.list_products').html() == ''){
                showMessage('error','Carrito Vac&iacute;o','Debe seleccionar al menos un producto para poder continuar'); closeWindow(); return false; }
            if( $.session.get('ecommerceUser') == '' || $.session.get('ecommerceUser') == undefined ){
                processSale('initial');
                return false;
            }else{
                drawMap();
            }
            break;
        case 'confirm' :
            if($('#lat').val() == '' || $('#lon').val() == '') {showMessage('error','Ubicaci&oacute;n no encontrada','Debe utilizar el campo de "Busca tu direcci&oacute;n" para obtener un punto de entrega v&aacute;lido'); return false;}
            if($('#street').val() == '') {showMessage('error','Direcci&oacute;n incompleta','Debe ingresar el nombre de su calle'); sendEvent('Service Parameters','Order Parameters – Address validation',0); return false;}
            if($('#noExt').val() == '') {showMessage('error','Direcci&oacute;n incompleta','Debe ingresar el n&uacute;mero de su calle'); return false;}
            if($('#zipCode').val() == '' || $('#zipCode').val().match(/^([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}$/) == null ) {showMessage('error','Direcci&oacute;n incompleta','Debe ingresar el c&oacute;digo postal v&aacute;lido'); return false;}
            if($('#neighborhood').val() == '') {showMessage('error','Direcci&oacute;n incompleta','Debe ingresar la colonia'); return false;}
            if($('#town').val() == '') {showMessage('error','Direcci&oacute;n incompleta','Debe ingresar el municipio'); return false;}
            if($('#stateName').val() == '') {showMessage('error','Direcci&oacute;n incompleta','Debe ingresar el estado'); return false;}
            if($('#typeTemperature:checked').length == 0) {showMessage('error','Detalle de pedido','Dinos si quieres tus cervezas fr&iacute;as o al tiempo'); return false;}
            if($('#typePayment:checked').length == 0) {showMessage('error','Detalle de pedido','Seleccione forma de pago'); return false;}

            if( $('#isClosed').val() == 'true' && $('#typeDelivery:checked').val() == 1){
                showMessage('error', 'Cerrado', 'Lo sentimos por el momento no hay entrega a domicilio, pero puedes programarla para d&iacute;as posteriores. ');
                return false;
            }

            if($('#btn-confirm').hasClass('disabled') == true) {showMessage('error','Detalle de pedido','Por el momento no contamos con servicio en la direcci&oacute;n que ingresaste'); return false;}

            sendEvent('Service Parameters','Order Parameters – Address validation',1);

            if( calculateItems() > 0 ){
                getTotalBeers();
                sendEvent('Shopping Funnel','Order_Details',1);
                fbq('track', 'InitiateCheckout');
            }else{
                $(".sidebar--cart").css("display","none");
                $(".sidebar--register").css("display","none");
                showMessage('error','Aviso!','No ha seleccionado ningun producto para su compra');
            }
            break;
        case 'checkout' :
            doCheckOut();
            //window.location.href = 'checkout.html';
            break;
        case 'ordercomplete':
            showCheckOutInfo();
            break;
        default:
            break;
    }
    $(".sidebar--cart").css("display","none");
    $(".sidebar--register").css("display","block");
    $("div[class*='pass-']").css("display","none");
    $(".pass-"+pass).css("display","block");
}
function validate(form){
    switch(form){
        case 'register':
            return true;
            break;
        case 'login':
            break;
        case 'ubication':
            break;
        default:
            break;
    }

}
function showCheckOutInfo(){

    var checkoutinfo = $.session.get('checkOutSuccessInfo');
    //console.log(checkoutinfo);
    var info = jQuery.parseJSON(checkoutinfo);

    var content= '<div class="panel-heading text-center">';
    content+= 'Asignando Orden <strong>No.'+info.orderID+'</strong>';
    content+= '</div>';
    /*content+= '<div class="panel-body">';
     content+= '<div class="confirmation-block__group form-group col-sm-12 text-center">';
     content+= '<div class="panel panel-default">';
     content+= '<div class="panel-body">';
     content+= '<h2 class="timestamp"><i class="fa fa-clock-o"></i> 45 Minutos</h2>'; //'+info.estimatedDeliveryTime+'
     content+= '<h5 class="desc">Tiempo aproximado de entrega</h5>';
     content+= '</div></div></div></div>';*/

    $("#order-complete-panel").html(content).fadeIn();

    // after success checkout is shown on screen, the old value stored inside of session is removed
    $.session.remove('checkOutSuccessInfo');

}
function getTotalBeers(){
    var totalPromos = 0; var sum = 0; var subTotal = 0 ; var total = 0;
    $('.promos').each(function(){
        totalPromos += Number($(this).text());
    });

    $('input.numItems').each(function(){
        sum += Number($(this).val());
        //console.log( sum );
    });
    totalItems = sum;

    $('.cart_productlist__total').each(function(){
        var priceTmp = $(this).text();
        total += parseFloat( (priceTmp.substring(1,priceTmp.length) + "").replace(',', '') );
    });

    $('#txtBeers,#txtSubtotal').text(totalItems);
    $('#txtPrice,#txtPriceSubtotal').text(' $'+format2(total)+'' ).formatCurrency();
    $('#txtPromo').text(totalPromos);

}
function doRegister(recaptcha){
    NProgress.start();
    var variables = $('#form-register').serialize();
    var lastName = $('#lastName').val().split();
    var newdate = $('#dateUser').val().split('-');
    closeWindow();
    newdate = newdate[2]+'/'+newdate[1]+'/'+newdate[0];
    var phone1=''; var phone2='';
    if( $('#phoneType').val() == 1 )
        phone1 = $('#phoneUser').val();
    else
        phone2 = $('#phoneUser').val();
    $.ajax({
        type: "POST",
        url: "./access/signup",
        data: {
            name:$('#nameUser').val(),
            lastName:lastName[0],
            lastName2:lastName[1],
            email:$('#emailUser').val(),
            homePhone:phone1,
            cellPhone:phone2,
            facebookLoginId:$('#faceUser').val(),
            password:md5($('#passUser').val()),
            localityId:localityId,
            birthDate:newdate,
            informationChannelId:$('#informationChannelId').val(),
            prospect_code:$('#prospectCode').val(),
            channelId:'1',
            recaptcha:recaptcha
        },
        success: function(response){
            $.session.set('ecommerceUser',JSON.stringify(response.data));
            sendEvent('Shopping Funnel','Checkout Started Login – Create Account',1);
            fbq('track', 'CompleteRegistration');

            setTimeout(function(){ NProgress.done();location.reload();},500);
        },
        error: function(){
            $.session.set('ecommerceUser','');
            NProgress.done();
            showMessage('error','Error de registro','Rellene los campos necesarios');
            sendEvent('Shopping Funnel','Checkout Started Login – Create Account',0);
        },
        headers : {
            'X-CSRF-Token' : $("meta[name='_csrf']").attr("content")
        }
    });

}

function showMessage(type,title,message){
    new PNotify({
        title: title,
        text: message,
        type: type,
        nonblock: {
            nonblock: true,
            nonblock_opacity: .2
        }
    });
}

$(function() {
    if( $('#informationChannelId').val() == "1" ) $('#prospectCode').show();
    $(document).on('click','.btn-confirm', function(){
        if( $('#informationChannelId').val() == "1" && $('#prospectCode').val() == '') {
            showMessage('error','Verificar','Antes de finalizar seleccione un c&oacute;digo de prospectista');
            $('#prospectCode').focus();
            return false;
        }else{
            processSale('checkout');
        }
    });
    $(document).on("click",'button,a',function(){ var pass = $(this).attr('data-goto'); if(pass!=undefined)processSale(pass); });
    $(document).on("click",'.fa-trash-o',function(){ $(this).closest('tr').fadeOut('slow').remove(); calculateItems(); calculateTotal(); saveCar();});
    $(document).on('change','#informationChannelId',function(){ if( $(this).val() == 1 ){$('#prospectCode').val('').show();}else{$('#prospectCode').val('').hide()} });
});
