jQuery(document).ready(function($) {
	//Script autocompletion Villes
	new google.maps.places.Autocomplete(
    (document.getElementById('cityAutocomplete')), {
        types: ['(cities)']
    });
	
//Script de slide gauche/droite
var flag = 0;
var slideHeight;

//Au clic sur un élément du menu
$( ".nav li" ).click(function() {  
    if(flag == 1) {return false;} //On bloque le mouvement  
    $(".nav li").removeClass("active");
    $(this).addClass("active")
    flag = 1;
    slideHeight = $(".pageSlide").eq($(this).index()).height();
    $("#wrapperHidden").css("height", slideHeight);
    $( "#slider" ).animate({ "margin-left": -($(this).index() * $("body").width()) + "px" }, "slow", function(){
            flag = 0;
    });
});


function goTo(nb){
                $( "#slider" ).css( "margin-left", - (nb * $("body").width()) +"px");
                $(".nav li").removeClass("active");
                $('.nav li:nth('+nb+')').addClass("active");

}
    
});