$(function() {
	// Hide sidebar
	$(".sidebar").hide();
	// Sidebar toggle handle
	$(document).on("click",".cart-handle, .cart-handle--close",function() {
		$( ".sidebar--cart").toggle();
		$('body').toggleClass('overflow');
	});

	$(".user-handle, .user-handle--close").click(function() {
		$( ".sidebar--register").toggle();
		$('body').toggleClass('overflow');
	});


	$('.spinner .btn:first-of-type').on('click', function() {
		var btn = $(this);
		var input = btn.closest('.spinner').find('input');
		if (input.attr('max') == undefined || parseInt(input.val()) < parseInt(input.attr('max'))) {    
			input.val(parseInt(input.val(), 10) + 1);
		} else {
			btn.next("disabled", true);
		}
	});
	$('.spinner .btn:last-of-type').on('click', function() {
		var btn = $(this);
		var input = btn.closest('.spinner').find('input');
		if (input.attr('min') == undefined || parseInt(input.val()) > parseInt(input.attr('min'))) {    
			input.val(parseInt(input.val(), 10) - 1);
		} else {
			btn.prev("disabled", true);
		}
	});

	$('#radioBtn a').on('click', function(){
		var sel = $(this).data('title');
		var tog = $(this).data('toggle');
		$('#'+tog).prop('value', sel);
		
		$('a[data-toggle="'+tog+'"]').not('[data-title="'+sel+'"]').removeClass('active').addClass('notActive');
		$('a[data-toggle="'+tog+'"][data-title="'+sel+'"]').removeClass('notActive').addClass('active');
	})
});

var objUser = [];

function loadSession(data){
	if ($.session.get('ecommerceUser')=='') {
		$.session.set('ecommerceUser',JSON.stringify(data));
		objUser['session']=jQuery.parseJSON($.session.get('ecommerceUser')); console.log(objUser['session']);
	}else{
		$.session.set('ecommerceUser','');
		$.session.set('ecommerceCar','');
	}
	//console.log(objUser);
}

$.urlParam = function(name){ var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href); if (results==null){ return null; } else{ return results[1] || 0; } }

var localityId = $.urlParam('localityId');

//console.log('Localityid:'+localityId);


