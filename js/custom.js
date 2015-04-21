jQuery(document).ready(function($) {
	//Script autocompletion Villes
	new google.maps.places.Autocomplete(
    (document.getElementById('cityAutocomplete')), {
        types: ['(cities)'] //On limite la recherche aux villes
    });
	
//Script de slide gauche/droite
var flag = 0;
var slideAssocieeAuBouton;
var slideHeight;

//Au clic sur un élément du menu
$( ".nav li" ).click(function() {  
    if(flag == 1) {return false;} //On vérifie si le mouvement n'est pas en cours
    slideAssocieeAuBouton = $(".pageSlide").eq($(this).index());
    $(".nav li").removeClass("active");
    $(".pageSlide").removeClass("active");
    $(this).addClass("active");
    $(slideAssocieeAuBouton).addClass("active");
    flag = 1; //On bloque le mouvement
    
    slideHeight = slideAssocieeAuBouton.height(); //On récupère la hauteur de la slide cliquée
    $("#wrapperHidden").css("height", slideHeight); //On adapte la hauteur
    //On décale la slide principale pour aller sur celle cliquée. Puis on débloque le mouvement
    $( "#slider" ).animate({ "margin-left": -($(this).index() * $("body").width()) + "px" }, "slow", function(){
            flag = 0;
    });
});
    
    //on redimensionne la slide au démarrage
    resizeSlideHeight();
    
});

//A chaque redimensionnement de la page on redimensionne la slide
$( window ).resize(function() {
    resizeSlideHeight();
});

var resizeSlideHeight = function() {
    var slideHeight;
    slideHeight = $(".pageSlide.active").height(); //On récupère la hauteur de la slide active
    $("#wrapperHidden").css("height", slideHeight); //On adapte la hauteur
}