const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECERT = 'IloveNishaKumawatAlotbutduetomyfamilyIneedtoLeaveher';
const {userModel, todoModel} = require('./db')
const { z } = require('zod');



mongoose.connect('mongodb+srv://sudhanshu6991:vVtBzGsTTAMTQPns@test.r3snx.mongodb.net/todo-app-database')
const app = express();
app.use(express.json());

app.post('/signin', async function(req,res){
  const email = req.body.email;
  const password = req.body.password;

   
  const user = await userModel.findOne({
    email : email,
  })

    if(!user){
      res.status(403).json({
        message : 'User not available!'
      })
      return;
    } 

    // console.log('password from the POSTMAN '+ password);
    // console.log('password present in DB '+ user.password);
    const passwordmatch = await bcrypt.compare(password, user.password);
    // console.log(passwordmatch);
   if(passwordmatch){
   // console.log("User login id "+ user._id.toString());
    const token = jwt.sign({
      id: user._id.toString()
    },JWT_SECERT);

   // console.log(user._id);
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
     const requiredbody = z.object({
      email : z.string().min(3).max(70).email(), 
      password : z.string().min(3).max(30).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
      name : z.string().min(3).max(100)
     })
     
    // const parseddata = requiredbody.parse(req.body);
     const parseddataSuccess = requiredbody.safeParse(req.body);

     if(!parseddataSuccess.success){
      res.json({
        message : "Invalid Format",
        emailrror : parseddataSuccess.error
      })
      return;
     }

     const email = req.body.email;
     const password = req.body.password;
     const name     = req.body.name;
     try {
      const hashpassword = await bcrypt.hash(password,5)
     console.log(hashpassword);
     await userModel.create({
      email : email,
      password: hashpassword,
      name: name
     })
     } catch (error) {
        res.status(403).json({
          message : 'Email is already used'
        })
        return;
     }
     

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

