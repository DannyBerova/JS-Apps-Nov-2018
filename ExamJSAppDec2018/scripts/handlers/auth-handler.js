handlers.getWelcomePage = function (ctx) {
    ctx.username = sessionStorage.getItem('username');
    ctx.userId = sessionStorage.getItem('userId');
    ctx.isAuth = auth.isAuth();
    ctx.entries = [];

    if (!auth.isAuth()) {
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            allflights: './templates/entry/all-entries.hbs',
            entry: './templates/entry/entry.hbs'
        }).then(function (ctx) {
            this.partial('./templates/welcome.hbs');
        })
    } else {
        try {
            let entries = entriesService.getAll().then(function (res) {
                ctx.haveEntries = res.length > 0;
                let filtered = filterResult(res, ctx);
                ctx.entries = filtered;

                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    allPets: './templates/entry/all-entries.hbs',
                    entry: './templates/entry/entry.hbs'
                }).then(function (ctx) {
                    this.partial('./templates/welcome.hbs');
                })
            }).catch(notify.handleError);
            ctx.isntAny = ctx.entries.length !== 0;
        } catch (err) {
            console.log(err)
        }
    }

};

handlers.getWithFilter = function (ctx) {
    ctx.name = sessionStorage.getItem('username');
    ctx.userId = sessionStorage.getItem('userId');
    ctx.isAuth = auth.isAuth();
    ctx.entries = [];

    if (!auth.isAuth()) {
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            allflights: './templates/entry/all-entries.hbs',
            entry: './templates/entry/entry.hbs'
        }).then(function (ctx) {
            this.partial('./templates/welcome.hbs');
        })
    } else {
        try {
            let filter = ctx.params.filter;
            let entries = entriesService.getFiltered(filter).then(function (res) {
                ctx.haveEntries = res.length > 0;
                let filtered = filterResult(res, ctx);
                ctx.entries = filtered;

                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    allPets: './templates/entry/all-entries.hbs',
                    entry: './templates/entry/entry.hbs'
                }).then(function (ctx) {
                    this.partial('./templates/welcome.hbs');
                })

            }).catch(notify.handleError);
            ctx.isntAny = ctx.entries.length !== 0;
        } catch (err) {
            console.log(err)
        }
    }
}

handlers.getLoginUser = function (ctx) {
    if (auth.isAuth()) {
        handlers.redirectHome(ctx);
        return;
    }
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
    }).then(function (ctx) {
        this.partial('./templates/forms/login-form.hbs');
    });
}

handlers.getRegisterUser = function (ctx) {
    if (auth.isAuth()) {
        handlers.redirectHome(ctx);
        return;
    }
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
    }).then(function (ctx) {
        this.partial('./templates/forms/register-form.hbs');
    });
}

handlers.registerUser = function (ctx) {
    if (auth.isAuth()) {
        handlers.redirectHome(ctx);
        return;
    }

    const username = ctx.params.username;
    const password = ctx.params.password;

    if (username.trim().length < 3) {
        notify.showError('Username must be at least 3 symbols long!');
        clearFields();
    } else if (password.trim().length < 6) {
        notify.showError('Password must be at least 6 symbols long!');
        clearFields(ctx);
    } else {
        auth.register(username, password)
            .then((userData) => {
                auth.saveSession(userData);
                notify.showInfo('User registration successful.');
                ctx.redirect('#/');
            }).catch(notify.handleError, clearFields(ctx))


    }
};
handlers.loginUser = function (ctx) {
    if (auth.isAuth()) {
        handlers.redirectHome(ctx);
        return;
    }
    const username = ctx.params.username;
    const password = ctx.params.password;

    if (username.trim().length < 3) {
        notify.showError('Username must be at least 3 symbols long!');
        clearFields(ctx);
    } else if (password.trim().length < 6) {
        notify.showError('Password must be at least 6 symbols long!');
        clearFields(ctx);
    } else {
        auth.login(username, password)
            .then((userData) => {
                auth.saveSession(userData);
                notify.showInfo('Login successful.');
                ctx.redirect('#/');
            }).catch(notify.handleError, clearFields(ctx));
    }
};
handlers.logout = function (ctx) {
    auth.logout()
        .then(() => {
            sessionStorage.clear();
            notify.showInfo('Logout successful.');
            ctx.isAuth = false;
            ctx.redirect("#/");
        }).catch(notify.handleError);
};

handlers.redirectHome = function (ctx) {
    notify.showError("You must to logout first!");
    ctx.redirect("#/");
}

function clearFields(ctx) {
    $('#username').val('');
    $('#password').val('');
}

function filterResult(res, ctx) {
    let filtered = res
        .filter(p => p._acl.creator !== ctx.userId)
        .sort((a, b) => +b.likes - +a.likes);
    return filtered;
}