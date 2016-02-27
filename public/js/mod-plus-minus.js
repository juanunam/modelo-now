var availablePromos = 5;
var totalBeers = 0;
var objPackages = [];
var totalItems = Number(0);
var user = $.session.get('ecommerceUser') != undefined ? jQuery.parseJSON($.session.get('ecommerceUser')) : '';
var car = $.session.get('ecommerceCar') != undefined ? jQuery.parseJSON($.session.get('ecommerceCar')) : '';

$(function(){

    calculateItems();
    setTimeout(function(){
        //if($.session.get('ecommerceUser') != undefined) {
            if(car != undefined && car.length > 0){
                $.each(car,function(objects,obj){
                    var idProdtemp = obj.product;
                    for(i=1;i<=Number(obj.cantidad);i++){
                        $('div[data-field="'+idProdtemp+'"]').trigger('click');
                    }
                });
            }
        //}
    },2000);
})

//total price calculation 
function format2(n) {
    return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}
function calculateTotal(){
    var subTotal = 0 ; var total = 0; 
    $('.cart_productlist__total').each(function(){
        var priceTmp = $(this).text();
        total += parseFloat( (priceTmp.substring(1,priceTmp.length) + "").replace(',', '') );
    });
    $('.txtTotal').text( ' $'+format2(total)+'' ).formatCurrency();
}
function calculatePromos(){
    var promosToday = 5; var totalPromo = 0;
    $('.promos').each(function(){
        totalPromo += Number($(this).text());
        //console.log( totalPromo );
    });
    availablePromos = promosToday-totalPromo; //console.log(availablePromos);
    return availablePromos;
}
function calculateItems(){
    var sum = 0;
    $('input.numItems').each(function(){
        sum += Number($(this).val());
        //console.log( sum );
    });
    totalItems = sum;
    $('span.badge').text( totalItems ).fadeToggle('fast').fadeToggle('fast');
    return totalItems;
}

function getSnippets() {
    //plugin bootstrap minus and plus
    //http://jsfiddle.net/laelitenetwork/puJ6G/
    $(document).on("click",'.btn-number',function(e){
        e.preventDefault();
        //console.log( objCombos );
        fieldName = $(this).attr('data-field'); //console.log(fieldName);
        type      = $(this).attr('data-type'); //console.log(type);
        var tmpPoducts = [];
        var input = $("input[name='"+fieldName+"']"); //console.log(input.length);
        var currentVal = input.length > 0 ? parseInt(input.val()) : 0; //console.log(currentVal);
        var max = input.attr('max') ? input.attr('max') : 99;
        //console.log( objCombos[fieldName] );
        //if (!isNaN(currentVal)) {
            if(type == 'minus') {
                sendEvent('Shopping Funnel','Shopping Cart Access - Product Minus',1);
                if(currentVal > input.attr('min')) {
                    var numItems = currentVal - 1;
                    var tmpPacks = objCombos[fieldName].packages[0].packagesPromo; var costPromos = 0;
                    $.each(tmpPacks,function(promos,promo){
                        costPromos = Number(costPromos) + Number(promo.price.ptcModeloNow);
                    });
                    var priceItem = numItems * (objCombos[fieldName].packages[0].price.ptcModeloNow + costPromos);
                    //var priceItem = numItems * objCombos[fieldName].packages[0].price.ptcModeloNow;
                    input.val(numItems).change();
                    if( numItems == 0 ){
                        $('.list_products tr[name="'+fieldName+'"]').remove();
                    }else{
                        $('.list_products tr[name="'+fieldName+'"] .qty').text(numItems);
                        $('.list_products tr[name="'+fieldName+'"] .price').text('$'+format2(priceItem));
                        var promoItem = $('.list_products tr[name="'+fieldName+'"] .promos').text();
                        if( currentVal == promoItem)
                             $('.list_products tr[name="'+fieldName+'"] .promos').text(Number(promoItem)-1);
                    }
                }
                if(parseInt(input.val()) == input.attr('min')) {
                    $(this).attr('disabled', true);
                }
            } else if(type == 'plus') {
                sendEvent('Shopping Funnel','Shopping Cart Access - Product Added',1);
                fbq('track', 'AddToCart');
                if( calculatePromos() <= 0 && objCombos[fieldName].packages[0].packagesPromo[0] != null){
                    new PNotify({
                      title: 'Aviso!',
                      text: 'Ya no tiene mas promociones disponibles, se agregaran al carrito sin promoci&oacute;n',
                      type: 'error',
                      nonblock: {
                        nonblock: true,
                        nonblock_opacity: .2
                      }
                    });
                }
                if(currentVal < max) {
                    //console.log('entra');
                    var numItems = currentVal + 1;
                    var tmpPacks = objCombos[fieldName].packages[0].packagesPromo; var costPromos = 0;
                    $.each(tmpPacks,function(promos,promo){
                        costPromos = Number(costPromos) + Number(promo.price.ptcModeloNow);
                    });
                    var priceItem = numItems * (objCombos[fieldName].packages[0].price.ptcModeloNow + costPromos);

                    input.val(numItems).change();
                    //console.log( $('tr[name="'+fieldName+'"]').length );
                    if( $('.list_products tr[name="'+fieldName+'"]').length ){
                        $('.list_products tr[name="'+fieldName+'"] .qty').text(numItems);
                        $('.list_products tr[name="'+fieldName+'"] .price').text('$'+format2(priceItem));
                        if( calculatePromos() >= 1){
                            var promoItem = $('.list_products tr[name="'+fieldName+'"] .promos').text();
                            $('.list_products tr[name="'+fieldName+'"] .promos').text(Number(promoItem)+1);
                        }
                    }else{
                        if(objCombos[fieldName].packages[0].packagesPromo[0] != null && calculatePromos() >= 1){
                            var txtpromo = objCombos[fieldName].packages[0].packagesPromo[0].size+' Pack de Promoci&oacute;n';
                            var cantpromo = ' <span class="label label-info promos">1</span>';

                        }else{
                            var txtpromo = ''; cantpromo = '';
                        }
                        $('.list_products').append('<tr id="'+fieldName+'" name="'+fieldName+'">'+
                        '<td class="cart_productlist__productshot hidden-xs"><img src="'+objCombos[fieldName].urlPhoto+'" th:src="@{/img/product-shot_2x.png}"/></td>'+
                        '<td class="cart_productlist__description">'+
                            '<h3 class="name">'+objCombos[fieldName].name+'</h3>'+
                            '<p class="pack-size">'+objCombos[fieldName].packages[0].size+' Pack</p>'+
                            '<p class="pack-size">'+txtpromo+cantpromo+'</p>'+
                            '<p class="volume">'+objCombos[fieldName].description+'</p>'+
                        '</td>'+
                        '<td class="cart_productlist__quantity">'+
                            '<div class="input-group spinner">'+
                                '<input id="'+fieldName+'" name="'+fieldName+'" type="text" value="1" min="0" max="99" class="form-control numItems" readonly="readonly"/>'+
                                '<div class="input-group-btn-vertical">'+
                                    '<button type="button" class="btn btn-default btn-number" data-type="plus" data-field="'+fieldName+'"><i class="fa fa-caret-up"></i></button>'+
                                    '<button type="button" class="btn btn-default btn-number" data-type="minus" data-field="'+fieldName+'"><i class="fa fa-caret-down"></i></button>'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                        '<td class="cart_productlist__total price" id="priceItem[]">$'+format2(priceItem)+'</td>'+
                        '<td class="cart_productlist__delete"><a href="#"><i class="fa fa-trash-o"></i></a></td>'+
                    '</tr>');
                        /*$('.list_products').append('<li id="'+fieldName+'" name="'+fieldName+'"><p>'+
                                                   '<span class="qty">'+numItems+'</span>'+
                                                   '<span class="product">'+objCombos[fieldName].name+'<br>'+
                                                        '<small>'+objCombos[fieldName].packages[0].size+' Pack</small><br>'+
                                                        '<small class="txtpromo">'+txtpromo+cantpromo+'</small>'+
                                                   '</span>'+
                                                   '<span id="priceItem[]" class="price">$'+priceItem+'</span>'+
                                                   '<a class="close-link"><i class="fa fa-close"></i></a>'+
                                                   '</p></li>');*/
                    }
                }
                if(parseInt(input.val()) == input.attr('max')) {
                    $(this).attr('disabled', true);
                }
            }
        /*} else {
            input.val(0);
        }*/
        calculateTotal();
        calculateItems();
        saveCar();
    });
    $('.input-number').focusin(function(){
       $(this).data('oldValue', $(this).val());
    });
    $('.input-number').change(function() {

        minValue =  parseInt($(this).attr('min'));
        maxValue =  parseInt($(this).attr('max'));
        valueCurrent = parseInt($(this).val());

        name = $(this).attr('name');
        if(valueCurrent >= minValue) {
            $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
        } else {
            alert('Sorry, the minimum value was reached');
            $(this).val($(this).data('oldValue'));
        }
        if(valueCurrent <= maxValue) {
            $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
        } else {
            alert('Sorry, the maximum value was reached');
            $(this).val($(this).data('oldValue'));
        }


    });
    $(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}
var tmpPoducts = [];
function saveCar(){
    car = '';
    tmpPoducts = [];
    var i=0;
    $('.list_products tr').each(function(elements,element){
        tmpPoducts[i] = {"product":element.id,"cantidad":Number($("input[name='"+element.id+"']").val()) }
        i++;
    });
    car = tmpPoducts;
    $.session.set('ecommerceCar',JSON.stringify(car)+"");
}