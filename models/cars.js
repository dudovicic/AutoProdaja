var mongoose    = require("mongoose");

var carsSchema = new mongoose.Schema({
    name: String,
    image: String,
    status:  { type:String, default:"prodaja"},
    color: String,
    description:String,
    price:Number,
    location:String,
    contact:Number,
    engine:String,
    model:String,
    km:Number,
    yearmanufacture: String,
    carbrand:String,
    typeofdrive:String,
    gas:String,
    airconditioning:String,
    gearshift:String,
    numberofgears:String,
    numberofdoors:String,
    numberofseats:String,
    ecocategory:String,
    numberofowner:String,
    audio:String,
    airbags:String,
    payment:String,
    enginepower:Number,
    cod:Number,
    owner:{
       id:{ type: mongoose.Schema.Types.ObjectId,
        ref:"users"
       },
       firstname:String
    },
    createdAt: { type: Date, default: Date.now },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments"
    }]
}
);

var Cars = mongoose.model("Cars",carsSchema);
module.exports = Cars;
