const jwt = require("jsonwebtoken")
require("dotenv").config()
const Authentication = (req,res , next)=>{
  const token = req.headers?.authorization?.split(" ")[1]

  if(!token){
    res.send("Please login again")
  }

  const verified = jwt.verify(token,process.env.SECRETKEY )
  const user_id= verified.user_id
  if(verified){
    req.body.user_id= user_id
     next()
  }
  else{
    res.send("login again")
  }

}

module.exports={Authentication}