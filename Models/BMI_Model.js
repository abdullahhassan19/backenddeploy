
const mongoose = require("mongoose")


const userschema = new mongoose.Schema({
   BMI:{type: Number, required:true},
   weight:{type:String, required:true},
   height:{type:String, required:true},
   user_id:{type: String, required:true}
},{
    timestamps:true
}

)
const BMI_Model = mongoose.model("Bmidata", userschema )


module.exports={BMI_Model}