var WeatherBigBrother = angular.module('WeatherBigBrother', []).controller('MapController', function($scope, $http, $timeout){
    
    
    $scope.points = [
        {city:'Paris,fr', top:33, left:45.8},
        {city:'Madrid,es', top:37.1, left:44.14},
        {city:'London_uk', top:30.35, left:45},
        {city:'Berlin_de', top:31.65, left:47.47},
      ];
    
    $scope.cityWeather = [];
    $scope.cityForecast = [];
    $scope.error = false;

    
    var displayWeather = function() {
        var deg = $scope.cityWeather.wind.deg;
        $('#windDirection').css({
            '-ms-transform': 'rotate('+deg+'deg)',
            '-webkit-transform': 'rotate('+deg+'deg)',
            '-transform': 'rotate('+deg+'deg)' 
        });
        $('#modalWeatherForCity').modal('show');
    }

    var displayFurtherInformationsWeather = function() {
        var deg = $scope.cityWeather.wind.deg;
        $('#modalWeatherForCity').modal('hide');
        $('#modalWeatherFurtherInformations').modal('show');
    }
	
    
    $scope.getWeatherForCity = function(city){
        $http.get('http://api.openweathermap.org/data/2.5/weather?q='+city)
            .success(function(data){
                 $scope.cityWeather = data;
                 if($scope.cityWeather.cod == "404") {
                    $scope.error = true;
                    $timeout(function(){
                         $scope.error = false;
                     }, 5000);
                 }
                 else {   
                    displayWeather();
                 }
        })
            .error(function(data){
                //GERER L'ERREUR ???
                 $scope.cityWeather = data;
        });
    };
	
    $scope.getWeatherForCityTyped = function(){
            var city;
            $timeout(function(){
                    city = document.getElementById("cityAutocomplete").value;
                    $scope.getWeatherForCity(city);
            }, 3);
    };

    $scope.furtherInformations = function(city){
        $http.get('http://api.openweathermap.org/data/2.5/forecast?q='+city)
            .success(function(data){
                 $scope.cityForecast = data; 
                 if($scope.cityForecast.cod == "404") {
                    $scope.error = true;
                    $timeout(function(){
                         $scope.error = false;
                     }, 5000);
                 }
                 else {
                 displayFurtherInformationsWeather();
                 }
        })
            .error(function(data){
                //GERER L'ERREUR ???
                 $scope.cityForecast = data;
        });
    };
	
    
    $scope.toCelsius = function(temp) {
        return (temp - 272.15).toFixed(1);
    };
    
    $scope.toKMH = function(speed) {
        return (speed * 3.6).toFixed(1);
    }
    
});