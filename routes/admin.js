var express = require("express");

var bodyParser = require("body-parser");

var router   = express.Router();
var Cars   = require("../models/cars");
var Users = require("../models/users");
var passport = require("passport");
var multer = require("multer");
var cloudinary = require('cloudinary');
var Comments = require("../models/comments")
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Učitaj sliku!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

cloudinary.config({
  cloud_name: 'uniquecloudname',
  api_key: 'xxx',
  api_secret: 'xxx'
});


router.get("/admin",isLoggedIn,function(req,res){

  var pginfo={};
  var users={};

  Cars.find({
  },function(err,allpgcars){
    if (err) {
           console.log(err);
       } else {
           pginfo=allpgcars;
       }
   });

   Users.find({}).sort({"date":'desc'}).exec(function(err, allusers) {
           if (err) {
               console.log(err);
           } else {
               users=allusers;
               res.render("admin",{pginfo:pginfo , users:users});
           }
       });
   });

router.delete("/carssale/deleteUser/:id",function(req,res){

       Users.findByIdAndRemove(req.params.id, function(err,user){
          if(err){
              res.redirect("/admin")
          }
          else {
                  req.flash("success","Uspješno ste izbrisali korisnika!");
                  res.redirect("/admin")
          }
       });
   });

router.get("/carssale/editUser/:id/edit",function(req,res){
       Users.findById(req.params.id,function(err,founduser){
           if(err){
               console.log(err);
           }
           else{
              res.render("editUser",{userinfo:founduser});
           }
       });
   });

router.use(express.urlencoded({ extended: false }));
   router.put("/carssale/editUser/:id",function(req,res){
      var userdata = {
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                username:req.body.username,
                role:req.body.role
              }
              Users.findOneAndUpdate({_id:req.params.id},userdata,function(err,updated)
              {
               if(err){

                      res.redirect("/admin");
                  }
                  else{
                /*    console.log(req.body);
                    console.log({userdata}); console.log(req.params.id);
                     console.log(req.body.firstname );
                      console.log(req.body.lastname);
                      console.log(req.body.email);
                       console.log(req.body.username );*/

                      req.flash("success","Uspješno ste uredili podatke!");
                     res.redirect("/admin/");
                  }
          });
   });



function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Morate biti prijavljeni!");
    res.redirect("/signin");
}



module.exports = router;
