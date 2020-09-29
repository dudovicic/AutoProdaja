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



router.get("/profil",isLoggedIn,function(req,res){
Cars.find({},function(err,pgcars){
    if(err){
    console.log("Error: ");
    console.log(err);
}
else{
    res.render("profil",{pginfo:pgcars, curruser:req.user});
}
});


});

router.get("/search",function(req,res){
  try {

    Cars.find( {$and: [
              {price: {$lte : req.query.pricee }},
              {"$or":[
                { name: null }, { name:'' }, {name:{'$regex':req.query.dsearch, $options: 'i' }}
              ]},
              {"$or":[
              { color: null }, { color:'' }, {color:{'$regex':req.query.color }}
              ]},
              {"$or":[
              { location: null }, { location:'' }, {location:{'$regex':req.query.dlocation, $options: 'i'  }}
              ]},
              {"$or":[
              { yearmanufacture: null }, { yearmanufacture:'' }, {yearmanufacture:{'$regex':req.query.yearmanufacture, $options: 'i'  }}
              ]},
              {"$or":[
              { carbrand: null }, { carbrand:'' }, {carbrand:{'$regex':req.query.carbrand }}
              ]},
              {"$or":[
              { engine: null }, { engine:'' }, {engine:{'$regex':req.query.engine }}
              ]},
              {"$or":[
              {km: {$lte : req.query.km }}
              ]},
              {"$or":[
              { model: null }, { model:'' }, {model:{'$regex':req.query.model, $options: 'i' }}
              ]},
              {"$or":[
              { typeofdrive: null }, { typeofdrive:'' }, {typeofdrive:{'$regex':req.query.typeofdrive, $options: 'i' }}
              ]},
              {"$or":[
              { gas: null }, { gas:'' }, {gas:{'$regex':req.query.gas, $options: 'i' }}
              ]},
              {"$or":[
              { airconditioning: null }, { airconditioning:'' }, {airconditioning:{'$regex':req.query.airconditioning, $options: 'i' }}
              ]},
              {"$or":[
              { gearshift: null }, { gearshift:'' }, {gearshift:{'$regex':req.query.gearshift, $options: 'i' }}
              ]},
              {"$or":[
              { numberofgears: null }, { numberofgears:'' }, {numberofgears:{'$regex':req.query.numberofgears, $options: 'i' }}
              ]},
              {"$or":[
              { numberofdoors: null }, { numberofdoors:'' }, {numberofdoors:{'$regex':req.query.numberofdoors, $options: 'i' }}
              ]},
              {"$or":[
              { numberofseats: null }, { numberofseats:'' }, {numberofseats:{'$regex':req.query.numberofseats, $options: 'i' }}
              ]},
              {"$or":[
              { ecocategory: null }, { ecocategory:'' }, {ecocategory:{'$regex':req.query.ecocategory, $options: 'i' }}
              ]},
              {"$or":[
              { numberofowner: null }, { numberofowner:'' }, {numberofowner:{'$regex':req.query.numberofowner, $options: 'i' }}
              ]},
              {"$or":[
              { audio: null }, { audio:'' }, {audio:{'$regex':req.query.audio, $options: 'i' }}
              ]},
              {"$or":[
              { airbags: null }, { airbags:'' }, {airbags:{'$regex':req.query.airbags, $options: 'i' }}
              ]},
              {"$or":[
              { payment: null }, { payment:'' }, {payment:{'$regex':req.query.payment, $options: 'i' }}
              ]}
            ]}
            ,(err,data)=>{
               if(err){
                   console.log(err);
               }else{
                   res.render('searched',{pginfo:data, curruser:req.user});
               }
           })
  } catch (error) {
      console.log(error);
  }
});



router.get("/carssale",function(req,res){

    Cars.find({
    },function(err,pgcars){
        if(err){
        console.log("Error: ");
        console.log(err);
    }
    else{
        res.render("carssale",{pginfo:pgcars, curruser:req.user});
        //console.log(req.user);
    }
    });

});



router.post("/carssale",isLoggedIn,upload.single('carimage'),function(req,res){
    cloudinary.uploader.upload(req.file.path, function(result) {
            var name = req.body.carname;
            var price = req.body.carprice;
            var image = result.secure_url;
            var contact = req.body.carcontact;
            var description = req.body.descriptionform;
            var engine = req.body.engine;
            var km = req.body.km;
            var yearmanufacture = req.body.yearmanufacture;
            var carbrand = req.body.carbrand;
            var location = req.body.location;
            var color = req.body.color;
            var model = req.body.model;
            var typeofdrive= req.body.typeofdrive;
            var gas= req.body.gas;
            var airconditioning= req.body.airconditioning;
            var gearshift= req.body.gearshift;
            var numberofgears= req.body.umberofgears;
            var numberofdoors= req.body.numberofdoors;
            var numberofseats= req.body.numberofseats;
            var ecocategory= req.body.ecocategory;
            var numberofowner= req.body.numberofowner;
            var audio= req.body.audio;
            var airbags= req.body.airbags;
            var payment= req.body.payment;
            var owner={
                id:req.body.req.user._id,
                firstname:req.user.firstname
            }
            var newpg = {
                  name:name,
                  image:image,
                  price:price,
                  contact:contact,
                  description:description,
                  engine:engine,
                  km:km,
                  yearmanufacture:yearmanufacture,
                  carbrand:carbrand,
                  location:location,
                  color:color,
                  model:model,
                  owner:owner,
                  typeofdrive:typeofdrive,
                  gas:gas,
                  airconditioning:airconditioning,
                  gearshift:gearshift,
                  numberofgears:numberofgears,
                  numberofdoors:numberofdoors,
                  numberofseats:numberofseats,
                  ecocategory:ecocategory,
                  numberofowner:numberofowner,
                  audio:audio,
                  airbags:airbags,
                  payment:payment
                }

              Cars.create(newpg, function(err, car) {
                if (err) {
                  console.log("ERROR");
                  return res.redirect('addpg');
                }

                req.flash("success","Uspješno ste dodali auto!");
                res.redirect('/carssale/');
              });
        });
});

router.get("/carssale/addpg",isLoggedIn,function(req,res){
  res.render("addpg.ejs");
});

router.get("/carssale/:id",function(req,res){
    Cars.findById(req.params.id).populate("comments").exec(function(err,detailcar){
        if(err){
            console.log("ERROR: ");
            console.log(err);
        }
        else{
                res.render("acar",{carinfo:detailcar});
        }
    });
});

router.get("/carssale/:id/edit",ownership,function(req,res){
    Cars.findById(req.params.id,function(err,foundcar){
        if(err){
            console.log(err);
        }
        else{
           res.render("edit",{carinfo:foundcar});
        }
    });

});

router.put("/carssale/:id",ownership,upload.single('carimage'),function(req,res){
  const carimage = req.file;
  if (!carimage) {
                      var data = {
                          name:req.body.carname,
                          price:req.body.carprice,
                          contact:req.body.carcontact,
                          status:req.body.status,
                          color:req.body.color,
                          engine:req.body.engine,
                          km:req.body.km,
                          yearmanufacture:req.body.yearmanufacture,
                          carbrand:req.body.carbrand,
                          location:req.body.location,
                          image:"https://res.cloudinary.com/uniquecloudname/image/upload/v1600866328/o9mt88uizdupqrl5swcb.jpg",
                          description:req.body.descriptionform,
                          model:req.body.model,
                          typeofdrive:req.body.typeofdrive,
                          gas:req.body.gas,
                          airconditioning:req.body.airconditioning,
                          gearshift:req.body.gearshift,
                          numberofgears:req.body.umberofgears,
                          numberofdoors:req.body.numberofdoors,
                          numberofseats:req.body.numberofseats,
                          ecocategory:req.body.ecocategory,
                          numberofowner:req.body.numberofowner,
                          audio:req.body.audio,
                          airbags:req.body.airbags,
                          payment:req.body.payment
                      }
                      Cars.findOneAndUpdate({_id:req.params.id},data,function(err,updated)
                      {
                       if(err){
                              res.redirect("/carssale");
                          }
                          else{
                              req.flash("success","Uspješno ste uredili podatke!");
                             res.redirect("/carssale/"+req.params.id);
                          }
                      });

          } else {
  cloudinary.uploader.upload(req.file.path, function(result) {

            var data = {
                name:req.body.carname,
                price:req.body.carprice,
                contact:req.body.carcontact,
                status:req.body.status,
                color:req.body.color,
                engine:req.body.engine,
                km:req.body.km,
                yearmanufacture:req.body.yearmanufacture,
                carbrand:req.body.carbrand,
                location:req.body.location,
                image:result.secure_url,
                description:req.body.descriptionform,
                model:req.body.model,
                typeofdrive:req.body.typeofdrive,
                gas:req.body.gas,
                airconditioning:req.body.airconditioning,
                gearshift:req.body.gearshift,
                numberofgears:req.body.umberofgears,
                numberofdoors:req.body.numberofdoors,
                numberofseats:req.body.numberofseats,
                ecocategory:req.body.ecocategory,
                numberofowner:req.body.numberofowner,
                audio:req.body.audio,
                airbags:req.body.airbags,
                payment:req.body.payment
            }
            Cars.findOneAndUpdate({_id:req.params.id},data,function(err,updated)
            {
             if(err){
                    res.redirect("/carssale");
                }
                else{
                    req.flash("success","Uspješno ste uredili podatke!");
                   res.redirect("/carssale/"+req.params.id);
                }
            });
});
}
});

router.delete("/carssale/:id",ownership,function(req,res){

    Cars.findByIdAndRemove(req.params.id, function(err,car){
       if(err){
           res.redirect("/carssale")
       }
       else {
           Comments.deleteMany({_id:{$in:car.comments}}, function(err){
               if (err) {
                console.log(err);
                }
                else{

                req.flash("success","Uspješno ste izbrisali ovu objavu!");
               res.redirect("/carssale")
                }

                });

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
function ownership(req,res,next){
    if(req.isAuthenticated()){
        Cars.findById(req.params.id,function(err,car){
            if(err){
                req.flash("error","Nije pronađeno!")
                res.redirect("back");
            }
           else{
               if((car.owner.id.equals(req.user._id))  || (req.user.role='admin')) {
               next();
                }
                else{

                    req.flash("error","Nemate prava!");
                    res.redirect("back");
                }
              }
        });
    }
    else{
        req.flash("error","Prijavite se!");
        res.redirect("back");
    }
}


module.exports=router;
