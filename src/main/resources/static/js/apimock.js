//@author hcadavid

apimock=(function(){

	var mockdata=[];

	mockdata["johnconnor"]=	[
        {author:"johnconnor","points":[{"x":150,"y":120},{"x":215,"y":115}],"name":"house"},
	    {author:"johnconnor","points":[{"x":340,"y":240},{"x":15,"y":215}],"name":"gear"},
	    {author:"johnconnor","points":[{"x":340,"y":240},{"x":640,"y":240},{"x":640,"y":40}, {"x":340,"y":40}],"name":"myNewHouse"},
    ];

	mockdata["maryweyland"]=[
        {author:"maryweyland","points":[{"x":140,"y":140},{"x":115,"y":115}],"name":"house2"},
	    {author:"maryweyland","points":[{"x":140,"y":140},{"x":115,"y":115}],"name":"gear2"},
	    {author:"maryweyland","points":[{"x":140,"y":140},{"x":115,"y":115},{"x":200,"y":200},{"x":400,"y":400}],"name":"myNewHouse2"}
    ];


	return {
		getBlueprintsByAuthor:function(authname,callback){
			callback(
				mockdata[authname]
			);
		},

		getBlueprintsByNameAndAuthor:function(authname,bpname,callback){
			callback(
				mockdata[authname].find(function(e){return e.name===bpname})
			);
		}
	}	

})();

/*
Example of use:
var fun=function(list){
	console.info(list);
}

apimock.getBlueprintsByAuthor("johnconnor",fun);
apimock.getBlueprintsByNameAndAuthor("johnconnor","house",fun);*/