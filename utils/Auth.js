const User = require('../models/User')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken');
const JWT_SECRET = "hellothisisesignature"


// @desc to register the User,admin//
const userRegister = async (userDets, role, res) => {
    // validate the user
  
    try {
        let success = false
        
        // check whether the user with this email exists already
        let userEmail = await validateUser(userDets.email)
        if (userEmail) {
            return res.status(400).json({
                message: "Email is already resgistered",
                success: false
            })
        }
        // creating a user
    
        const salt = await bcrypt.genSalt(10);
      
        const secPass = await bcrypt.hash(userDets.password,salt)
     
        let user = await User.create({
            ...userDets,
            password: secPass,
            role
        })
     
        const data = {
            user: {
                id: user.id
            }
            
        }
      
        const authToken = jwt.sign(data, JWT_SECRET)
       
        success = true
   
        console.log(authToken)
      
        res.json({ success, authToken }) //as per es 6...no need to add value in the object
        // res.json({ status: "success" })
    } catch (error) {
        console.log('error:', error)
        res.status(500).send('internal server error')
    }

}

const userLogin=async(userDets,role,res)=>{

    const { email, password } = userDets

    try {
        let success = false
        // check email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({success, error: "please try to login with correct credentials" })
        }
        // check role
        if(user.role!==role){
            return res.status(403).json({success, error: "ensure that login from the right portal" })   
        }
        // check password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success=false
            return res.status(400).json({success, error: "please try to login with correct credentials" })
        }
        const data = {
            user: {
                id: user.id,
                role:user.role
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET)
        success=true
        res.json({success, authToken })

    } catch (error) {
        console.log('error:', error)
        res.status(500).send('internal server error')
    }
}



const validateUser = async email => {
    let user = await User.findOne({ email });
    console.log(user,"user")
    return user ? true : false
}

module.exports={
        userRegister,
        userLogin
}
