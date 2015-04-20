WeatherBigBrother.service('weatherapi', function ($http, $q) {
    //retourne la Weather et le Forecast
    this.getAll = function(search) {
        return $q(function(resolve, reject){
            var weather;
            var forecast;
            
            var promiseWeather = getWeather(search);
            var promiseForecast = getForecast(search);
            
            promiseWeather.then(function(weatherData) { //On contrôle la promesse Weather
                weather = weatherData;
            });
            
            promiseForecast.then(function(forecastData) { //On contrôle la promesse Forecast
                forecast = forecastData;
            });
            
            //On contrôle les deux promesses
            $q.all([promiseWeather, promiseForecast]).then(function(data) { //OK
                resolve(data[0], data[1]);
            }, function(){ //ERREURS
                reject(0);
            }); 
            
        });
    }
    
    var getWeather = function(search, method) {
        return callAPI('weather', search, method);
    };
    
    var getForecast = function(search, method) {
        return callAPI('forecast', search, method);
    };
    
    var callAPI = function(type, search, method) {
        //Si la méthode 'id' est spécifiée on recherche par ID
        var searchBy;
        if (method === 'id') {
            searchBy = '?id=';
        }
        else { searchBy= '?q=';}
            
        //On retourne un Deferred afin de monitorer la requête    
        return $q(function(resolve, reject) {    
            $http.get('http://api.openweathermap.org/data/2.5/'+type+searchBy+search)
                .success(function(data){
                     if(data.cod == "404") {
                         reject(0); //ERREUR Ville non trouvée
                     }
                     else {   
                        resolve(data); // OK
                     }
            })
                .error(function(data){
                    reject(0); //ERREUR Erreur de requête
            });
        });
    };
});