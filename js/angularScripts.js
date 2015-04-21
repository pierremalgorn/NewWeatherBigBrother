var WeatherBigBrother = angular.module('WeatherBigBrother', []).controller('MapController', function($scope, $http, $timeout, weatherapi){
    
    
    $scope.points = [   //Permet de situer les points sur la carte et de fournir le nom de la ville
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
    $scope.futherDays = [];
    $scope.furtherTemp = [];
    
    //Données pour le tri sur la liste des villes
    $scope.ordering = {
        'field' : 'city',
        'reverse' : false
    }
    
    //Au clic sur une colonne, on change de sens de tri ou on change de colonne de tri
    $scope.selectOrderingField = function(column) {
        if($scope.ordering.field === column) {
            $scope.ordering.reverse = !$scope.ordering.reverse;
        } else {
            $scope.ordering.field = column;
            $scope.ordering.reverse = false;
        }
        $scope.ordering.field = column;
    }
    
    //Affiche un message d'erreur pendant 5 secondes à l'utilisateur
    var displayErrorMessage = function() {
        $scope.error = true;
        $timeout(function(){
            $scope.error = false;
        }, 5000);
    }

    //Affichage de la première fenêtre modale affichant la météo du jour
    $scope.displayWeather = function() {
        var deg = $scope.cityWeather.wind.deg;
        //On tourne la flèche de direction de vent en fonction de la donnée
        $('#windDirection').css({
            '-ms-transform': 'rotate('+deg+'deg)',
            '-webkit-g.transform': 'rotate('+deg+'deg)',
            '-transform': 'rotate('+deg+'deg)' 
        });

        $scope.graphNextHours(); //Appelle la fonction pour afficher le graphe qui montre les températures dans les heures à venir
        $('#modalWeatherForCity').modal('show'); //Affiche la modale
    }

    $scope.graphNextHours = function(){
        var hours = new Array(); //Récupère les heures
        var temp = new Array(); //Récupère les températures correspondant aux heures
        var i = 0;
        var j = 0;

        while($scope.cityWeather.dt > $scope.cityForecast.list[i].dt){  //Permet de récupérer l'index à partir duquel il faut récupérer les heures à venir
            i = i+1;
        }

        for(j=i;j<i+6;j++){ //On récupère les 6 prochaines heures et les 6 prochaines températures dans des tableaux
            hours.push($scope.cityForecast.list[j].dt_txt.charAt(11)+$scope.cityForecast.list[j].dt_txt.charAt(12)+'h');
            temp.push($scope.toCelsius($scope.cityForecast.list[j].main.temp));
        }

        var buyerDataTemps = {
                    
        //Les labels vont être les heures
            labels : hours,
            datasets : [
                {
                fillColor : "rgba(255,102,0, 0.4)",
                strokeColor : "#33CC66",
                pointColor : "#fff",
                pointStrokeColor : "#999999",
                //Les data vont être les températures
                data : temp
                }
            ]
        }
    
        // On affiche le graphique           
        var sizeChartTmp = document.getElementById('graphNextHours').getContext('2d');
        new Chart(sizeChartTmp).Line(buyerDataTemps);
    }


    $scope.getFurtherDays = function(){ //On récupère quels sont les prochains jours pour la deuxième modale

        var i=0;
        var tab = new Array();
        var ladate = new Date(); //Permet de récupérer une date
        var tab_jour=new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"); //La liste des jours de la semaine

        for(i=1; i<6; i++){
            tab.push(tab_jour[((ladate.getDay()) + i)%7]); //On récupère l'indice du jour actuel puis on récupère les 4 jours suivants dans le tableau tab
        }

        return(tab);
    }


    $scope.getFurtherTemperatures = function(){
        var i = findIndex();
        var j=0;
        var tab = new Array();
        
        for(j=0; j<5; j++){
            tab.push($scope.toCelsius($scope.cityForecast.list[i].main.temp));
            i = i+8;
        } 

        return(tab);      
    }

    $scope.getFurtherPressure = function(){
        var i = findIndex();
        var j=0;
        var tab = new Array();
        
        for(j=0; j<5; j++){
            tab.push(($scope.cityForecast.list[i].main.pressure));
            i = i+8;
        } 

        return(tab);      
    }


    $scope.displayCharts = function(){
        
        var tabDays = $scope.getFurtherDays();
        var tabTemp = $scope.getFurtherTemperatures();
        var tabPressure = $scope.getFurtherPressure();
        
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

    //Récupération des données et affichage
    $scope.getWeatherForCity = function(city){
        $scope.loading = true; //On affiche le loading
        var promise = weatherapi.getAll(city); //On appelle l'API
        //On attend la fin de la requête en traitant la promesse
        promise.then(function(dataWeather) { //OK
            $scope.cityWeather = dataWeather[0];
            $scope.cityForecast = dataWeather[1];
            $scope.displayWeather();
        }, function(errorLevel) { //Erreur
            if(errorLevel === 0) {
                displayErrorMessage();
            }
        }).finally(function() { //Finalement, on cache le loading
            $scope.loading = false;
        });
    };

    //Affichage de la météo de la ville tapée en recherche
    $scope.getWeatherForCityTyped = function(){
            var city;
            //On attend 3ms avant de récupérer la donnée sinon problème avec API Google
            $timeout(function(){
                    city = document.getElementById("cityAutocomplete").value;
                    $scope.getWeatherForCity(city);
            }, 3);
    };	
    
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


    $scope.furtherInformations = function(){
        $('#modalWeatherForCity').modal('hide');
        $('#modalWeatherFurtherInformations').modal('show');

        $scope.furtherDays = $scope.furtherDate();
        $scope.furtherTemp = $scope.furtherTemperature();
        $scope.furtherIcon();

        $scope.displayCharts();
    }


    $scope.furtherTemperature = function (num) {
        var tab = new Array();
        var i = findIndex();
        var j = 0;

        for(j=0; j<4; j++){
            tab.push($scope.toCelsius($scope.cityForecast.list[i].main.temp));
            i = i+8;
        }

        return(tab);
    }

    $scope.furtherIcon = function(num){
        var tab = new Array();
        var i = findIndex();
        var j=0;

        for(j=0;j<4;j++){
            tab.push($scope.cityForecast.list[i].weather[0].icon);
            i = i + 8;
        }

        var path1 = 'http://openweathermap.org/img/w/'+tab[0]+'.png';
        document.getElementById('Img1').src = path1;
        var path2 = 'http://openweathermap.org/img/w/'+tab[1]+'.png';
        document.getElementById('Img2').src = path2;
        var path3 = 'http://openweathermap.org/img/w/'+tab[2]+'.png';
        document.getElementById('Img3').src = path3;
        var path4 = 'http://openweathermap.org/img/w/'+tab[3]+'.png';
        document.getElementById('Img4').src = path4;
    }


    $scope.furtherDate = function(num){
        var ladate = new Date();
        var tab_jour=new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");
        var tab = new Array();
        var i = 0;


        for(i=1;i<5;i++){
            tab.push(tab_jour[((ladate.getDay()) + i)%7]);
        }

        return (tab);
        
    }
});