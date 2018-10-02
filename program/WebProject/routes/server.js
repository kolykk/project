var express = require('express');
var app = express();
var router = express.Router();
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({contactPoints: ['127.0.0.1'] }); //connect cassandra
var UUID = require('uuid-js');
//var managetype = require('./managetype')

/*//GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});


router.get('/login', function(req, res) {
  res.render('login');
});


router.get('/test',function(req,res){
	res.render('test');
});


router.get('/creNewDetail',function(req,res){
  res.render('creNewDetail');
});



// router.get('/details/:s_id',function(req,res){
//   console.log("req.s_id is "+req.s_id);
//   var query = "select s_name , control_humid , control_temp , finish_time , start_time from registration.detail WHERE s_id = "+req.s_id+"ALLOW FILTERING;";
//     // const params = {d_id : id , control_humid : humid , control_temp : temp , finish_time : req.body.finish_time , s_name : req.body.s_name , start_time : req.body.start_time};
//     client.execute( query ,{ prepare: true } , function(error, result) {
//       if(error){
//         console.log("error is "+error);
//       }else {
//           // console.log("test");
//           console.log("result.rows[0].control_humid is "+result.rows[0].control_humid);
//           res.jsonp(result.rows);
//         }
//       });
//   });

router.get('/getdata',function(req,res){
  var query = "select * from registration.sensor;";
    // const params = {d_id : id , control_humid : humid , control_temp : temp , finish_time : req.body.finish_time , s_name : req.body.s_name , start_time : req.body.start_time};
    client.execute( query ,{ prepare: true } , function(error, result) {
      if(error){
        console.log("error is "+err1);
      }else {
         //console.log("test");
          // console.log("result.rows is "+result.rows);
          res.jsonp(result.rows);
        }
      });
  });

router.get('/getdetail',function(req,res){
  var query = "select * from registration.detail;";
    // const params = {d_id : id , control_humid : humid , control_temp : temp , finish_time : req.body.finish_time , s_name : req.body.s_name , start_time : req.body.start_time};
    client.execute( query ,{ prepare: true } , function(error, result) {
      if(error){
        console.log("error is "+err1);
      }else {
         //console.log("test");
          // console.log("result.rows is "+result.rows);
          res.jsonp(result.rows);
        }
      });
  });



// router.get('/getdetails',function(req,res){
//   var query = "select * from registration.detail;";
//     // const params = {d_id : id , control_humid : humid , control_temp : temp , finish_time : req.body.finish_time , s_name : req.body.s_name , start_time : req.body.start_time};
//     client.execute( query ,{ prepare: true } , function(error, result) {
//       if(error){
//         console.log("error is "+err1);
//       }else {
//           // console.log("test");
//           // console.log("result.rows is "+result.rows);
//           res.jsonp(result.rows);
//         }
//       });
//   });

router.param('d_id', function (req,res,next,d_id) {
    // console.log("s_id is "+s_id);
    // console.log("req.body is "+req.body);
    var query = "select d_id from registration.detail where d_id = "+d_id+";";
    // const params = {d_id : id , control_humid : humid , control_temp : temp , finish_time : req.body.finish_time , s_name : req.body.s_name , start_time : req.body.start_time};
    client.execute( query ,{ prepare: true } , function(error, result) {
      if(error){
        console.log("error is "+error);
      }else {
          // console.log("TEST1");
          // console.log("result.rows is "+result.rows);
          // res.jsonp(result.rows);
          // console.log("result is "+result.rows[0].s_id);
          req.d_id = result.rows[0].d_id;
          next();
        }
      });
  });

router.param('s_id', function (req,res,next,s_id) {
    // console.log("s_id is "+s_id);
    // console.log("req.body is "+req.body);
    var query = "select s_id from registration.sensor where s_id = "+s_id+";";
    // const params = {d_id : id , control_humid : humid , control_temp : temp , finish_time : req.body.finish_time , s_name : req.body.s_name , start_time : req.body.start_time};
    client.execute( query ,{ prepare: true } , function(error, result) {
      if(error){
        console.log("error is "+error);
      }else {
          // console.log("TEST1");
          // console.log("result.rows is "+result.rows);
          // res.jsonp(result.rows);
          // console.log("result is "+result.rows[0].s_id);
          req.s_id = result.rows[0].s_id;
          next();
        }
      });
  });

router.delete('/delete/:s_id',function(req,res){
  console.log("req.s_id is "+req.s_id);
  var query = "DELETE FROM registration.sensor WHERE s_id = "+req.s_id+";";
  var query1 = "select d_id FROM registration.detail WHERE s_id = "+req.s_id+";";
  client.execute( query , { prepare: true } , function(error, result) {
    if(error){
      console.log("ERROR is "+error);
    }else {
              // console.log("test2");
              // client.execute( query1, { prepare: true} , function(error1, result1){
              //     if(error1){
              //       console.log("error is "+error1);
              //     }
              //     else{
              //       console.log('my select is = '+result1.rows);
              //     }
              // });
              console.log('SUCCESS !!');
              
              client.execute( query1 , {prepare:true} , function(error1,result1){
                var queryDelete = '';
                for(var i=0;i < result1.rows.length;i++){
                  console.log('result d_id is '+result1.rows[i].d_id);
                  queryDelete = 'delete from registration.detail where d_id = '+result1.rows[i].d_id+';';
                  client.execute(queryDelete ,{prepare: true});
                  console.log("success delete detail d_id #"+result1.rows[i].d_id);
                }
              });
              res.jsonp(result.rows);
            }
          });
});

// router.delete('/delete/:s_id',function(req,res){
//   console.log("req.s_id is "+req.s_id);
//   var query = "DELETE FROM registration.sensor WHERE s_id = "+req.s_id+";";
//    console.log("req.d_id is "+req.d_id);
//    var query1 = "DELETE FROM registration.detail WHERE s_id = "+req.s_id+";";
//   client.execute( query  , { prepare: true } , function(error, result) {
//     if(error){
//       console.log("ERROR is "+error);
//     }else {
//               // console.log("test2");
//               client.execute( query1 , { prepare: true } , function(error1, result1) {
//                 if(error){
//                   console.log("ERROR is "+error1);
//                 }else {
//               // console.log("test2");
//               console.log('SUCCESS DELETE Detail!!');
//               // res.redirect('/manageinfo');
//             }
//           });

//               console.log('SUCCESS !!');
//               //res.redirect('/manageinfo');

//             }
//           });
// });

router.delete('/deletedetail/:d_id',function(req,res){
  console.log("req.d_id is "+req.d_id);
  var query = "DELETE FROM registration.detail WHERE d_id = "+req.d_id+";";
  var query1 = "select s_id FROM registration.detail WHERE d_id = "+req.d_id+";";

  client.execute( query1, {prepare:true} , function(error1,result1){
    console.log(result1.rows[0].s_id);
    var query2 = 'select d_id from registration.detail where s_id = '+result1.rows[0].s_id+';';
    client.execute( query2 ,{prepare:true} , function(error2,result2){
      console.log(result2.rows.length);
      if(result2.rows.length > 1){
        client.execute( query , { prepare: true } , function(error, result) {
          if(error){
            console.log("ERROR is "+error);
          }else {
     //     console.log("test2");
     console.log('SUCCESS !!');          
     res.jsonp(result.rows);
   }
 });
      }else{
        console.log("can't delete detail");
        res.jsonp(result2.rows);
      }
    });
  });
});

// router.put('/details/update/:s_id',function(req,res){
//   console.log("req.s_id is "+req.s_id);
//   console.log("req.body is "+req.body.s_name);
//   var query = "UPDATE registration.detail SET control_humid = ? , control_temp = ? , start_time = ? , finish_time = ? WHERE s_id = "+req.s_id+";";
//   const params = [ req.body.control_humid , req.body.control_temp , req.body.start_time , req.body.finish_time ];
//   client.execute( query , params , { prepare: true } , function(error, result) {
//     if(error){
//       console.log("ERROR is "+error);
//     }else {
//               // console.log("test2");
//               console.log('SUCCESS !!');
//               // res.redirect('/manageinfo');
//             }
//           });
// });




// router.put('/update/:s_id',function(req,res){
//   console.log("req.s_id is "+req.s_id);
//   console.log("req.body is "+req.body.s_name);
//   var query = "UPDATE registration.sensor SET s_descriptions = ? , s_established = ? , s_location = ? , s_name = ? WHERE s_id = "+req.s_id+";";
//   var query1 = "select d_id from detail WHERE s_id = "+req.s_id+";";
//   var querydetail = "UPDATE registration.detail SET s_name = ? WHERE s_id = "+req.s_id+";";
//   const params = [ req.body.s_descriptions , req.body.s_established , req.body.s_location , req.body.s_name ];
//   const params1 = [ req.body.s_name];
//   client.execute( query , params , { prepare: true } , function(error, result) {
//     if(error){
//       console.log("ERROR is "+error);
//     }else {
//               // console.log("test2");
//               client.execute( querydetail , params1 , { prepare: true } , function(error1, result1) {

//                 if(error){
//                    console.log("ERROR is "+error1);
//                 }else {
//                     // console.log("test2");
//                     console.log('success update s_name of detail!! TEST');
//                     res.redirect('/manageinfo');
//                 }
//               });
//               console.log('success update sensor !!');
              
//     }
//   });
// });




router.put('/update/:s_id',function(req,res){
  console.log("req.s_id is "+req.s_id);
  var query = "UPDATE registration.sensor SET s_descriptions = ? , s_established = ? , s_location = ? , s_name = ? WHERE s_id = "+req.s_id+";";
  var query1 = "select d_id FROM registration.detail WHERE s_id = "+req.s_id+";";
  const params = [ req.body.s_descriptions , req.body.s_established , req.body.s_location , req.body.s_name ];
  client.execute( query , params , { prepare: true } , function(error, result) {
    if(error){
      console.log("ERROR is "+error);
    }else {
              // console.log("test2");
              // client.execute( query1, { prepare: true} , function(error1, result1){
              //     if(error1){
              //       console.log("error is "+error1);
              //     }
              //     else{
              //       console.log('my select is = '+result1.rows);
              //     }
              // });
              //console.log('SUCCESS!!');
              client.execute( query1 , {prepare:true} , function(error1,result1){
                var queryupdatedetail = '';
                for(var i=0;i < result1.rows.length;i++){
                  console.log('result d_id is '+result1.rows[i].d_id);
                  queryupdatedetail = 'UPDATE registration.detail SET s_name = ? where d_id = '+result1.rows[i].d_id+';';
                  const params1 = [ req.body.s_name];
                  client.execute(queryupdatedetail , params1 ,{prepare: true});
                  console.log("success update detail d_id #"+result1.rows[i].d_id);
                }
              });
              res.jsonp(result.rows);
            }
          });
});



router.put('/updatedetail/:d_id',function(req,res){
  console.log("req.d_id is "+req.d_id);
  console.log("req.body is "+req.body.control_humid);
  var temp = parseFloat(Math.floor(req.body.control_temp * 100) / 100);
  var humid = parseFloat(Math.floor(req.body.control_humid * 100) / 100);
  var query = "UPDATE registration.detail SET control_humid = ? , control_temp = ? , start_time = ? , finish_time = ? WHERE d_id = "+req.d_id+";";
  const params = [ humid , temp , req.body.start_time , req.body.finish_time ];
  client.execute( query , params , { prepare: true } , function(error, result) {
    if(error){
      console.log("ERROR is "+error);
    }else {
              // console.log("test2");
              console.log('success update detail !!');
              console.log('managedetail is entered !!');
            }
          });

});







router.post('/manageinfo/insertdetail',function(req,res){
  console.log("post insert detail");
  var id = cassandra.types.uuid();
  console.log('d_id = '+id);
  console.log('s_id = '+req.body.s_id);
  console.log('humid = '+req.body.control_humid);
  console.log('temp = '+req.body.control_temp);
  console.log('start_time = '+req.body.start_time);
  console.log('finish_time = '+req.body.finish_time);
  var temp = parseFloat(Math.floor(req.body.control_temp * 100) / 100);
  var humid = parseFloat(Math.floor(req.body.control_humid * 100) / 100);
  
  // console.log("req.body s_name is "+req.body.s_name);
  // console.log("req.body s_id is "+req.s_id);
  var query = "INSERT INTO registration.detail (d_id,control_humid,control_temp,start_time,s_id,s_name,finish_time) VALUES (:d_id,:control_humid,:control_temp,:start_time,:s_id,:s_name,:finish_time);";
  const params = [id, humid , temp , req.body.start_time , req.body.s_id, req.body.s_name, req.body.finish_time ];
  client.execute( query , params , { prepare: true } , function(error, result) {
    if(error){
      console.log("ERROR is "+error);
    }else {
              // console.log("test2");

              console.log('success insert detail !!');
              
            }
          });
//res.redirect('/managedetail');
});

module.exports = router;
