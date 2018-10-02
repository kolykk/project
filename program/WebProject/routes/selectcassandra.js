var express = require('express');
var app = express();
var router = express.Router();



var cassandra = require('cassandra-driver')
var client = new cassandra.Client({contactPoints: ['127.0.0.1'] }); //connect cassandra

client.connect(function(err,result){
	console.log("connect select sensor");

});

var getAllsensor = 'SELECT * FROM registration.sensor';




router.get('/manageinfo',function (req,res){

	
	client.execute(getAllsensor,[],function(err,result){
		if(err){
			res.status(404).send({msg: err});
		}else {

			res.render('manageinfo', {
				sensor: result.rows,


			})
			console.log("success select sensor");

		}

	})

});


// router.post('/insertdetail',function(req,res){
// 	console.log("post insert detail");
// 	console.log('humid = '+req.body.control_humid);
// 	var id = cassandra.types.uuid();
// 	var temp = parseFloat(Math.floor(req.body.control_temp * 100) / 100);
// 	var humid = parseFloat(Math.floor(req.body.control_humid * 100) / 100);
// 	console.log("req.body is "+req.body.control_humid);
// 	var query = "INSERT INTO registration.detail (d_id,s_id,s_name,control_humid,control_temp,start_time,finish_time) VALUES (:d_id,:s_id,:s_name,:control_humid,:control_temp,:start_time,:finish_time);";
// 	const params = [id,req.s_id,req.body.s_name, humid , temp , req.body.start_time , req.body.finish_time ];
// 	client.execute( query , params , { prepare: true } , function(error, result) {
// 		if(error){
// 			console.log("ERROR is "+error);
// 		}else {
//               // console.log("test2");

//               console.log('SUCCESS Detail  !!');
//               res.redirect('/managedetail');
//           }  
//       });

// });






module.exports = router;
