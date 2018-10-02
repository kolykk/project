var express = require('express');
var app = express();
var router = express.Router();



var cassandra = require('cassandra-driver')
var client = new cassandra.Client({contactPoints: ['127.0.0.1'] }); //connect cassandra

client.connect(function(err,result){
	console.log("connect select detail");

});

var getAlldetail = 'SELECT * FROM registration.detail';




router.get('/managedetail',function (req,res){

	
	client.execute(getAlldetail,[],function(err,result){
		if(err){
			res.status(404).send({msg: err});
		}else {

					res.render('managedetail', {
						detail: result.rows,
					})
					console.log("success select detail");
					//console.log(result.rows);
				}
			})
		});
	



module.exports = router;
