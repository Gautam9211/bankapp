require('dotenv').config()
const express  = require('express');
const app = express();
const port  = process.env.PORT || 9000;
require('./db/conn.js')
const jwt = require('jsonwebtoken')
const path = require('path');
const bcrypt = require('bcryptjs')
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const staticPath = path.join(__dirname,'../publicdir');
const viewPath = path.join(__dirname,'../templates/views')
const partialPath = path.join(__dirname,'../templates/partials');
app.set('view engine','hbs');
app.set('views',viewPath);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.static(staticPath));
hbs.registerPartials(partialPath);;
const auth = require('./middleware/auth');
const register = require("./models/registers")
app.get("/",(req,res)=>{
    res.render('index');
});
app.get("/signup",(req,res)=>{
    res.render('signup');
});
app.get("/signin",(req,res)=>{
    res.render('login');
});
app.get("/deposit",(req,res)=>{
    res.render('deposit')
})
app.get("/withdraw",(req,res)=>{
    res.render('withdraw')
})
app.get("/logout",auth,async(req,res)=>{
    try{
     
    req.user.tokens = req.user.tokens.filter((currentElement)=>{
        return  currentElement.token !== req.token;
    })
      res.clearCookie('jwt');
      console.log("LOGOUT SUSSESSFULLY")
      await req.user.save();
      res.render('login')
 

    }
    catch(err){

        res.send(err);

    }
})

app.get("/transaction",auth,async(req,res)=>{
try{
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
    const usermail = await register.findOne({_id : verifyUser._id});
    res.render('transaction',{usermail});

}
catch(err){
    res.send(err).status(401);

}
   
});
  

           
app.post('/transaction',  async function(req, res) {
       try{
        const amount = req.body.amount;
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        const User = await register.findOne({_id : verifyUser._id});
        // console.log(User)
        var newAmount = (parseInt(amount) + parseInt(User.balance)).toString();
        var updateBalance = await register.findByIdAndUpdate(User.id,{"balance": newAmount});
                if(updateBalance){
                    res.render('successful',{act:'Debited'})
                 }
                else{
                    res.status(400).send("not updated")
                }

     } 


    catch(err){
        res.send(err).status(401);
       }

});





app.post("/withdraw",async(req,res)=>{
    try{
        const amount = req.body.amount;
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        const User = await register.findOne({_id : verifyUser._id});
        const newAmount = (parseInt(User.balance) - parseInt(amount) ).toString();
        if(newAmount<0){
            res.render('insufficient'); 
        }
        else{
            var updateBalance = await register.findByIdAndUpdate(User.id,{"balance": newAmount});
            if(updateBalance){
                res.render('successful',{act:'Withdrawl'})
             }
            else{
                res.status(400).send("not updated")
            }
        }
      
     } 


    catch(err){
        res.send(err).status(401);
       }

})




app.post("/register",async(req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.Cpassword;
        if(password=== cpassword){

            const studentregistration = new register({
                firstname: req.body.first_name,
                lastname: req.body.last_name,
                dob : req.body.dob,
                gender : req.body.gender,
                email : req.body.email,
                phoneNumber: req.body.phone,
                subject : req.body.subject,
                password : password,
                Cpassword : cpassword

            })
  
            const token = await studentregistration.generateAuthToken();
            res.cookie("jwt",token,{
                expires: new Date(Date.now() +60000),
                httpOnly: true
            })
            const savedata = await studentregistration.save();
             res.status(201).render("login");

        }
        else{
            res.send(" Password doesn't match ")
        }
    }
    catch(e){
       res.status(400).send(e);
    }
})
////--------------login ----------------------//////


app.post('/login',async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.pass;
        const usermail = await register.findOne({email});
        const matchpassword = await bcrypt.compare(password,usermail.password);
        const token = await usermail.generateAuthToken();
        res.cookie("jwt",token,{
            expires: new Date(Date.now() +1000000),
            httpOnly: true
            // secure: true
        })
        if(matchpassword){
              
              res.status(201).render("transaction",{usermail});
            }
        else{
            res.send("Invalid login Details");
            }
    }
    catch(err){
     res.status(400).send("Invalid details" +err);
           }
})


app.listen(port,()=>{
    console.log(`app is listening port : ${port}`);
});