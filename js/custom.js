jQuery(document).ready(function($) {
	//Script autocompletion Villes
	new google.maps.places.Autocomplete(
    (document.getElementById('cityAutocomplete')), {
        types: ['(cities)']
    });
	
	//Script de slide gauche/droite
	var query = window.location.href;
	var vars = query.split("#");
	var flag = 0;
	(vars[1] >= 0 && vars[1] <= $(".nav li").length) ? goTo(vars[1]) : goTo(0);
	$( ".nav li" ).click(function() {
		if(flag == 1) {return false;}
		$(".nav li").removeClass("active");
		$(this).addClass("active")
		flag = 1;
		$( "#slider" ).animate({ "margin-left": -($(this).index() * $("body").width()) + "px" }, "slow", function(){
			flag = 0;
		});
		menu_focus(this);
	});
		
		
	function goTo(nb){
			$( "#slider" ).css( "margin-left", - (nb * $("body").width()) +"px");
			$(".nav li").removeClass("active");
			$('.nav li:nth('+nb+')').addClass("active");
			
	}
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