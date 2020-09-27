var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    Cars = require("./models/cars"),
    Comments = require("./models/comments"),
    bodyParser = require("body-parser"),
    users = require("./models/users"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    moment = require("moment");
var authroutes = require("./routes/auth");
var commentroutes = require("./routes/comment");
var carssalesroutes = require("./routes/carssale");
var adminroutes = require("./routes/admin");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/cars"
//mongoose.connect(url,{useNewUrlParser:true},{useUnifiedTopology:true});
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify: false});

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret:"somesecret",
    resave:false,
    saveUninitialized:false
    }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

passport.use(new LocalStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

app.use(function(req,res,next){
    res.locals.curruser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
app.use(authroutes);
app.use(commentroutes);
app.use(carssalesroutes);
app.use(adminroutes);

 app.get('/test', function (req, res) {
  	Cars.find(function(err, records){
	 	aData = records;
	 	res.send(aData);
	   });
   });

app.listen(3000, () => {
    console.log('Server is running on port 3000...');
});
