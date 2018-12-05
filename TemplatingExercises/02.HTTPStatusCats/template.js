$(() => {
    renderCatTemplate();
    
     function renderCatTemplate() {
         $.get("templateHbs.hbs").then((res) =>{
             
             let template = Handlebars.compile(res);
             $('#allCats').html(template({cats}));
             
             console.log(template({cats}))
            $('button').each((i, btn) => $(btn).on('click', toggleInfo));

            function toggleInfo(e) {
                let card = $(this);
                card.next().toggle();
         
                if(card.next().css("display") === "none") {
                    card.text("Show status code");
                } else {
                    card.text("Hide status code");
                }
            }
        });
    }
});