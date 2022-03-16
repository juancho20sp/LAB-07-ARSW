const url = 'http://localhost:8080/blueprints/';
var apiclient = (function () {
    let temp=[]
    return {
        getBlueprintsByAuthor:  (name, callback)=> {
                jQuery.ajax({
                    url: url + name,
                    success:  (result) =>{
                        callback(null, result);
                    },
                    async: true
                });
        },

        getBlueprintsByNameAndAuthor: (author, name, callback)=> {
            jQuery.ajax({
                url: url + author + "/" + name,
                success:  (result) =>{
                    callback(null, [result]);
                },
                async: true
            });
        },

        putBlueprint: (author, name, points, callback) => {
            jQuery.ajax({
                url: url + author + "/" + name,
                type: 'PUT',
                data: points,
                contentType: 'application/json',
                async: true,
                success: (data) => {
                    if (data.length > 0){
                        callback(null, data);
                    } else {
                        callback(null, [data]);
                    }
                }
            });
        },

        postBlueprint: (data, callback) => {
            jQuery.ajax({
                url: url + JSON.parse(data).author +"/add",
                type: 'POST',
                data: data,
                contentType: 'application/json',
                async: true,
                success: (data) => {
                    if (data.length > 0){
                        callback(null, data);
                    } else {
                        callback(null, [data]);
                    }
                }
            });
        },

        deleteBlueprint: (author, name, data, callback) => {
            jQuery.ajax({
                url: url + author + "/" + name,
                type:'DELETE',
                data: data,
                contentType: "application/json",
                async: true,
                success: (data) =>{
                    if (data.length > 0){
                        callback(null, data);
                    } else {
                        callback(null, [data]);
                    }
                }
            });
        }
    };
})();