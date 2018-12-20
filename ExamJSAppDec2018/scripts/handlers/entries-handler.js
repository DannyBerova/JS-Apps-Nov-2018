handlers.getCreate = function (ctx) {
    handlers.initNav(ctx);

    if (!auth.isAuth()) {
        handlers.redirectLogin(ctx);
        return;
    }
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
    }).then(function (ctx) {
        this.partial('./templates/forms/create-form.hbs');
    });
}

handlers.createEntry = function (ctx) {
    handlers.initNav(ctx);

    if (!auth.isAuth()) {
        handlers.redirectLogin(ctx);
        return;
    }

    try {
        let data = {
            name: ctx.params.name,
            description: ctx.params.description,
            imageURL: ctx.params.imageURL,
            category: ctx.params.category,
            likes: "0"
        };

        if (data.name.trim().length < 1) {
            notify.showError('Name is required!');
        } else if (data.category.trim().length === 0) {
            notify.showError('No category!');
        } else {
            entriesService.create(data)
                .then((res) => {
                    notify.showInfo('Entry added!');
                    ctx.redirect('#/');
                }).catch(notify.handleError)
        }
    } catch (error) {
        console.log(error);
    }


};
handlers.getEditEntry = function (ctx) {
    handlers.initNav(ctx);

    if (!auth.isAuth()) {
        handlers.redirectLogin(ctx);
        return;
    }
    let entryId = ctx.params.id;
    entriesService.getById(entryId)
        .then(function (data) {
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function (ctx) {
                this.partial('./templates/forms/edit-form.hbs', data);
            })
        }).catch(notify.handleError);

};
handlers.postEditEntry = function (ctx) {
    handlers.initNav(ctx);

    if (!auth.isAuth()) {
        handlers.redirectLogin(ctx);
        return;
    }

    try {
        entriesService.getById(ctx.params.id)
            .then((pet) => {
                pet.description = ctx.params.description;

                entriesService.editById(pet)
                    .then((res) => {
                        notify.showInfo('Entry edited!');
                        ctx.redirect('#/home');
                    }).catch((f) => {
                        console.log(f)
                    });
            })
    } catch (error) {
        console.log(error);
    }
};

// handlers.likePet = function (ctx) {
//     const entryId = ctx.params.id;
//     const filter = ctx.params.filter;

//     try {
//         entriesService.getById(entryId)
//             .then((pet) => {
//                 pet.likes = (+pet.likes + 1);

//                 entriesService.editById(pet)
//                     .then((res) => {
//                         notify.showInfo('I like this pet!');
//                     }).catch((f) => {
//                         console.log(f)
//                     });
//             }).catch((fl) => {
//                 console.log(fl)
//             });
//         ctx.redirect('#/')
//     } catch (error) {
//         console.log(error);
//     }
// }

handlers.getDeleteEntry = function (ctx) {
    handlers.initNav(ctx);

    if (!auth.isAuth()) {
        handlers.redirectLogin(ctx);
        return;
    }
    let entryId = ctx.params.id;
    entriesService.getById(entryId)
        .then(function (data) {
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function (ctx) {
                this.partial('./templates/forms/delete-form.hbs', data);
            })
        }).catch(notify.handleError);

};
handlers.deleteEntry = function (ctx) {
    handlers.initNav(ctx);

    if (!auth.isAuth()) {
        handlers.redirectLogin(ctx);
        return;
    }
    const entryId = ctx.params.id;

    entriesService.remove(entryId)
        .then((res) => {
            notify.showInfo('Entry deleted.');
            this.redirect('#/');
        })
        .catch(notify.handleError);
};

handlers.getDetailsEntry = function (ctx) {
    handlers.initNav(ctx);

    if (!auth.isAuth()) {
        handlers.redirectLogin(ctx);
        return;
    }
    const entryId = ctx.params.id;

    entriesService.getById(entryId)
        .then(function (data) {

            ctx.isCreator = data._acl.creator === ctx.userId;
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/entry/entry-details.hbs', data);
            })
        }).catch((l) => {
            console.log(l)
        });
}

handlers.myEntries = function (ctx) {
    handlers.initNav(ctx);

    if (!auth.isAuth()) {
        handlers.redirectLogin(ctx);
        return;
    }
    entriesService.allByCreator()
        .then(function (allentries) {
            const haveEntries = allentries.length > 0;

            let data = {
                allentries,
                haveEntries
            };
            ctx.myentries = allentries;
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                myentry: './templates/entry/my-entry.hbs',
            }).then(function () {
                this.partial('./templates/entry/my-entries.hbs', data);

            })

        }).catch(notify.handleError);
};

handlers.initNav = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    ctx.userId = sessionStorage.getItem('userId');
}

handlers.redirectLogin = function (ctx) {
    notify.showError("Please, login first!");
    ctx.redirect("#/login");
}