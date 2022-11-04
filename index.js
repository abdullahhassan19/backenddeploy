const express = require("express");
const { connection } = require("./Config/db.js");


const { UserModel } = require("./Models/UserModel.js");
require("dotenv").config()
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
const { Authentication } = require("./Midlewares/Authentication.js");
const { BMI_Model } = require("./Models/BMI_Model.js");
const cors = require("cors")
app.use(express.json());
app.use(cors())


const PORT= process.env.PORT || 8000

app.get("/", (req, res) => {
  console.log("Homepage");
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const isuser = await UserModel.findOne({ email: email });
  if (isuser) {
    // console.log(isuser)
    res.send({"msg":"try login"});
  }
  else{
    bcrypt.hash(password, 5, async function (err, hashedpas) {
      if (err) {
        res.send({"msg":"something went wrong"});
      }
      const newuser = new UserModel({
        name,
        email,
        password: hashedpas,
      });
      console.log(newuser)
      try {
        await newuser.save();
        res.send({"msg":"signup sucessfull"});
      } catch (err) {
        res.send({"msg":"error in signup"});
      }
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const hashedpassword = user.password;
  const user_id = user._id;
  console.log(user_id);
  bcrypt.compare(password, hashedpassword, function (err, result) {
    if (err) {
      res.send({"msg":"something wrong please login again"});
    }
    if (result) {
      const token = jwt.sign({ user_id }, process.env.SECRETKEY);
      console.log(token)
      res.send({ msg: "login sucessfll", token });
    } else {
      res.send({"msg":"please check credentials"});
    }
  });
});


app.get("/getProfile", Authentication, async (req,res)=>{
   const {user_id}= req.body 
   const user = await UserModel.findOne({_id:user_id})
  
   if(user){
      const {name, email}= user
      res.send({name,email})
   }
   else{
      res.send({"msg":"profile not found"})
   }

})

app.post("/calculateBMI", Authentication, async (req,res)=>{
  const  {height,weight, user_id}= req.body;

  const heightin_meter= Number(height)*0.3048
 const BMI= Number(weight)/(heightin_meter)**2

  const BmiValue= new BMI_Model({
    BMI,
    height:heightin_meter,
    weight,
    user_id
  })
  await BmiValue.save()
 res.send({BmiValue})
});

app.get("/getCalculation", Authentication, async (req, res) => {
  const {user_id} = req.body;
  const all_bmi = await BMI_Model.find({user_id : user_id})
  console.log(all_bmi)
  res.send({all_bmi})
})

app.listen(PORT, async () => {
  await connection;
  try {
    console.log("connected to db");
  } catch (err) {
    console.log(err, "error in db");
  }
  console.log(`Lostening on PORT${ PORT}`);
});
