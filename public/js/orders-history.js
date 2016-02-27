/**
 * Created by daniel on 08/01/16.
 */

/**
 * Click handler event for link 'Mis pedidos'
 */
$(".mi-historial-pedidos").click(function () {
        NProgress.start();
        //console.log('Probando el click del historial de pedidos');

        var sessionUsr = $.session.get('ecommerceUser') != 'undefined' ? jQuery.parseJSON($.session.get('ecommerceUser')) : '';
        var customerId = sessionUsr.customer;

        $.ajax({
            type: "GET",
            url: "./store/customer/orders/history",
            data: {
                customerId: customerId
            },
            success: function (resp) {
                //reload page once OK, so we can show the 'logged in' message
                //do here what you want, of course
                //console.log(resp.status)
                if (resp.status === 'SUCCESS') {

                    //showMessage('info', 'Listo!', 'Pedidos recuperados');
                    var table = showOrders(resp.data);
                    $(".orders-history-block").html(table).fadeIn();
                } else {
                    //showMessage('error', 'Aviso!', 'No se pudo recuperar pedidos');
                    console.log('No se pudo recuperar pedidos');
                }

                //location.reload();
                //console.log('Contenido de la respuesta del listado de los productos: ' + resp.data);
            },
            error: function (error) {
                //console.log(error)
            },
            headers: {
                'X-CSRF-Token': $("meta[name='_csrf']").attr("content")
            }
        });
        NProgress.done();
    }
);

/**
 * this function
 */
function showOrders(data) {

    var tableContent = '<table class="table cart__productlist">';
    tableContent += '<thead>';
    tableContent += '<tr>';
    tableContent += '<th>Pedido</th>';
    tableContent += '<th>Descripci&oacute;n</th>';
    tableContent += '<th>Total</th>';
    tableContent += '<th>Status</th>';
    tableContent += '</tr>';
    tableContent += '</thead>';
    tableContent += '<tbody class="list_products">';
    <!-- body table is fulfill inside of each loop -->
    $.each(data, function (i, order) {
        tableContent+= createRow(order);
    });

    tableContent+='</tbody >';
    tableContent+='</table>';

    //console.log(tableContent);

    return tableContent;

}

function createRow(register){
    var rowContent = '<tr>';

    rowContent+=createOrderColumn(register.order_id);
    rowContent+=createDescriptionColumn(register.entry_date_long,register.address);
    rowContent+=createTotalAmountColumn(register.total);
    rowContent+=createStatusColumn(register.order_status);

    rowContent+='</tr>';

    return rowContent;
}


function createOrderColumn(id){
    return '<td>'+id+'</td>';
}

function createDescriptionColumn(dateLong,address){
    var columnContent = '<td>';
    var dateObj = new Date(Number(dateLong));
    columnContent+='<p class="pack-size"> Fecha: '+dateObj.toLocaleString()+' </p>';
    columnContent+='<p class="pack-size"> Direcci&oacute;n: '+address.no_ext+', '+address.no_int+', '+address.street+
        ', '+address.neighborhood+', '+address.town+', '+address.state+' </p>';

    columnContent+='</td>';
    return columnContent;
}

function createTotalAmountColumn(amount){
    return '<td> $'+amount+'</td>';
}

function createStatusColumn(status){
    return '<td>'+status.name+'</td>';
}
