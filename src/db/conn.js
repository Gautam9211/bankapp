const mongoose = require('mongoose');
//connection creation and adding the rest db
mongoose.connect('mongodb://localhost:27017/CityBank',{useNewUrlParser: true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false}).then(()=>
    console.log("connected successfully")).catch((err)=> console.log(err))
;
