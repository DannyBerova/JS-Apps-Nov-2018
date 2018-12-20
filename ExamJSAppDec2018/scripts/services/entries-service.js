let entriesService = (() => {

    function getAll() {
        const endpoint = `pets?query={}&sort={"likes": -1}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }
    function getFiltered(filter) {
        
        const endpoint = `pets?query={"category":"${filter}"}&sort={"likes": -1}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function create(data) {
        return remote.post('appdata', 'pets', 'kinvey', data);
    }

    function remove(entryId) {
        const endpoint = `pets/${entryId}`;

        return remote.remove('appdata', endpoint, 'kinvey');
    }

    function getById(entryId) {
        const endpoint = `pets/${entryId}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    const editById = function(data) {
        // data.likes = +data.likes;
        const endpoint = `pets/${data._id}`;
        return remote.update('appdata', endpoint, 'kinvey', data);
    }

    const allByCreator = function() {
        const userId = sessionStorage.getItem("userId");
        const endpoint = `pets?query={"_acl.creator":"${userId}"}`;
        
        return remote.get('appdata', endpoint, 'kinvey');
    };

    return {
        getAll,
        getFiltered,
        create,
        remove, 
        getById,
        editById,
        allByCreator
    }
})();