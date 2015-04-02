jQuery(document).ready(function($) {
	menu_focus( $('.nav > li')[1] );
	});


function menu_focus( element) {
	/*if ( $(element).hasClass('iactive') || $(element).data("slide") == 0) {
		console.log($(element).data("slide"));
		console.log(element);
			return;
	}*/

console.log(element);
	$('.nav > li').removeClass('active');
	$(element).addClass('active');
	
	var icon = $(element).find('.glyphicon');
	
	var left_pos = $('.nav').offset().left;
	var el_width = $(element).width();
	
	$('.active-menu').stop(false, false).animate(
		{
			left: left_pos,
			width: el_width
		},
		1500,
		'easeInOutQuart'
	);
}