const url = 'http://localhost:8080/blueprints/';
var apiclient = (function () {
    let temp=[]
    return {
        getBlueprintsByAuthor:  (name, callback)=> {
                $.get(url+name,(data)=>{
                    temp=data;
                });
                return callback(temp);
        },
        getBlueprintsByNameAndAuthor: (author, name, callback)=> {
            jQuery.ajax({
                url: url+author+"/"+name,
                success:  (result) =>{
                    callback([result]);
                },
                async: true
            });
        }
    };
})();