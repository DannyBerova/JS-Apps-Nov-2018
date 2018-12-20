const handlers = {};

$(() => {
    // Define routes here using Sammy.js
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        // this.before(function (ctx){
        //     if(!auth.isAuth()) {
        //         notify.showError("Please, login first!");
        //         ctx.redirect("#/login");
        //     }
        // })

        this.get('index.html', handlers.getWelcomePage);
        this.get('#/home', handlers.getWelcomePage);
        this.get('#/', handlers.getWelcomePage);
        this.get('#/filtered/:filter', handlers.getWithFilter);

        this.get('#/register', handlers.getRegisterUser);
        this.post('#/register', handlers.registerUser);

        this.get('#/login', handlers.getLoginUser);
        this.post('#/login', handlers.loginUser);

        this.get('#/logout', handlers.logout);

         this.get('#/create', handlers.getCreate);
         this.post('#/create', handlers.createEntry);

         this.get('#/entry/delete/:id', handlers.getDeleteEntry);
         this.post('#/entry/delete/:id', handlers.deleteEntry);

         this.get('#/entry/edit/:id', handlers.getEditEntry);
         this.post('#/entry/edit/:id', handlers.postEditEntry);

        //  this.get('#/entry/like/:id', handlers.likePet);
        //  this.post('#/entry/like/:id', handlers.likePet);

         this.get('#/entry/entry-details/:id', handlers.getDetailsEntry);
         this.get('#/my-entries', handlers.myEntries);

        });

    app.run();
});