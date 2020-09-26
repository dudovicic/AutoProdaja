var express = require("express");
var router   = express.Router();
var Cars   = require("../models/cars");
var Comments   = require("../models/comments");


router.post("/carssale/:id/comment",ownership,function(req,res){
    var commentcomp = {
        text:req.body.text,
        author:{
            id:req.user._id,
            firstname:req.user.firstname
            }
        }

            Comments.create(commentcomp,function(err,comment){
                if(err){
                    console.log("error!");
                }
                else{
                     Cars.findOne({_id:req.params.id},function(err,car){

                       if(err){
                                console.log("error!!");
                            }
                            else{
                                 car.comments.push(comment);
                                 car.save(function(err,data){
                                        if(err){
                                            console.log("error!");
                                            }
                                        else{
                                            Cars.findById(req.params.id).populate("comments").exec(function(err,detailcar){
                                            if(err){
                                                        console.log("ERROR: ");
                                                        console.log(err);
                                                    }
                                                    else{
                                                            req.flash("success","Uspjesno dodan komentar!");
                                                            res.redirect("/carssale/"+detailcar._id);
                                                    }
                                                });
                                            }
                                        });
                                }
                   });
                   }
            });
});


router.delete("/carssale/:id/comment/:comment_id",ownership,function(req,res){

var data = {
    text:req.body.text
}

Comments.findByIdAndRemove({_id:req.params.comment_id},data,function(err,updated){
        if(err){
            res.redirect("/carssale/"+req.params.id+"/comment/"+req.params.comment_id);
        }else{

                req.flash("success","Uspješno obrisan komentar!");
               res.redirect("/carssale/"+req.params.id);
        }
      });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/signin");
}

function ownership(req,res,next){
    if(req.isAuthenticated()){
        Cars.findById(req.params.id,function(err,car){
            if(err){
                res.redirect("back");
            }
           else{
               next();
              }
        });
    }
    else{
        res.redirect("back");
    }
}



module.exports = router;
