var express = require("express");
var router   = express.Router();
var users   = require("../models/users");
var passport = require("passport");

router.get("/",function(req,res){
    res.render("landingpage");
});

router.get("/signup",function(req,res){
    res.render("signup");
});

router.get("/signin",function(req,res){
    res.render("signin");
});


router.get("/signout",function(req,res){
    req.flash("success","Uspješno ste odjavljeni!");
    req.logout();
    res.redirect("/");
});

router.post("/signup",function(req,res){
     users.register(new users(
         {
             firstname:req.body.firstname,
             lastname:req.body.lastname,
             email:req.body.email,
             username:req.body.username
     }),req.body.password,function(err,user){
        if(err){
            req.flash("error","Greška prilikom registarcije, molim probajte ponovno.");
            return res.render("signup");
        }

        passport.authenticate("local")(req,res, function(){

                    req.flash("success","Dobrodosli "+user.firstname+" na stranicu AutoProdaja!");
            res.redirect("/carssale");
        });
    });
});


router.post("/signin",passport.authenticate( "local", {
        successRedirect:"/carssale",failureRedirect:"/signin",failureFlash: true
    }) ,function(req,res){

});



function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Molim prvo se prijavite!");
    res.redirect("/signin");
}

module.exports = router;
