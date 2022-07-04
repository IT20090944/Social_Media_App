const express = require('express');
const DBconnect = require('./config/db');
const postroute =require('./routes/api/posts');
const authroute = require("./routes/api/auth");
const userroute =require('./routes/api/users')


const App =express();

const PORT =process.env.PORT || 5000;

App.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));

App.use(express.json({extended:false}));


App.use("/api",postroute);
App.use("/api", authroute);
App.use("/api",userroute)

DBconnect();
