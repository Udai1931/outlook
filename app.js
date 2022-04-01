const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const app = express();
const multer  = require('multer')
const { MONGO_URI } = require('./secret') 

//DB Connection
mongoose.connect(MONGO_URI)
.then(()=>{
    console.log("DB connected");
}).catch((err)=>{
    console.log(err.messgae)
})


app.use(express.json())
app.use(cookieParser())
//cors
//serve static build

const userRouter = require('./routes/userRouter');
const mailRouter = require('./routes/mailRouter');
app.use('/user',userRouter);
app.use('/mails',mailRouter);

app.get("/",(req,res)=>{
    res.json({
        messgae:"Welcome to Server"
    })
})

//for multer only
const multerStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads')
    },
    filename:function(req,file,cb){
        cb(null,`user-${Date.now()}.jpeg`)
    }
});

const filter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true)
    } else {
      cb(new Error("Not an Image! Please upload an image"), false)
    }
  }

const upload = multer({
    storage: multerStorage,
    fileFilter: filter
  });
app.post("/ProfileImage", upload.single('photo') ,function(req,res){
    console.log("aaya")
    res.json({
        messgae:"Uploaded"
    })
});
app.get('/ProfileImage',(req,res)=>{
    res.sendFile(__dirname+"/multer.html");
});



app.listen(8080,()=>{
    console.log("Server running");
})