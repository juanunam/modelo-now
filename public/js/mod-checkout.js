function doCheckOut(){
    //var sessionUsr = $.session.get('ecommerceUser'); console.log(sessionUsr);
    NProgress.start();
    var checkOut = {};
    var totalPromos='';
    var objPackages = [];

    if( sessionUsr.infoChannelId == "1" && $('#prospectistaId').val == '' ){
        showMessage('error','Invalido','Ingrese el c&oacute;digo del prospectista');
        return false;
    }
    checkOut["informationChannel"] = {"id": sessionUsr.infoChannelId,"name": sessionUsr.infoChannelName };
    var customerIdTemp = sessionUsr.customer != undefined ? sessionUsr.customer : $('#customerId').val() ;
    checkOut["customerId"] = customerIdTemp;
    var fullNameTemp = sessionUsr.fullName != undefined ? sessionUsr.fullName : $('#customerName').val();
    checkOut["customerName"] = fullNameTemp;

    if( sessionUsr.infoChannelId == "1")
        checkOut["prospectCode"] = $('#prospectCode').val();

    var cellphone = sessionUsr.cellPhone != undefined ? sessionUsr.cellPhone : '0';
    var homePhone = sessionUsr.homePhone != undefined ? sessionUsr.homePhone : '0';
    checkOut["customerPhone"] = homePhone+' / '+cellphone;
    checkOut["localityId"] = localityId;
    var valSchedule = $('#typeDelivery:checked').val() == 1 ? "0":"1"; var valDate = '';
    if(valSchedule == "0"){
        sendEvent('Service Parameters','Order Parameters – Order Delivery Time','I');
        valDate = moment().format('DD/MM/YYYY HH:mm:ss');
    }else{
        sendEvent('Service Parameters','Order Parameters – Order Delivery Time','S');
        valDate = $('#deliveryDay').val()+ ' '+$('#deliveryHour').val()+':00:00';
    }
    checkOut["delivery"] = {"isScheduled": valSchedule, "date": valDate };

    $('.list_products tr').each(function(object){
        var idTmp = $(this).attr('id');
        var packageId = objCombos[idTmp].packages[0].id;
        var countTemp = $('input[name="'+idTmp+'"]').val();
        var promoTemp = $(this).find('.promos').text() ? Number($(this).find('.promos').text()) : 0 ;
        totalPromos = Number(totalPromos)+Number(promoTemp);
        var promo = objCombos[idTmp].packages[0].packagesPromo.length >= 1 ? [{ "count":promoTemp, "id": objCombos[idTmp].packages[0].packagesPromo[0].id }] : [];
        objPackages[object] = {
            "count": countTemp,
            "id": packageId,
            "packagePromo": promo
        };
    });
    checkOut["packages"] = objPackages;
    checkOut["paymentType"] = {"type": $('#typePayment').val(),"change": $('#typeChange').val() };
    checkOut["totalPromos"] = totalPromos;
    checkOut["address"] = {
                            "lat": $('#lat').val(),
                            "lon": $('#lon').val(),
                            "street": $('#street').val(),
                            "noExt": $('#noExt').val(),
                            "noInt": $('#noInt').val(),
                            "neighborhood": $('#neighborhood').val(),
                            "town": $('#town').val(),
                            "stateName": $('#stateName').val(),
                            "zipCode": $('#zipCode').val(),
                            "references": $('#noExt').val()
                        };
    checkOut["comment"] = $('#references').val();
    checkOut["userId"] = $('#userId').val();
    checkOut["userName"] = $('#userName').val();
    checkOut["channel"] = {"id": "1","name": "WEB"};
    var temp = JSON.stringify(checkOut, null, 4);

    $.ajax({
        url: "./store/saveOrder",
        data: temp,
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        success: function(response){
              if(response.status == 'SUCCESS'){
                  showMessage('success','Nuevo Pedido','El pedido se ha enviado a ModeloNow, pronto ser&aacute; asignado a un repartidor y estar&aacute; llegando a su casa, Gracias!!');
                  $.session.set('checkOutSuccessInfo',JSON.stringify(response.data));
                  processSale('ordercomplete');
                  // div container from ecommerce cart is cleaned
                  $('.list_products').html('');
                  //$.session.remove('car');
                  $('span.badge').text('0').fadeToggle('fast').fadeToggle('fast');
                  $('.txtTotal').text('');
                  totalBeers = 0;
                  objPackages = [];
                  totalItems = Number(0);
                  calculateTotal();
                  calculateItems();
                  objUser['car'] = {'content':''};
                  $.session.set('ecommerceCar','');
                  sendEvent('Shopping Funnel','Order_Placed',1);
                  fbq('track', 'Purchase', {value: '0.00', currency: 'USD'});
                  setTimeout( function(){ window.location.href = 'checkout?orderId='+response.data.orderID+'' }, 500);
              }else{
                  closeWindow();
                  showMessage('error','Error','No es posible generar tu pedido, si te encuentras fuera del horario de servicio selecciona la opci&oacute;n de pedido programado y verifica que el domicilio de entrega se encuentre dentro del &aacute;rea de servicio');//response.errors[0].message
                  sendEvent('Shopping Funnel','Order_Placed',0);
              }
        },
        error: function(){
            var errorM = response.errors[0].message == undefined ? 'Por el momento no es posible procesar compras.' : response.errors[0].message;
            showMessage('error','Error','Por el momento no es posible procesar compras, intente más tarde');
            closeWindow();
        },
        headers : {
            'X-CSRF-Token' : $("meta[name='_csrf']").attr("content")
        }
    });
    NProgress.done();
}
function closeWindow(){
    $(".sidebar--cart, .sidebar--register").css("display","none");
    if( $("body").hasClass("overflow") ){ $("body").removeClass("overflow"); }
}
