function attachEvents() {
    $('#btnLoadTowns').on('click', getTownsInfo);

    //let townsData = {}
    function getTownsInfo() {
       let townsData = $('#towns').val()
            .split(", ")
            .reduce((acc, cur) => {
                acc.towns.push({'town': cur});
                return acc;
            }, {'towns': []});

        renderTowns(townsData);
    }

    async function renderTowns(towns) {
        let source = await $.get('template.hbs');

        let template = Handlebars.compile(source);

        $('#root').html(template(towns));
        $('#towns').val("");
    }
}