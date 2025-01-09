const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const JWT_SECERT = 'IloveNehaKumawatAlotbutduetomyfamilyIneedtoLeaveher';
const {userModel, todoModel} = require('./db')
mongoose.connect('mongodb+srv://sudhanshu6991:vVtBzGsTTAMTQPns@test.r3snx.mongodb.net/todo-app-database')
const app = express();
app.use(express.json());

app.post('/signin', async function(req,res){
  const email = req.body.email;
  const password = req.body.password;

  const user = await userModel.findOne({
    email : email,
    password : password,

  })

   if(user){
    console.log("User login id "+ user._id.toString());
    const token = jwt.sign({
      id: user._id.toString()
    },JWT_SECERT);

    console.log(user._id);
    res.json({
      
      token : token,

    })
   }else{
    res.status(404).json({
      message : "Incorrect credentials"
    })
   }

})

app.post('/signup', async function(req,res){
     const email = req.body.email;
     const password = req.body.password;
     const name     = req.body.name;

     await userModel.create({
      email : email,
      password: password,
      name: name
     })

     res.json({
      Message : "You are successfully registered"
     })
})

app.post('/todo', authMiddleware, async function(req,res){
    const title = req.body.title;
    const todostatus = req.body.todostatus;
    
    await todoModel.create({
      userId : req.userId,
      title : title,
      todostatus : todostatus
    })
    
    res.json({
      message : "todo added successfully"
    })
})

app.get('/todos', authMiddleware, async function(req,res){
       const userid = req.userId;
       const todos = await todoModel.findOne({
        userId : userid
       })

       res.json({
        todos
       })
})

function authMiddleware(req,res,next){
    const token = req.headers.token;
    const verifiedId  = jwt.verify(token,JWT_SECERT);
    
    console.log("Decoded id " + verifiedId.id); 
    if(verifiedId){
      req.userId = verifiedId.id;
      next();
    }else{
      res.json({
        message : "user not available"
      })
    }
}

app.listen(3000);

