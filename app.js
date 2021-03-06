var express = require("express");
var app = express(),
    http    = require('http'),
    db      = require('./models');

//Set up PG 
var pg = require("pg");
var models = require("./models/index.js");

//set up body-parser to receive from data
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

//Set up Method override
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");

app.get("/", function(req, res){
  models.Chirp.findAll().done(function(chirps, error){
    res.render("index", {chirps:chirps});
  });
});

app.post("/create", function(req, res){
  models.Chirp.create({
    chirp_text: req.body.chirp_text
  }).done(function(){
    res.redirect("/");
  });
});

app.get("/edit/:id", function(req, res){ 
  models.Chirp.findById(req.params.id).done(function(chirp, error){
    res.render("edit", {chirp:chirp});
  });
});

app.put("/update/:id", function(req, res){
  models.Chirp.findById(req.params.id).done(function(chirp, error){
    chirp.updateAttributes({chirp_text: req.body.chirp_text}).done(function(){
      res.redirect("/");
    });
  });
});

app.delete("/remove/:id", function(req, res){  
  models.Chirp.findById(req.params.id).done(function(chirp, error){
    chirp.destroy().done(function(){
      res.redirect("/");
    });
  });
});

// app.listen(3000);
// server.listen(process.env.PORT || 3000);

// all environments
app.set('port', process.env.PORT || 3000);

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

db.sequelize.sync().then(function() {
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});

