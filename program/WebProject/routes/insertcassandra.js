var express = require('express');
var app = express();
var router = express.Router();
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({contactPoints: ['127.0.0.1'] }); //connect cassandra
var UUID = require('uuid-js');

client.connect(function(err,result){
	console.log("connect insert sensor");

});

router.get('/', function(req, res) {
	res.render('register');
});


router.post('/insert',function(req,res){
	//console.log("router.post");
	//console.log(new Date()); // date now
	var uuid = cassandra.types.uuid();
	var id = cassandra.types.uuid();
	var query = "INSERT INTO registration.sensor (s_id,s_name,s_established,s_location,s_descriptions) VALUES (:s_id,:s_name,:s_established,:s_location,:s_descriptions);";
	const params = {s_id :req.body.s_id , s_name : req.body.s_name, s_established : req.body.s_established , s_location : req.body.s_location , s_descriptions : req.body.s_descriptions};
	client.execute( query , params , { prepare: true } , function(err, result) {
		if(err){
			console.log('ERROR FIND!!! IS '+err);
		}else {
			var temp = parseFloat(Math.floor(req.body.control_temp * 100) / 100);
			var humid = parseFloat(Math.floor(req.body.control_humid * 100) / 100);
			console.log("req.body.s_id is "+req.body.s_id);
			console.log("req.body.s_name is "+req.body.s_name);
			console.log("req.body.start_time is "+req.body.start_time);
			console.log("req.body.finish_time is "+req.body.finish_time);
			console.log("humid is "+humid);
			console.log("temp is "+temp);
			console.log("description" + req.body.s_descriptions);
			
			var query = "INSERT INTO registration.detail (d_id , s_id , control_humid,control_temp,finish_time,s_name,start_time) VALUES (:d_id,:s_id,:control_humid,:control_temp,:finish_time,:s_name,:start_time);";
			const params = {d_id : id , s_id : req.body.s_id, control_humid : humid , control_temp : temp , finish_time : req.body.finish_time , s_name : req.body.s_name , start_time : req.body.start_time};
			client.execute( query , params , { prepare: true } , function(err1, result1) {
				if(err1){
					console.log("error is "+err1);
				}else {
															//console.log("test2");
															console.log('success insert sensor');
															console.log('TEST 1234 !!!!!');
															res.redirect('/manageinfo');
														}

													});
		}
	});

});
module.exports = router;
