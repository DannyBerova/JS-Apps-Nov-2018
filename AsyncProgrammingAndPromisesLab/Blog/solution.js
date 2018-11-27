function attachEvents() {
    const URL = 'https://baas.kinvey.com/appdata/kid_S1dmIqUCX/';
    const USERNAME = 'User';
    const PASSWORD = '123';
    const BASE_64 = btoa(USERNAME + ':' + PASSWORD);
    const AUTH = {'Authorization':'Basic ' + BASE_64};
    const SELECT = $('#posts');
    const TITLE = $('#post-title');
    const BODY = $('#post-body');
    const COMMENTS = $('#post-comments');

    $('#btnLoadPosts').on('click', loadPosts);
    $('#btnViewPost').on('click', viewPosts);

    function loadPosts() {
        SELECT.empty();
        $.ajax({
            method: 'GET',
            url: URL + 'posts',
            headers: AUTH
        }).then(function(res) {
            for (let post of res) {
                SELECT.append($(`<option id="${post._id}"; body="${post.body}">${post.title}</option>`))
            }

        }).catch(function(err) {

        });
    }

    function viewPosts() {
        let selectedEl = SELECT.find(':selected');
        let id = selectedEl.attr('id');
        
        $.ajax({
            method: 'GET',
            url: URL + `comments/?query={"post_id":"${id}"}`,
            headers: AUTH
        }).then(function(res) {
            BODY.empty();
            COMMENTS.empty();
            let value = selectedEl.text();
            let body = selectedEl.attr('body');
            TITLE.text(value);
            BODY.append($(`<li>${body}</li>`))

            for (let comment of res) {
                COMMENTS.append($(`<li>${comment.text}</li>`))
                console.log(comment)
            }

        }).catch(function(err) {

        });
    }

}