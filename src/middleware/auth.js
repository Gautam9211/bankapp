const jwt = require("jsonwebtoken");
const register = require("../models/registers");
const bcrypt = require('bcryptjs');

const auth = async(req,res,next) =>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        const user = await register.findOne({_id:verifyUser._id});
        req.token =token;
        req.user= user;
        next();
       
    
    }
    catch(err){
         res.status(401).render('login');

    }
    


}




module.exports = auth;