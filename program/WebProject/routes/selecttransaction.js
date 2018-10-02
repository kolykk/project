var express = require('express');
var app = express();
var router = express.Router();



var cassandra = require('cassandra-driver')
var client = new cassandra.Client({contactPoints: ['127.0.0.1'] }); //connect cassandra

client.connect(function(err,result){
	console.log("connect select transactions cassandra");

});


var getAllTransaction = 'SELECT * FROM information.transaction';




router.get('/transactions',function (req,res){

	client.execute(getAllTransaction,[],function(err,result){
		if(err){
			res.status(404).send({msg: err});
		}else{
			res.render('transactions', {
				transactions: result.rows,
			})
			console.log("success transactions cassandra");
		}
	});



});


module.exports = router;