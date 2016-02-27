/**
 * Created by albertocortez on 25/01/16.
 */

/*$(document).on('click','ga',function(){
    var event = $(this).attr('data-event');
    var value = $(this).attr('data-val');
    ga('send',category,event,value);
    sendEvent(event,value);
});*/
function sendEvent(category,event,value){
    //var category = 'ModeloNow 2.0 - Web';
    ga('send','event',category,event,value);
}
$(function(){
    //sendEvent('send','event','ModeloNow 2.0 - Web','Age Gate Passing',1);
    sendEvent('Shopping Funnel','Age Gate Passing',1);
});