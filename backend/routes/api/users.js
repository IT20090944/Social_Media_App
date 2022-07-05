const express =require('express');
const { check,validationResult } = require('express-validator');
const router = express.Router();
const User =require ('../../models/User')
const gravatar = require('gravatar')
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken')
const config =require('config')



router.post("/users",[
    check('name',"Please enter your name").not().isEmpty(),
    check('email',"Please enter Valid email").isEmail(),
    check('password',"Please enter at least 6 characters as password").isLength({min:6})

] ,async (req,res)=>{
     const errors= validationResult(req);

     if(!errors.isEmpty()){

        return res.status(400).json({errors: errors.array()})
     }

     //res.status(200).json({message:"Added Successfully"})


      const { name, email, password } = req.body;


    try {
        
         let user = await User.findOne({ email });

         if (user) {
           return res.status(400).json({ errors: [{ message: "user already exists" }] });
           
         }

          const avatar =  gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm"
          });

           user = new User({
             name,
             email,
             avatar,
             password
           });



          const salt = await bcrypt.genSalt(10);

          user.password = await bcrypt.hash(password, salt);

          await user.save();

        //   res.send('user registered')
         const payload = {
            user:{
                id:user.id
            }
         }


         jwt.sign(payload,config.get('jwtSecret'),{
            expiresIn:360000
         },(err,token)=>{
            if(err) throw err;
            res.json({token})
         });

    } catch (error) {

        console.log(error.message)
        return res.status(500).json({msg:" Server error "})
        
    }
   
    }
);



module.exports= router;