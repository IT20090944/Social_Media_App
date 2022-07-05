const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req,res,next){


    const token = req.header('X-auth-token');



    if(!token) {

        return res.status(401).json({msg:"Unauthorised! Access denied."})
    }


    try {
         const decoded =jwt.verify(token,config.get('jwtSecret'))
          req.user = decoded.user;
          next();

}
    catch (error) {

        res.status(401).json({msg:"Token not valid"})
        
       
        
    }

}

