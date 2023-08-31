const jwt = require('jsonwebtoken')
const verify = (req,res,next)=>{
    try{
        const jwtToken = req.headers['auth-token'];
        if(!jwtToken) return res.status(404).json({error : "Provide Auth-Token in headers"});
        const verifiedToken = jwt.verify(jwtToken,process.env.JWT_KEY);
        // if fails falls into error
        req.username = verifiedToken.username;
        req.userId = verifiedToken.userId;
        next();
    }
    catch(err){
        console.log(err);
        res.status(404).json({error : "Invalid Token"});
    }
}

module.exports = verify;