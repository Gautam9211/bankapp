const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userScheme = new mongoose.Schema({ 
    firstname:{ type: String,
        required: true,
        uppercase: true
    },
    lastname: { type: String, 
    required:true,
    uppercase: true
    },
    email: {
        type:String,
        unique:true,
        required : true,
    },
    password:{
      type : String,
      required : true  
    },
    
    Cpassword:{
        type : String,
        required : true  
      },
      balance:{
        type : Number,
        default:0  
      },
      tokens:[{
          token:{
              type:String,
              required:true
          }
      }]

});


userScheme.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    }
    catch(err){
        console.log(err);
    }
}



userScheme.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.Cpassword= this.password;
    }
   next();
})
const register = new mongoose.model("User",userScheme);


module.exports = register;



