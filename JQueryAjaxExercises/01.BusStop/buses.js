function getInfo() {
    //sample json from baseServiceUrl
    // {
    //     "buses": {
    //         "4": 13,
    //         "12": 6,
    //         "18": 7
    //     },
    //     "name": "St. Nedelya sq."
    // }

    let baseServiceUrl = "https://judgetests.firebaseio.com/businfo/";
    $('#stopName').text('');
    $('#buses').empty();
    let busStopId = $('#stopId').val();

    $.get(baseServiceUrl + busStopId + ".json")
        .then(loadBuses)
        .catch(displayError);

    function loadBuses(busStop) {
        $('#stopName').text(busStop.name);

        for(let bus in busStop.buses){
            $('#buses')
                .append($('<li>')
                .text(`Bus ${bus} arrives in ${busStop['buses'][bus]} minutes`));
        }
    }

    function displayError() {
        $('#stopName').text("Error");
    }
}