const express = require('express')
const fs = require('fs')
const Post = require('./model/post')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();
const secret = "mohdarif"
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const User = require('./model/user')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const uploadMiddleware = multer({ dest: 'uploads/' })
const app = express()
app.use('/uploads',express.static(__dirname+'/uploads'))

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: '*'
}))
//const url=`mongodb+srv://alliswell5solution:1q0jLQcWHPExht3F@cluster0.0fi4re1.mongodb.net/?retryWrites=true&w=majority`
 const url = `mongodb://127.0.0.1:27017`
mongoose.connect(url)
app.use('/register', async (req, res) => {
    const { username, password } = req.body
    try {
        const salt = bcrypt.genSaltSync(10)
        const haspassword = bcrypt.hashSync(password, salt)
        const data = {
            username: username,
            password: password
        }
        data.password = haspassword
        const userDoc = await User.insertMany(data)
        res.send(userDoc)
        // console.log(userDoc)

    }
    catch (err) {

        // console.log(err);
    }
})
app.use('/login', async (req, res) => {
    const { user, pass } = req.body;

    const alldata = await User.findOne({ username: user });
    const userhaspassword = alldata.password
    console.log(alldata.username)
    const okpass = bcrypt.compareSync(pass, userhaspassword)
    console.log(okpass)

    if (okpass) {
        jwt.sign({ user_id: alldata._id, user: alldata.username }, secret, {}, (err, token) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(token)
            }
        })
    }
})

app.use('/profile', (req, res) => {
    const { jwttoken } = req.body;

    console.log(jwttoken);
    const verifytoken = jwt.verify(jwttoken, secret)
    // console.log(verifytoken)
    res.send(verifytoken.user)

})
app.use('/logout', (req, res) => {
    res.send()
})

app.post('/post', uploadMiddleware.single('File'), async (req, res) => {

    const { originalname, path } = req.file
  console.log(originalname)
    const fileName = originalname.split(".")
    const extension = fileName[fileName.length - 1]
    console.log(fileName, extension)
    console.log(req.file)
    const newpath = path + '.' + extension
    fs.renameSync(path, newpath)

    


    const { title, summary, content,token } = req.body
    const { jwttoken } = req.body;
     console.log(token)
    console.log(jwttoken);
    const verifytoken = jwt.verify(token, secret)
    // console.log(verifytoken)
    // res.send(verifytoken.user)
    PostDoc = await Post.create({
        title,
        summary,
        content,
        cover: newpath,
        auther:verifytoken.user_id,
    })
    console.log(PostDoc)
    res.send({"postdoc":PostDoc,
             "verifytoken.user":verifytoken                 
})
  
})
app.put('/post',uploadMiddleware.single('File'),async(req,res)=>{
    // console.log(req.file);
    let newpath=null
if(req.file)
{
    
    const { originalname, path } = req.file
  console.log(originalname)
    const fileName = originalname.split(".")
    const extension = fileName[fileName.length - 1]
    // console.log(fileName, extension)
    // console.log(req.file)
     newpath = path + '.' + extension
    fs.renameSync(path, newpath)
}
    const { title, summary, content,token,id } = req.body
    
    //  console.log(token)
   
    const verifytoken = jwt.verify(token, secret)
    // console.log(verifytoken)
    const postDoc=await Post.findById(id)
    console.log("postDoc",postDoc)
    console.log("postDoc",postDoc.auther)
    isAuther=JSON.stringify(postDoc.auther)===JSON.stringify(verifytoken.user_id)
    // res.send({isAuther,postDoc,verifytoken})
    if(!isAuther)
    {
        return res.send(isAuther)
    }
    await postDoc.updateOne({
        title, 
        summary, 
        content,
        cover:newpath?newpath:postDoc.cover
    })
    res.status(200).send(postDoc)
})
app.get('/', async (req, res) => {
    const data = await Post.find().populate('auther',['username'])
    console.log(__dirname+'/uploads');//directorey name
    res.send(data)
})
app.post('/post/:id',async(req,res)=>{
const data=req.body
console.log(data.token)
const verifytoken = jwt.verify(data.token, secret)
// console.log(verifytoken.user_id)
const id=data.id.id
// console.log(id)
const postdoc=await Post.findById(id)
// console.log(postdoc)
res.send({"postdoc":postdoc,"verefy":verifytoken.user_id})
})
// app.post('/post/delete/:id',async(req,res)=>{
//     const data=req.body
//     const itemId=data.id.id
//      console.log(data.id.id)
//      const postDoc= await Post.find()
//     // console.log(postDoc)
//  Post.deleteOne({ "_id": new ObjectId(`${itemId}`)})
//     //   res.send(postDoc)
//     })
// const PORT=process.env.PORT
app.listen(8080,() => {
    console.log(`you are 8080`);
 
})

//pwEfVxVH8xxIb9pg
//mongodb+srv://alliswell5solution:pwEfVxVH8xxIb9pg@cluster2.e9awp9j.mongodb.net/?retryWrites=true&w=majority

// password: '1q0jLQcWHPExht3F',