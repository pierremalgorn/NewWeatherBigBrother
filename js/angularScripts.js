var WeatherBigBrother = angular.module('WeatherBigBrother', []).controller('MapController', function($scope, $http, $timeout){
    
    
    $scope.points = [
        {city:'Paris,fr', top:33, left:45.8},
        {city:'Madrid,es', top:37.1, left:44.14},
        {city:'London_uk', top:30.35, left:45},
        {city:'Berlin_de', top:31.65, left:47.47},
      ];
    
    $scope.cityWeather = [];

    
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
        $('#windDirection').css({
            '-ms-transform': 'rotate('+deg+'deg)',
            '-webkit-transform': 'rotate('+deg+'deg)',
            '-transform': 'rotate('+deg+'deg)' 
        });
        $('#modalWeatherFurtherInformations').modal('show');
    }
	
    
    $scope.getWeatherForCity = function(city){
        console.log(city);
        $http.get('http://api.openweathermap.org/data/2.5/weather?q='+city)
            .success(function(data){
                 $scope.cityWeather = data;
                 displayWeather();
        })
            .error(function(data){
                //GERER L'ERREUR ???
                 $scope.cityWeather = data;
        })
    };
	
	$scope.getWeatherForCityTyped = function(){
		var city;
		$timeout(function(){
			city = document.getElementById("cityAutocomplete").value;
			$scope.getWeatherForCity(city);
		}, 3);
	}

    $scope.furtherInformations = function(city){
        console.log(city);
        $http.get('http://api.openweathermap.org/data/2.5/weather?q='+city)
            .success(function(data){
                 $scope.cityWeather = data;   
                 displayFurtherInformationsWeather();
        })
            .error(function(data){
                //GERER L'ERREUR ???
                 $scope.cityWeather = data;
        })
    }
	
    
    $scope.toCelsius = function(temp) {
        return (temp - 272.15).toFixed(1);
    };
    
    $scope.toKMH = function(speed) {
        return (speed * 3.6).toFixed(1);
    }
    
});