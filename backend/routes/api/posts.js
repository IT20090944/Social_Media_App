const express= require('express');
const router = express.Router();


router.get("/posts",(req,res)=>res.send("This is posts page"));


module.exports= router;


