//require all necessary modules
const fs = require("fs");
const pug = require("pug");
const uuidv4 = require("uuid/v4");
const express = require("express");
const app = express();

//Set up the repetitive responses
function send404(response){
	response.statusCode = 404;
	response.write("Unknwn resource.");
	response.end();
}

//load restaurants
let restaurants = {};
fs.readdir('./restaurants', function(err, files){
	if(err){
		send500(response);
		return;
	}
	files.forEach(function(file) {
		let myFile = require('./restaurants/'+file);
		restaurants[myFile.id] = myFile;
	});
});

//set template engine
app.set("view engine", "pug");

//static server
app.use(express.static("public"));
app.use("/restaurant/", express.static("public"));
//body parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//request handlers
app.get("/", function(req, res, next){
	res.render("pages/home");
});
app.get("/restaurants", function(req, res, next){
	//make array of restaurant IDs
	let array = [];
	for(let key in restaurants){
		array.push(restaurants[key].id);
	}
	res.format({
		"text/html" : () => {res.render("pages/restaurants", {restaurants});} , 
		"application/json" : () => {res.status(200).json({restaurants:array});}
	});
})
app.get("/addrestaurant", function(req, res, next){
	res.render("pages/addrestaurant");
});
app.post("/restaurants", function(req, res, next){
	//send empty response if required fields are not there
	if(req.body.name == "" || req.body.delivery_fee == null || req.body.min_order == null){
		res.end();
		return;
	}
	//complete the new restaurant object and send to client
	let newR = req.body;
	newR.id = uuidv4();
	newR.menu = {};
	restaurants[newR.id] = newR;
	res.status(200).send(JSON.stringify(newR));
});
app.get("/restaurant/:restID", function(req, res, next){
	res.format({
		"text/html" : () => {res.render("pages/restaurant", {restaurant:restaurants[req.params.restID]});} , 
		"application/json" : () => {res.status(200).json(restaurants[req.params.restID]);}
	});
});
app.put("/restaurant/:restID", function(req, res, next){
	//if restaurant id doesn't exist, send 404
	if(!restaurants.hasOwnProperty(req.params.restID)) send404(res);
	//update restaurant data
	let resto = req.body;
	restaurants[req.params.restID] = resto;
	res.status(200).end();
});

//start server
app.listen(3000);
console.log("Server listening at http://localhost:3000");