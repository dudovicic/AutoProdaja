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
    km:Number,
    yearmanufacture: String,
    carbrand:String,
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
