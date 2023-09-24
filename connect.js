const mongoose = require('mongoose')
const url=`mongodb+srv://blogdatabase:9tP40gluuJGsVIJo@cluster0.r2dmp9r.mongodb.net/?retryWrites=true&w=majority`

const connectDb=()=>{
    mongoose.connect(url).then(()=>{
    console.log("you are conected to db")
    }).catch((err)=>{
        console.log(err);
    })
}
module.exports=connectDb

//9tP40gluuJGsVIJo,
//user=>blogdatabase
//mongodb+srv://blogdatabase:<password>@cluster0.r2dmp9r.mongodb.net/?retryWrites=true&w=majority