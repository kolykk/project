/////////////////////////////////Connect to Cassandra/////////////////////////////
var cassandra = require('cassandra-driver')
	var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'date_09_10_2016'}); //connect cassandra
	var d = date.create(); // create auto keyspace
	var fm = d.format('Y-m-d H:M:S');
	var m = d.format('m').toString().substr(1,1);
	var query = "CREATE KEYSPACE IF NOT EXISTS m"+m;
	var table = "CREATE TABLE IF NOT EXISTS m"+m;
	table += "_2017.temperature_sensor ( data int, year int, month int, date int, hour int, minute int, second int, PRIMARY KEY (year,month,date,hour,minute,second));"
	query += "_2017 WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };";
	client.execute( query , function(err, result) {
		if(err){
			console.log('ERROR FIND!!! IS '+err);
		}else {
			console.log("Create key space successfully");
		}
	});
	client.execute( table , function(err, result) {
		if(err){
			console.log('ERROR FIND!!! IS '+err);
		}else {
			console.log("Create table successfully");
		}
	});
///////////////////////////END Connect to Cassandra/////////////////////////////

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
var query = "INSERT INTO sensor (id , descriptions , established , location , name , type ) VALUES (:id,:descriptions,:established,:location,:name,:type);";
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
