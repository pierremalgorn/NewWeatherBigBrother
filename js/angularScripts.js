var WeatherBigBrother = angular.module('WeatherBigBrother', []).controller('MapController', function($scope, $http, $timeout){
    
    
    $scope.points = [
        {city:'Paris,fr', top:31.4, left:45.8},
        {city:'Madrid,es', top:36, left:44.14},
        {city:'London,uk', top:28.3, left:45},
        {city:'Berlin_de', top:29.8, left:47.47},
        {city:'Saint_Petersburg,ru', top:23.8, left:52.5},
        {city:'Moscou,ru', top:26.8, left:55.85},
        {city:'Vancouver,ca', top:34.4, left:12.4},
        {city:'Los_Angeles,us', top:43.7, left:14},
        {city:'Chicago,us', top:37.6, left:23.3},
        {city:'New_York,us', top:37.5, left:28.2},
        {city:'Washington,us', top:42.2, left:25.8},
        {city:'Mexico,mexico', top:51.6, left:19.1},
        {city:'Caracas', top:59.3, left:27.45},
        {city:'Bogota', top:60.9, left:25.8},
        {city:'Lima,pe', top:70.15, left:24.92},
        {city:'Sao Paulo', top:78, left:32.45},
        {city:'Santiago,chile', top:82.6, left:26.6},
        {city:'Buenos_Aires', top:84.1, left:29.95},
        {city:'Le Caire,Egypte', top:42.2, left:54.2},
        {city:'Lagos', top:54.5, left:45},
        {city:'Kinshasa', top:62.4, left:50},
        {city:'Johannesburg', top:73.4, left:53.3},
        {city:'Casablanca', top:40.8, left:43.3},
        {city:'Alger', top:39.2, left:44.95},
        {city:'Istanbul,turquie', top:36, left:53.3},
        {city:'Mumbai', top:48.4, left:65.8},
        {city:'Calcutta', top:47, left:70},
        {city:'Bangkok', top:49.9, left:74.15},
        {city:'Tokyo', top:39.2, left:85.1},
        {city:'Seoul', top:37.7, left:81.7},
        {city:'Beijing', top:36.1, left:79.2},
        {city:'Shanghai', top:42.2, left:79.2},
        {city:'Manille', top:53, left:80.9},
        {city:'Jakarta', top:65.5, left:78.3},
        {city:'Sydney,Australia', top:80.9, left:90.9},
      ];
    
    $scope.cityWeather = [];
    $scope.cityForecast = [];
    $scope.error = false;
    $scope.loading = false;


    $scope.getWeatherForCity = function(city){
        $scope.loading = true;
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
                 $scope.loading = false;
        })
            .error(function(data){
                //GERER L'ERREUR ???
                 $scope.cityWeather = data;
                 $scope.loading = false;
                 
        });
    };

       $scope.furtherInformations = function(){

        $http.get('http://api.openweathermap.org/data/2.5/forecast?q='+$scope.cityWeather.name+','+$scope.cityWeather.sys.country)
            .success(function(data){
                 $scope.cityForecast = data;
                 if($scope.cityForecast.cod == "404") {
                    $scope.error = true;
                    $timeout(function(){
                         $scope.error = false;
                     }, 5000);
                 }
                 $scope.loading = false;
                 $scope.displayWeather();
        })
            .error(function(data){
                //GERER L'ERREUR ???
                 $scope.cityForecast = data;
                 $scope.loading = false;
                 
        });
    };

    
    $scope.displayWeather = function() {
        var deg = $scope.cityWeather.wind.deg;
        $('#windDirection').css({
            '-ms-transform': 'rotate('+deg+'deg)',
            '-webkit-transform': 'rotate('+deg+'deg)',
            '-transform': 'rotate('+deg+'deg)' 
        });

        $scope.graphNextHours();
        $('#modalWeatherForCity').modal('show');
    }

    $scope.graphNextHours = function(){
        var hours = new Array();
        var temp = new Array();
        var i = 0;
        var j = 0;

        while($scope.cityWeather.dt > $scope.cityForecast.list[i].dt){
            i = i+1;
        }

        for(j=i;j<i+6;j++){
            hours.push($scope.cityForecast.list[j].dt_txt.charAt(11)+$scope.cityForecast.list[j].dt_txt.charAt(12)+'h');
            temp.push($scope.toCelsius($scope.cityForecast.list[j].main.temp));
        }

        var buyerDataTemps = {
                    
        //The labels will be the dates in the first row of the table
            labels : hours,
            datasets : [
                {
                fillColor : "rgba(255,102,0, 0.4)",
                strokeColor : "#33CC66",
                pointColor : "#fff",
                pointStrokeColor : "#999999",
                //The datas will be the different rows of the table
                data : temp
                }
            ]
        }
    
        // We draw the chart            
        var sizeChartTmp = document.getElementById('graphNextHours').getContext('2d');
        new Chart(sizeChartTmp).Line(buyerDataTemps);
    }



    var displayFurtherInformationsWeather = function() {
        $('#modalWeatherForCity').modal('hide');
        $('#modalWeatherFurtherInformations').modal('show');

        displayCharts();
    }


    var getFurtherDays = function(){

        var i=0;
        var tab = new Array();
        var ladate = new Date();
        var tab_jour=new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");

        for(i=0; i<5; i++){
            tab.push(tab_jour[((ladate.getDay()) + i)%7]);
        }

        console.log("tu");
        return(tab);
    }


    var getFurtherTemperatures = function(){
        var i = findIndex() - 8;
        var j=0;
        var tab = new Array();
        
        for(j=0; j<5; j++){
            tab.push($scope.toCelsius($scope.cityForecast.list[i].main.temp));
            i = i+8;
        } 

        return(tab);      
    }

        var getFurtherPressure = function(){
        var i = findIndex() - 8;
        var j=0;
        var tab = new Array();
        
        for(j=0; j<5; j++){
            tab.push(($scope.cityForecast.list[i].main.pressure));
            i = i+8;
        } 

        return(tab);      
    }


    var displayCharts = function(){
        
        var tabDays = getFurtherDays();
        var tabTemp = getFurtherTemperatures();
        var tabPressure = getFurtherPressure();
        
        var buyerDataTemps = {
                    
        //The labels will be the dates in the first row of the table
            labels : tabDays,
            datasets : [
                {
                fillColor : "rgba(255,102,0, 0.4)",
                strokeColor : "#33CC66",
                pointColor : "#fff",
                pointStrokeColor : "#999999",
                //The datas will be the different rows of the table
                data : tabTemp
                }
            ]
        }
    
        // We draw the chart            
        var sizeChartTmp = document.getElementById('graphTmp').getContext('2d');
        new Chart(sizeChartTmp).Line(buyerDataTemps);

         var buyerData = {
                    
        //The labels will be the dates in the first row of the table
            labels : tabDays,
            datasets : [
                {
                fillColor : "rgba(255,102,0, 0.4)",
                strokeColor : "#33CC66",
                pointColor : "#fff",
                pointStrokeColor : "#999999",
                //The datas will be the different rows of the table
                data : tabPressure
                }
            ]
        }
    
        // We draw the chart            
        var size_chart = document.getElementById('graph').getContext('2d');
        new Chart(size_chart).Line(buyerData);
    }
    
	
    

	
    $scope.getWeatherForCityTyped = function(){
            var city;
            $timeout(function(){
                    city = document.getElementById("cityAutocomplete").value;
                    $scope.getWeatherForCity(city);
            }, 3);
    };

    /*
    $scope.furtherInformations = function(){

        $http.get('http://api.openweathermap.org/data/2.5/forecast?q='+$scope.cityWeather.name+','+$scope.cityWeather.sys.country)
            .success(function(data){
                console.log($scope.cityWeather.name);
                console.log($scope.cityWeather.sys.country);
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
                 $scope.loading = false;
        })
            .error(function(data){
                //GERER L'ERREUR ???
                 $scope.cityForecast = data;
                 $scope.loading = false;
        });
    };
	*/
    
    $scope.toCelsius = function(temp) {
        return (temp - 272.15).toFixed(1);
    };
    
    $scope.toKMH = function(speed) {
        return (speed * 3.6).toFixed(1);
    };

    var findIndex = function(){
        var i = 0;
        var dtMidi = 0;
        var currentDate = $scope.cityWeather.dt;    

        while($scope.cityForecast.list[i].dt_txt.charAt(12) !== "5"){
            i++;
        }

        dtMidi = $scope.cityForecast.list[i].dt;
        if(dtMidi - currentDate < 3600*15){
            i = i + 8;
        }

        return(i);
    };



    $scope.furtherTemperature = function (num) {
        
        var i = findIndex();

        if(num == 1){
            var temp = $scope.cityForecast.list[i].main.temp;
            return($scope.toCelsius(temp));
        }
        
        if(num == 2){
            i = i + 8;
            var temp = $scope.cityForecast.list[i].main.temp;
            return($scope.toCelsius(temp));
        }

        if(num == 3){
            i = i + 16;
            var temp = $scope.cityForecast.list[i].main.temp;
            return($scope.toCelsius(temp));
        }

        if(num == 4){
            i = i + 24;
            var temp = $scope.cityForecast.list[i].main.temp;
            return($scope.toCelsius(temp));
        }
    }

    $scope.furtherIcon = function(num){

        var i = findIndex();
        
        if(num == 2){
            i = i + 8;
        }

        if(num == 3){
            i = i + 16;
        }

        if(num == 4){
            i = i + 24;
        }
        var idImage = $scope.cityForecast.list[i].weather[0].icon;
        var path = 'http://openweathermap.org/img/w/'+idImage+'.png';

        if(num == 1){
            document.getElementById('Img1').src = path;
        }
        if(num == 2){
            document.getElementById('Img2').src = path;
        }

        if(num == 3){
            document.getElementById('Img3').src = path;
        }

        if(num == 4){
            document.getElementById('Img4').src = path;
        }

    }


    $scope.furtherDate = function(num){
        var ladate = new Date();
        var tab_jour=new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");

        if(num == 1){
            return (tab_jour[((ladate.getDay()) + 1)%7]);
        }
        if(num == 2){
            return (tab_jour[((ladate.getDay()) + 2)%7]);
        }

        if(num == 3){
            return (tab_jour[((ladate.getDay()) + 3)%7]);
        }

        if(num == 4){
            return (tab_jour[((ladate.getDay()) + 4)%7]);
        }
        
    }
});