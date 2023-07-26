const jwt = require('jsonwebtoken');
const JWT_SECRET = "hellothisisesignature"


exports.checkRole = (...role) => {

    return (req, res, next) => {
        // const token=req.header('auth-token')
        const token = req.header('auth-token')
        const data = jwt.verify(token, JWT_SECRET)
        console.log('verifiyinhh token', data,data.user.role,role)
        if (!role.includes(data.user.role)) {

            console.log('ERROR RESTRICTION')
            // const error = new customError("you do not have the permission to do that")
            // next(error)
            return res.status(400).json({error:"you do not have the permission to do that"})
        }
        console.log('ERROR RESTRICTION checking....')
        next()
    }

}