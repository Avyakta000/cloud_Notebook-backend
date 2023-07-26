const jwt=require('jsonwebtoken');
const JWT_SECRET="hellothisisesignature"


const fetchUser=(req,res,next)=>{
    // get the user from the jwt toekn and append id to request user
    const token = req.header('auth-token');
    if (!token){
        res.status(401).send({error:"authenticate using a valid token"})
    }
    try{
        
        const data=jwt.verify(token,JWT_SECRET)
        req.user=data.user;
        console.log('fetch user workin....')
        next()
    }
    catch(error){
        
        res.status(401).send({error:"authenticate using a valid token"})
    }

}
module.exports=fetchUser;