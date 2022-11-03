var express = require('express');
const { Http2ServerRequest } = require('http2');
var router = express.Router();
var mysql = require('mysql');
const https = require('https');
const { response } = require('express');
//conect mysql
var con = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"rootpassword",
  database:"angularapp"
})
con.connect(function(err){
  if(err) throw err;
  console.log("connected_database");
})

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register_user',function(req,res,next){
  console.log("in in register",req.bo)
  let password=btoa(req.body.password)
  var register_user="INSERT INTO register(name,emailid,password) VALUES('"+req.body.name+"','"+req.body.emailid+"','"+password+"')";
  con.query(register_user,(err , )=>{
    if(err){
      res.send({
        StatusCode:500,
        message:'user not created'
      })
    }else{
       res.send(
      {
        StatusCode:200,
        message:'user register'
      })
    }
   
  })
})

router.post('/login',function(req,res,next){
  let password_login=btoa(req.body.password)
  var check_cred="SELECT * from register WHERE emailid='"+req.body.emailid+"' ";
  con.query(check_cred,(err , reqbody)=>{
    if(err){
      res.send({
        StatusCode:500,
        message:err
      })
    }
    if(password_login == reqbody[0].password){
      res.send({
        StatusCode:200,
        message:"user logged in"
      })
    }else{
      res.send({
        StatusCode:400,
        message:'wrong cred'
      })
    }
  })
})

router.post('/getcurrentweather',function(req,res,next){
  console.log(req.body)
  // fetch(`https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=28db65f1c321ac94f28ef1a7fe79a9bd`).then(data=>console.log(data.body))
  const url=`https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=28db65f1c321ac94f28ef1a7fe79a9bd`
  https.get(url,(response,err)=>{
    // console.log(response)
    response.on('data',(data)=>{
      var weatherdata = JSON.parse(data)
      // console.log("weatherdata",weatherdata)
      let needed_data={
        min_temp:weatherdata.main.temp_min,
        max_temp:weatherdata.main.temp_max,
        pressure:weatherdata.main.pressure,
        humidity:weatherdata.main.humidity,
        temperature:weatherdata.main.temp,
        wind:weatherdata.wind.speed,
        name:weatherdata.name
      };
      console.log(needed_data);
      res.send({
        StatusCode:200,
        data:needed_data
      })
  
    })
  })

})

router.post('/saveweatherdata',function(req,res,next){
  console.log(req.body)
})

router.get('/getsevendayweather',function(req,res,next){
  console.log(req.body)
  // fetch(`https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=28db65f1c321ac94f28ef1a7fe79a9bd`).then(data=>console.log(data.body))
  const url=`https://api.openweathermap.org/data/2.5/forecast/daily?q=${req.body.city}&cnt=7&appid=28db65f1c321ac94f28ef1a7fe79a9bd`;
  https.get(url,(response)=>{
    // console.log(response)
    response.on('data',(data)=>{
      const weatherdata = JSON.parse(data)
      console.log(weatherdata)
    })
  })
})



module.exports = router;
