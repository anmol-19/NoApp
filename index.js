const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const db = require("mongoose");
const multer = require("multer");
const csv = require("csvtojson");
const jwt = require('jsonwebtoken');

KEY = "sdkfjfnsdksjdnfksdfjkdsfkndsnkfsfsdkfjfnweedkjfn"

const detail = require("./model/details");
const user = require("./model/user");

db.connect(
  "mongodb+srv://rohitomar:onetwoone@cluster0.oi8dpes.mongodb.net/npapp?retryWrites=true&w=majority"
)
  .then(() => console.log("connection to dp successful"))
  .catch((err) => console.log(err));

var mylogger = function(req, res, next){
    const token = req.headers.authorization;
    if(token) {
        jwt.verify(req.headers.authorization, KEY, (err, decoded) => {
        if(err) {
             return res.status(400).send('Session expired')
        }
        next()    
        })    
    }
}

app.use(express.json());


var storage = multer.memoryStorage();

var upload = multer({ storage: storage });

app.get("/", async (req, res) => {
    res.send("Hello from no app");
});
app.post("/saveContact",mylogger, upload.single("csv"), async (req, res) => {
    console.log(String(req.file.buffer));
    csv().fromString(String(req.file.buffer)).then(async(jsonObj)=>{
        console.log(jsonObj);
        const data = new detail(jsonObj[0]);
        const record = await data.save();
        return res.send(record);
    }).catch((err)=>res.send(err));
    
});

app.post("/createUser", async (req, res) => {
  const data = new user(req.body);
  const record = await data.save();
  res.send(record);
});

app.post('/verifyUser',mylogger, async (req,res)=>{
    const {email, password} = req.body;
    const record = await user.find({email:email});
    if(record.length>0){
        const password1 = record[0].password;
        if(password1===password){
            const token  = jwt.sign({email:email,name:record.name},KEY,{ expiresIn: '30d' });
            res.send({status:"login successful"});
        }
    }else{
        res.send({status:'User Not exists'})
    }
})

app.listen(port, () => {
  console.log(`listening to the port ${port}`);
});
