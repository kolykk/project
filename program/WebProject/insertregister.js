//////////////////////////////////Get data by POST method/////////////////////////////////////////
app.post('/register',function(req,res){
	var qs = require('querystring');
			                      // console.log("data is "+util.inspect(req.data,{showHidden: false, depth: null}));
			                      if (req.method == 'POST') {
			                      	var body = '';
			                      	req.on('data', function (data) {
			                                // console.log("data is "+data);
			                                body += data;
			                                if (body.length > 1e6)
			                                	req.connection.destroy();
			                            });
			                      	req.on('end', function () {
			                      		var id = uuid.v1();
			                      		var post = qs.parse(body);
			                      		console.log("util.inspect(post) is "+util.inspect(post));
			                      		var name = post.name;
			                      		console.log("name is "+name);
			                      		var established = post.established;
			                      		console.log("established is "+established);
			                      		var type = post.type;
			                      		console.log("type is "+type);
			                      		var location = post.location;
			                      		console.log("location is "+location);
			                      		var descriptions = post.descriptions;
			                      		console.log("descriptions is "+descriptions);
///////////////////////////////////////////////INSERT DATA TO CASSANDRA///////////////////////////////////
var query = "INSERT INTO Sensor (id , descriptions , established , location , name , type ) VALUES (:id,:descriptions,:established,:location,:name,:type);";
const params = { id: id , descriptions: descriptions , established: established , location: location , name: name , type: type };
client.execute( query , params , { prepare: true } , function(err, result) {
	if(err){
		console.log('ERROR FIND!!! IS '+err);
	}else {
		console.log("Successfully !!");
	}
});
///////////////////////////////////////////////INSERT DATA TO CASSANDRA///////////////////////////////////
});
			                      }
			                  });
////////////////////////////////END Get data by POST method////////////////////////////////////////
