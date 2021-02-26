const mongoose = require('mongoose');
//connection creation and adding the rest db
mongoose.connect(process.env.MONGODB_URI||'mongodb+srv://BankDB:bankapp@cluster0.fyh5l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser: true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false}).then(()=>
    console.log("connected successfully")).catch((err)=> console.log(err))
;
