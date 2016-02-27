var objCombos = [];
//var baseURL = 'http://localhost:8080/e-commerce'; // todo modificar baseurl
//var baseURL = 'http://ec2-52-34-57-25.us-west-2.compute.amazonaws.com:8080/e-commerce-web-front/'; // todo modificar baseurl
var baseURL = 'http://www.modelonow.mx/portal';
var localityService;
var shelf = '';
var horaIni;
var horaFin;
var sessionUsr = {};
sessionUsr = ($.session.get('ecommerceUser') != undefined )  ? JSON.parse($.session.get('ecommerceUser')) : '';
if(sessionUsr.isFirstPurchase == true)
    $('.prospectCode').show();
$(function() {
    setShelve();
    var maxComboSale = 5;
    function setShelve(){
        var idLocality =  localityId;
        if(idLocality != ''){
            $.ajax({
                url: "./store/shelf/get",
                data: { localityId : idLocality },
                async: false,
                success: function(response){
                  shelf = response;
                  if(response.status == 'SUCCESS'){
                      var combos = response.data;
                      $('#localityName').val(combos[0].locality.name);
                      $('#stateName').val(combos[0].locality.state.name);
                      //objCombos = response.data;
                      $('.content_shop__items').html('');
                      jQuery.each(combos, function(index, item) {
                          jQuery.each(item.combos,function(combos, combo) {
                            objCombos[combo.id] = combo;
                              var productPromo = combo.showPromo != undefined ? combo.showPromo : 0;
                           if(combo.web == 1){ var namePackages = '';
                            jQuery.each(combo.packages,function(packages,packet){
                                namePackages = '<span class="unit p-label">'+packet.size+' Pack</span>';
                                if(packet.packagesPromo != null || combo.showPromo == 1){
                                  jQuery.each(packet.packagesPromo,function(promos,promo){
                                      if(promo.isPromo == 1){
                                          namePackages = namePackages+'<span class="promo p-label">+'+promo.size+' de Promoci&oacute;n</span>';
                                          //productPromo++;
                                      }
                                  });
                                }
                            });
                            
                            productPromo = productPromo == 1 ? '<div class="cornerPromo"><i class="cornerIcon fa fa-gift"></i></div>' : '';
                            var extraClass = combo.callInbound == 1 ? 'callInbound' : '';
                            extraClass = combo.callOutbound == 1 ? extraClass+' callOutbound' : extraClass;
                            platforms = combo.web == 1 ? platforms+'<i class="fa fa-laptop"></i>': platforms;
                            platforms = combo.androidApp == 1 ? platforms+'<i class="fa fa-android"></i>': platforms;
                            platforms = combo.iosApp == 1 ? platforms+'<i class="fa fa-apple"></i>': platforms;
                            platforms = combo.callInbound == 1 ? platforms+'<i class="fa fa-sign-in"></i>': platforms;
                            platforms = combo.callOutbound == 1 ? platforms+'<i class="fa fa-sign-out"></i>': platforms;

                            var platforms=''; var cantPromo = '';
                               var tmpPacksShelf = combo.packages[0].packagesPromo != undefined ? combo.packages[0].packagesPromo : 0; var costPromos = 0;
                               $.each(tmpPacksShelf,function(promos,promo){
                                   costPromos = costPromos+promo.price.ptcModeloNow;
                               });
                               //var priceItem = numItems * (objCombos[fieldName].packages[0].price.ptcModeloNow + costPromos);

                               var ptcModeloNow = combo.packages[0].price.ptcModeloNow != undefined ? combo.packages[0].price.ptcModeloNow+costPromos : '';

                            htmlItems = '<div class="content__shop__item col-sm-4 col-xs-6 btn-number" data-field="'+combo.id+'" data-type="plus">'+
                                        '<div class="item-container">'+
                                            '<div class="details">'+
                                                '<div class="details--divider-top">'+
                                                    productPromo+
                                                    '<div class="details__productshot"><img th:src="@{'+combo.urlPhoto+'}" src="'+combo.urlPhoto+'" onerror="this.onerror=null; this.src=\'img/beer.svg\'"></div>'+
                                                    '<div class="overlay add-to-cart">'+
                                                    '<a class=""><span aria-hidden="true" class="glyphicon glyphicon-plus"></span> a&ntilde;adir al carrito</a>'+
                                                    '</div>'+
                                                    '<div class="details__productpackage">'+namePackages+'</div>'+
                                                '</div>'+
                                                '<div class="details--divider-bottom">'+
                                                    '<div class="details__productinfo">'+
                                                        '<h3>'+combo.name+'</h3>'+
                                                        '<p class="description"><span class="vol">'+combo.description+'</span> <br> <span class="price">$'+ptcModeloNow+'</span></p>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>';

                            $('.content_shop__items').append(htmlItems);                        
                            }
                          });
                      });
                      getSnippets();
                      showProducts();
                  }else{
                      new PNotify({
                      title: 'Error',
                      text: 'No se pudo obtener el cat&aacute;logo de localidades',
                      type: 'error'
                  }); }
                  //console.log(shelf);
                },
                headers : {
                    'X-CSRF-Token' : $("meta[name='_csrf']").attr("content")
                }

            });
            $('input[name="typeOrder"]').on('switchChange.bootstrapSwitch', function(event, state) {
                showProducts();
            });
        }
        var shelfTemp = shelf;
        $.ajax({
            url: './store/localityServiceTime',
            data: { localityId : idLocality },
            success: function(response){
                $('#horaIni').val( response.data.startTime );
                $('#horaFin').val( response.data.endTime );
                if(response.status == 'SUCCESS'){
                    $('#isClosed').val( response.data.isClosed );

                    // Mensaje de horario de servicio
                    if(response.data.isClosed == true){
                        var type = 'warning';var title = 'Cerrado: ' ;
                        var message = 'Hola, hoy '+response.data.dayName+' por el momento no hay entrega a domicilio.';
                    }else{
                        var type = 'info';var title = '';
                        var message = 'Hola, el horario de servicio es de '+response.data.startTime+' a '+response.data.endTime+' ('+shelfTemp.data[0].name+')';
                    }
                    var htmltemp = '<div class="alert alert-'+type+' text-center"><small><strong>'+title+'</strong> '+message+'</small></div>';
                    $('.todayService').html(htmltemp);

                    getDays();
                    setTimeout(function(){getHours();},1000);
                }
            },
            error: function(){
                console.log('No se pudo obtener información de horario de servicio');
            },
            headers : {
                'X-CSRF-Token' : $("meta[name='_csrf']").attr("content")
            }
        });

        $('#prospectCode').html('<option value="">--Seleccione--</option>');
        $.ajax({
            url:'./store/get/prospectCode',
            data: { localityId : idLocality },
            success: function(response){
                if(response.status == 'SUCCESS'){
                    var codigos = response.data;
                    jQuery.each(codigos, function(codigo, item) {
                        $('#prospectCode').append('<option value="'+item+'">'+item+'</option>');
                    });
                }
            },
            error: function(){
                console.log('No se pudo obtener los codigos de prospectistas');
            },
            headers : {
                'X-CSRF-Token' : $("meta[name='_csrf']").attr("content")
            }
        });

        $('#informationChannelId').html('<option value="">--Seleccione--</option>');
        $.ajax({
            url:'http://callcenter.modelonow.mx/service/catalog/infoChannel/getActive',
            success: function(response){
                if(response.status == 'SUCCESS'){
                    var codigos = response.data;
                    jQuery.each(codigos, function(codigo, item) {
                        $('#informationChannelId').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                }
            },
            error: function(){
                console.log('No se pudo obtener informacion de los canales');
            }
        });
    }
    function showProducts(){
        $('.shelfList  div').not('.input-group,.cornerPromo').hide();
        if( $('#typeOrder:checked').val() == 1 )
            $('.shelfList  div.callInbound').fadeIn("fast");
        else
            $('.shelfList  div.callOutbound').fadeIn("fast");
    }
});

$(document).ready(function () {
    $(document).on('mouseenter', '.content__shop__item', function () {
        $(this).find(".add-to-cart").show();
    }).on('mouseleave', '.content__shop__item', function () {
        $(this).find(".add-to-cart").hide();
    });

    $(document).on('click','#typeDelivery',function(){
        if( $(this).val() == 1){
            $('.deliveryDate').css('display','none');
        }else{
            $('.deliveryDate').css('display','table');
        }
    });

    var tz = jstz.determine();
    response_text = 'No timezone found';
    if (typeof (tz) === 'undefined') {
        response_text = 'No timezone found';
    }
    else {
        response_text = tz.name();
    }
    //console.log(response_text);

    $(document).on('change','#deliveryDay',function(){getHours();});
    if( $('#typeDelivery:checked').val() == 0 ) $('.deliveryDate').css('display','table');
});
function getDays(){
    $('#deliveryDay').html('');
    moment.locale('es');

    // Cálculo para fechas y horas disponibles
    var horaIni = $('#horaIni').val().toString().split(':'); horaIni = Number(horaIni[0])+2;
    var horaFin = $('#horaFin').val().toString().split(':'); horaFin = Number(horaFin[0]);
    var horaActual = moment().format('H');

    i = horaActual < horaFin ? 0:1;
    for(i;i<=5;i++){
        var day = moment().add(i,'days').format('L');
        if(moment().add(i,'days').format('dddd') != 'Lunes')
            $('#deliveryDay').append('<option value="'+day+'">'+moment().add(i,'days').format('ddd')+' '+ day +' </option>'); //
    }
}
function getHours(){
    $('#deliveryHour').html('');
    var horaIni = $('#horaIni').val().toString().split(':'); horaIni = Number(horaIni[0])+2;
    var horaFin = $('#horaFin').val().toString().split(':'); horaFin = Number(horaFin[0]);
    var horaActual = moment().format('H');

    // horarios disponibles del dia seleccionado
    var myDay = moment().format('L');
    var localDay = $('#deliveryDay').val();
    var horaIniVal = horaActual > horaIni && myDay == localDay ? horaActual : horaIni;

    for(horaIniVal;horaIniVal<=horaFin;horaIniVal++) {
        $('#deliveryHour').append('<option value="'+horaIniVal+'"> '+horaIniVal+':00 </option>');
    };
}