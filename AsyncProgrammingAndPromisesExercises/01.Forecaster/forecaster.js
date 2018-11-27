function attachEvents() {
    const baseServiceUrl = "https://judgetests.firebaseio.com/";
    $('#submit').click(getWeather);
    
    function getWeather() {
        // $('#forecast').css('display', "none");
         
        $.get(baseServiceUrl + "locations.json")
            .then(loadForecast)
            .catch(displayError);
        
        function loadForecast(locations) {
            let location = locations.filter(l => l.name == $('#location').val())[0];

            let todayForecast = $.get(`${baseServiceUrl}forecast/today/${location.code}.json`);
            let upcomingForecast = $.get(`${baseServiceUrl}forecast/upcoming/${location.code}.json`);

            Promise.all([todayForecast, upcomingForecast])
                .then(displayForecast)
                .catch(displayError);

            function displayForecast([today, upcoming]) {
                let icons = {
                    ['Sunny']: "&#x2600;",
                    ['Partly sunny']: "&#x26C5;",
                    ['Overcast']: "&#x2601;",
                    ['Rain']: "&#x2614;",
                    ['Degrees']: "&#176;"
                };

                $('#forecast').text("");
                $('#forecast')
                .append($('<div>').attr('id', "current").append($('<div>').addClass('label').text("")))
                .append($('<div>').attr('id', "upcoming").append($('<div>').addClass('label').text("")))
    
         console.log($('#forecast').text())
        
                $('#current').html($('<div>').addClass('label').text("Current conditions"));
                $('#upcoming').html($('<div>').addClass('label').text("Three-day forecast"));
                $('#current')
                    .append($('<span>').addClass("condition symbol").html(icons[today.forecast.condition]))
                    .append($('<span>').addClass("condition")
                        .append($('<span>').addClass("forecast-data").text(today.name))
                        .append($('<span>').addClass("forecast-data").html(`${today.forecast.low}${icons.Degrees}/${today.forecast.high}${icons.Degrees}`))
                        .append($('<span>').addClass("forecast-data").text(today.forecast.condition))
                    );
                
                    
                for (let forecast of upcoming.forecast){
                    
                    $('#upcoming')
                        .append($('<span>').addClass("upcoming")
                            .append($('<span>').addClass("symbol").html(icons[forecast.condition]))
                            .append($('<span>').addClass("forecast-data").html(`${forecast.low}${icons.Degrees}/${forecast.high}${icons.Degrees}`))
                            .append($('<span>').addClass("forecast-data").text(forecast.condition))
                        );
                }

                $('#forecast').css("display", "block");
                
            }
        }

        function displayError(err) {
            $('#forecast').html("Error");
            $('#forecast').css("display", "block");
        }
    }
}