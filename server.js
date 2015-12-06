var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var mongoose = require('mongoose');
//var MONGODBURL = 'mongodb://localhost/test';
var MONGODBURL = 'mongodb://psys381f.cloudapp.net:27017/test';


//https://aaronpoon@s381fassign.scm.azurewebsites.net:443/s381fassign.git
//s381fassign.azurewebsites.net

var restaurantObj={address: {
        street: "",
        zipcode: "",
        building: "",
        coord:[0,0]
    },
    borough: "",
    cuisine: "",
    grades:[],
    name: "",
    restaurant_id: ""
};
/*
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/public/Restaurant.html');
    });
*/

// Path 0
app.get('/', function(req,res) {
	console.log('Incoming request: GET');
	console.log('Request body: ', req.body);
	console.log('name: ', req.params.name);
	res.write("Hello!!");
	res.end();
});

// Path 1
app.post('/new', function(req,res) {
	var restaurantsSchema = require('./models/restaurant');
	console.log("date",req.body.date);
	console.log("grade",req.body.grade);
	console.log("score",req.body.score);
	mongoose.connect(MONGODBURL);
	console.log("mongoose.connect");
	var db = mongoose.connection;
	console.log("after mongoose.connection");
	db.on('error', console.error.bind(console, 'connection error:'));
	console.log("db on");
	db.once('open', function (callback) {
		restaurantObj.grades=[];
                //get parameter from request body
		var grade = {};	
                if(req.body.date||req.body.grade||req.body.score){	
			grade.date = req.body.date;
			grade.grade = req.body.grade;
			grade.score = req.body.score;
			restaurantObj.grades.push(grade);
		}
		if(req.body.building){restaurantObj.address.building = req.body.building;}
		if(req.body.street){restaurantObj.address.street = req.body.street;}
		if(req.body.lon){restaurantObj.address.coord[0] = parseInt(req.body.lon);}
		if(req.body.lat){restaurantObj.address.coord[1] = parseInt(req.body.lat);}
		if(req.body.zipcode){restaurantObj.address.zipcode = req.body.zipcode;}
		if(req.body.borough){restaurantObj.borough= req.body.borough;}
		if(req.body.cuisine){restaurantObj.cuisine = req.body.cuisine;}
		if(req.body.name){restaurantObj.name = req.body.name;}
		//if(req.body.grade){restaurantObj.grades[0].grade = req.body.grade;}
		//if(req.body.score){restaurantObj.grades[0].score = req.body.score;}
		if(req.body.restaurant_id){restaurantObj.restaurant_id = req.body.restaurant_id;}

		console.log(restaurantObj);
                //console.log("db opened");
		var restaurants = mongoose.model('restaurant', restaurantsSchema);
                //console.log("mongoose.model");
                var r = new restaurants(restaurantObj);
		console.log(r);
                r.save(function(err) {
			if (err) {
				res.status(500).json(err);
				throw err
			}
			console.log('Restaurant created!')
			res.status(200).json({message: 'Insert done', id: r._id});
			console.log("db.closed")
			db.close();
        		res.end();
		});
		
	});
        
    
});

// Path 2
app.put('/update/:crifield/:criteria', function(req,res) {
	var restaurantsSchema = require('./models/restaurant');
	mongoose.connect(MONGODBURL);
	//console.log("mongoose.connect");
	var db = mongoose.connection;
	//console.log("after mongoose.connection");
	db.on('error', console.error.bind(console, 'connection error:'));
	//console.log("db on");
	db.once('open', function (callback) {
		var coordcri=""
		if (req.params.crifield=="lon"){coordcri="address.coord.0";}
		if (req.params.crifield=="lat"){coordcri="address.coord.1";}
		var criteria = {}
                if (req.params.crifield=="building"){criteria.address.building = req.params.criteria;}
                if (req.params.crifield=="street"){criteria.address.street = req.params.criteria;}
                if (req.params.crifield=="lon"){criteria[coordcri] = parseInt(req.params.criteria);}
                if (req.params.crifield=="lat"){criteria[coordcri] = parseInt(req.params.criteria);}
                if (req.params.crifield=="zipcode"){criteria.address.zipcode = req.params.criteria;}
                if (req.params.crifield=="borough"){criteria.borough = req.params.criteria;}
                if (req.params.crifield=="cuisine"){criteria.cuisine = req.params.criteria;}
                if (req.params.crifield=="name"){criteria.name = req.params.criteria;}
		//if(req.params.crifield=="date"){criteria.grades[0].date=req.params.criteria;}

		//if(req.params.crifield=="grade"){criteria.grades = { $elemMatch : {grade : req.params.criteria}};}

		//if(req.params.crifield=="score"){criteria.grades[0].score=parseInt(req.params.criteria);}
                if (req.params.crifield=="restaurant_id"){criteria.restaurant_id = req.params.criteria;}

		console.log("criteria:"+JSON.stringify(criteria))
                //console.log("db opened");
		var restaurants = mongoose.model('restaurant', restaurantsSchema);

		var updatecri = {};
		var coordcriteria="";
		if (req.params.field=="lon"){coordcriteria="address.coord.0";}
		if (req.params.field=="lat"){coordcriteria="address.coord.1";}

		console.log("coord:  " + coordcriteria);
		//setup the update criteria
		var grade = {};
		if(req.body.date||req.body.grade||req.body.score){
			if (req.body.date){grade.date = req.body.date;}
			if (req.body.grade){grade.grade = req.body.grade;}
			if (req.body.score){grade.score = req.body.score;}
			updatecri["grades.0"]=grade;
		}
		if (req.body.building){updatecri.address.building = req.body.building;}
		if (req.body.street){updatecri.address.street = req.body.street;}
		if (req.body.lon){updatecri[coordcriteria] = parseFloat(req.body.lon);}
		if (req.body.lat){updatecri[coordcriteria] = parseFloat(req.body.lat);}
		if (req.body.zipcode){updatecri.address.zipcode = req.body.zipcode;}
		if (req.body.borough){updatecri.borough = req.body.borough;}
		if (req.body.cuisine){updatecri.cuisine = req.body.cuisine;}
		if (req.body.name){updatecri.name = req.body.name;}
		if (req.body.restaurant_id){updatecri.restaurant_id = req.body.restaurant_id;}
		//updatecri[coordcriteria] = req.params.value;
		restaurants.update(criteria,{$set:updatecri},function(err,results) {
			if (err) {
				console.log("Error: " + err.message);
			}
			else {  
			    if(results){
				console.log("update done!   results: " + results);
				res.status(200).json({message: 'Update done: ', id: results._id});
			    }else{
				res.status(500).json({message: 'No matching document'});
			    }				
			    res.end();
			    db.close();
			}
		});
		
	});
});

//match 2 criteria
app.put('/update/:crifield/:criteria/:crifield2/:criteria2', function(req,res) {
	var restaurantsSchema = require('./models/restaurant');
	mongoose.connect(MONGODBURL);
	//console.log("mongoose.connect");
	var db = mongoose.connection;
	//console.log("after mongoose.connection");
	db.on('error', console.error.bind(console, 'connection error:'));
	//console.log("db on");
	db.once('open', function (callback) {

		var coordcri=""
		if (req.params.crifield=="lon" || req.params.crifield2=="lon"){coordcri="address.coord.0";}
		if (req.params.crifield=="lat" || req.params.crifield2=="lat"){coordcri="address.coord.1";}
		var criteria = {}
                if (req.params.crifield=="building"){criteria["address.building"]  = req.params.criteria;}
                if (req.params.crifield=="street"){criteria["address.street"] = req.params.criteria;}
                if (req.params.crifield=="lon"){criteria[coordcri] = parseInt(req.params.criteria);}
                if (req.params.crifield=="lat"){criteria[coordcri] = parseInt(req.params.criteria);}
                if (req.params.crifield=="zipcode"){criteria["address.zipcode"] = req.params.criteria;}
                if (req.params.crifield=="borough"){criteria.borough = req.params.criteria;}
                if (req.params.crifield=="cuisine"){criteria.cuisine = req.params.criteria;}
                if (req.params.crifield=="name"){criteria.name = req.params.criteria;}
                if (req.params.crifield=="restaurant_id"){criteria.restaurant_id = req.params.criteria;}

		//criteria2
		if (req.params.crifield2=="building"){criteria["address.building"] = req.params.criteria2;}
                if (req.params.crifield2=="street"){criteria["address.street"] = req.params.criteria2;}
                if (req.params.crifield2=="lon"){criteria[coordcri] = parseInt(req.params.criteria2);}
                if (req.params.crifield2=="lat"){criteria[coordcri] = parseInt(req.params.criteria2);}
                if (req.params.crifield2=="zipcode"){criteria["address.zipcode"] = req.params.criteria2;}
                if (req.params.crifield2=="borough"){criteria.borough = req.params.criteria2;}
                if (req.params.crifield2=="cuisine"){criteria.cuisine = req.params.criteria2;}
                if (req.params.crifield2=="name"){criteria.name = req.params.criteria2;}
                if (req.params.crifield2=="restaurant_id"){criteria.restaurant_id = req.params.criteria2;}

		console.log("criteria:"+JSON.stringify(criteria))
                
		var restaurants = mongoose.model('restaurant', restaurantsSchema);
                
		var updatecri = {};
		var coordcriteria="";
		if (req.params.field=="lon"){coordcriteria="address.coord.0";}
		if (req.params.field=="lat"){coordcriteria="address.coord.1";}

		console.log("coord:  " + coordcriteria);
		//setup the update criteria
		var grade = {};
		if(req.body.date||req.body.grade||req.body.score){
			if (req.body.date){grade.date = req.body.date;}
			if (req.body.grade){grade.grade = req.body.grade;}
			if (req.body.score){grade.score = req.body.score;}
			updatecri["grades.0"]=grade;
		}
		if (req.body.building){updatecri["address.building"] = req.body.building;}
		if (req.body.street){updatecri["address.street"] = req.body.street;}
		if (req.body.lon){updatecri[coordcriteria] = parseFloat(req.body.lon);}
		if (req.body.lat){updatecri[coordcriteria] = parseFloat(req.body.lat);}
		if (req.body.zipcode){updatecri["address.zipcode"] = req.body.zipcode;}
		if (req.body.borough){updatecri.borough = req.body.borough;}
		if (req.body.cuisine){updatecri.cuisine = req.body.cuisine;}
		if (req.body.name){updatecri.name = req.body.name;}
		if (req.body.restaurant_id){updatecri.restaurant_id = req.body.restaurant_id;}
		//updatecri[coordcriteria] = req.params.value;
		restaurants.update(criteria,{$set:updatecri},function(err,results) {
			if (err) {
				console.log("Error: " + err.message);
			}
			else {  
			    if(results){
				console.log("update done!   results: " + results);
				res.status(200).json({message: 'Update done: ', id: results._id});
			    }else{
				res.status(500).json({message: 'No matching document'});
			    }				
			    res.end();
			    db.close();
			}
		});
		
	});
});

// redirect /search?name=xxx&age=xx to RESTful path /name/:name/age/:age
app.get('/search',function(req,res) {
	console.log(req.url);
	var url = req.url;
	var arrayurl = url.substring(url.indexOf("?")+1).split("&");

	var redirectpath = ""
	for (var i=0;i<arrayurl.length;i++){
		var valuepair = arrayurl[i].split("=");
		console.log(valuepair[0]);
		var redirectpath = redirectpath.concat(valuepair[0]+'/');
		console.log(valuepair[1]);
		var redirectpath = redirectpath.concat(valuepair[1]+'/');
	}
        console.log(redirectpath);
	//var urlpt2 = url.substring(url.indexOf("=")+1)
	//var field1 = urlpt2.substring(url.indexOf("?"),url.indexOf("=")+1)

	//var parsedURL = url.parse(req.url,true); //true to get query as object
	//var queryAsObject = parsedURL.query;
	//console.log(queryAsObject);
	res.redirect('/show/' + redirectpath);
});

app.get('/show/:field/:value', function(req,res) {
	var restaurantsSchema = require('./models/restaurant');
	mongoose.connect(MONGODBURL);
	//console.log("mongoose.connect");
	var db = mongoose.connection;
	//console.log("after mongoose.connection");
	db.on('error', console.error.bind(console, 'connection error:'));
	//console.log("db on");
	db.once('open', function (callback) {
		
                //get parameter from request url
		var coordcri=""
		if (req.params.field=="lon"){coordcri="address.coord.0";}
		if (req.params.field=="lat"){coordcri="address.coord.1";}
		//console.log("coord:"+coordcri);
		var criteria = {};
                if (req.params.field=="building"){criteria["address.building"] = req.params.value;}
                if (req.params.field=="street"){criteria["address.street"] = req.params.value;}
		if (req.params.field=="zipcode"){criteria["address.zipcode"] = req.params.value;}
                if (req.params.field=="lon"){criteria[coordcri]=parseFloat(req.params.value);}
                if (req.params.field=="lat"){criteria[coordcri]=parseFloat(req.params.value);}
                if (req.params.field=="borough"){criteria.borough = req.params.value;}
                if (req.params.field=="cuisine"){criteria.cuisine = req.params.value;}
                if (req.params.field=="name"){criteria.name = req.params.value;}
		if (req.params.field=="date"){criteria.grades = {$elemMatch : {date: req.params.value}};}
		if (req.params.field=="grade"){criteria.grades = {$elemMatch : {grade : req.params.value}};}
		if (req.params.field=="score"){criteria.grades = {$elemMatch : {score : req.params.value}};}
                if (req.params.field=="restaurant_id"){criteria.restaurant_id = req.params.value;}		

		console.log(criteria);
                //console.log("db opened");
		var restaurants = mongoose.model('restaurant', restaurantsSchema);
                //console.log("mongoose.model");
                restaurants.find(criteria,function(err,results) {
			if (err) {
				res.status(500).json(err);
				throw err
			}
			else {
				if(results.length > 0){
					console.log("GET done!   results: " + results);
					res.status(200).json(results);
				}
				else {
					res.status(200).json({message: 'No matching document'});
				}


			}
			
			db.close();
			res.end();

		});
		
	});

});


app.get('/show/*', function(req,res) {
	//get parameter from request url
	console.log(req.url);
	var url = req.url;
	var arrayurl = url.substring(5).split("/");
	console.log(arrayurl);
	
	var restaurantsSchema = require('./models/restaurant');
	mongoose.connect(MONGODBURL);
	//console.log("mongoose.connect");
	var db = mongoose.connection;
	//console.log("after mongoose.connection");
	db.on('error', console.error.bind(console, 'connection error:'));
	//console.log("db on");
	db.once('open', function (callback) {
		//var coordcri=""
		var criteria = {};
		var grade = [];
		
		for (var i=1;i<arrayurl.length;i+=2){
			var field = arrayurl[i];
			
			var value = arrayurl[i+1];
			console.log("field: "+field + ", value: "+ value);
			if (field=="building"){criteria["address.building"] = value;}
		        if (field=="street"){criteria["address.street"] = value;}
		        if (field=="zipcode"){criteria["address.zipcode"] = value;}
			if (field=="lon"){criteria["address.coord.0"]=parseFloat(value);}
			if (field=="lat"){criteria["address.coord.1"]=parseFloat(value);}
		        if (field=="borough"){criteria.borough = value;}
		        if (field=="cuisine"){criteria.cuisine = value;}
		        if (field=="name"){criteria.name = value;}
			if (field=="date"){criteria.grades = {$elemMatch : {date: value}};}
			if (field=="grade"){criteria.grades = {$elemMatch : {grade : value}};}
			if (field=="score"){criteria.grades = {$elemMatch : {score : value}};}
		        if (field=="restaurant_id"){criteria.restaurant_id = value;}	
		}
		/*
		console.log(grade);
		console.log(grade.toString());
		var grade2 = '{$elemMatch:'+ grade.toString()+'}';
		console.log("grade2:  "+grade2);
		//var grade3 = '{'+grade2+'}';
                criteria.grades = grade2;
		*/
		//console.log("coord:"+coordcri);
		console.log(criteria);
                //console.log("db opened");
		var restaurants = mongoose.model('restaurant', restaurantsSchema);
                //console.log("mongoose.model");
                restaurants.find(criteria,function(err,results) {
			if (err) {
				res.status(500).json(err);
				throw err
			}
			else {
				if(results.length > 0){
					console.log("GET done!   results: " + results);
					res.status(200).json(results);
				}
				else {
					res.status(200).json({message: 'No matching document'});
				}


			}
			
			db.close();
			res.end();

		});
		
	});

});


app.get('/showscore/:field/:cond/:value', function(req,res) {
	var field = req.params.field
	var cond = req.params.cond
	var value = req.params.value
	var restaurantsSchema = require('./models/restaurant');
	mongoose.connect(MONGODBURL);
	//console.log("mongoose.connect");
	var db = mongoose.connection;
	//console.log("after mongoose.connection");
	db.on('error', console.error.bind(console, 'connection error:'));
	//console.log("db on");
	db.once('open', function (callback) {
		//var coordcri=""
		var criteria = {};

		console.log("field: "+field + ", value: "+ value);
		if(cond == "gt"){
			if (field=="score"){criteria.grades = {$elemMatch : {score : {$gt : parseInt(value)}}};}
		}
		if(cond == "gte"){
			if (field=="score"){criteria.grades = {$elemMatch : {score : {$gte : parseInt(value)}}};}
		}
		if(cond == "lt"){
			if (field=="score"){criteria.grades = {$elemMatch : {score : {$lt : parseInt(value)}}};}
		}
		//console.log("coord:"+coordcri);
		console.log(criteria);
                //console.log("db opened");
		var restaurants = mongoose.model('restaurant', restaurantsSchema);
                //console.log("mongoose.model");
                restaurants.find(criteria,function(err,results) {
			if (err) {
				res.status(500).json(err);
				throw err
			}
			else {
				if(results.length > 0){
					console.log("GET done!   results: " + results);
					res.status(200).json(results);
				}
				else {
					res.status(200).json({message: 'No matching document'});
				}


			}
			
			db.close();
			res.end();

		});
		
	});

});



app.delete('/del/:field/:value', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('restaurant', restaurantSchema);
		var inputName = req.params.field;
		var criteria = {};
		if (req.params.field == 'street') {criteria.address.street = req.params.value;}
		if (req.params.field == 'zipcode') {criteria.address.zipcode = req.params.value;}
		if (req.params.field == 'building') {criteria.address.building = req.params.value;}
		if (req.params.field == 'lon') {criteria["address.coord.0"] = req.params.value;}
		if (req.params.field == 'lat') {criteria["address.coord.1"] = req.params.value;}
		if (req.params.field == 'restaurant_id') {criteria.restaurant_id = req.params.value;}
		if (req.params.field == 'name') {criteria.name = req.params.value;}
		if (req.params.field == 'borough') {criteria.borough = req.params.value;}
		if (req.params.field == 'date') {criteria.grades = {$elemMatch:{date:req.params.value}};}
		if (req.params.field == 'grade') {criteria.grades = {$elemMatch:{grade:req.params.value}};}
		if (req.params.field == 'score') {criteria.grades = {$elemMatch:{score:req.params.value}};}
		console.log(criteria);
		//Restaurant.find({restaurant_id: req.params.id},function(err,results){
		Restaurant.findOne(criteria).remove(function(err,results){
			//console.log(results);
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			db.close();
			res.status(200).json({message: 'delete done'});
    	});
    });
});



app.listen(process.env.PORT || 8099);
