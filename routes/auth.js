const express = require('express')
const router = express.Router()

const fetchUser = require('../middleware/fetchuser')
const User = require('../models/User')

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const JWT_SECRET = "hellothisisesignature"

// creating a user using:POST "/api/autj/". Doesn't require Auth
router.post('/create-user', [

    body('email', 'provide a valid email').isEmail(),
    body('firstname', 'provide a valid name').isLength({ min: 4 }),
    body('lastname', 'provide a valid sirname').isLength({ min: 4 }),
    body('password', 'password should contain min of 5 characters').isLength({ min: 5 }),
    body('phone').isLength({ min: 10 }),
    // body('gender').notEmpty(),

], async (req, res) => {
    // if there are errors ,return bad request and the error
    console.log('addanote working..')
    let success=false
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({success, errors: result.array() });
    }

    try {

        // check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "user with this email already exists" })
        }
        // creating a user
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            // gender: req.body.gender,
            password: secPass,
        })
        const data = {
            user: {
                id: user.id
            }

        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success=true
        console.log(authToken)
        res.json({success, authToken }) //as per es 6...no need to add value in the object
        // res.json({ status: "success" })
    } catch (error) {
        console.log('error:', error)
        res.status(500).send('internal server error')
    }

})

// authenticate a user using:POST "/api/autj/login". authenticate a required

router.post('/login', [

    body('email', 'provide a valid email').isEmail(),
    body('password', 'password cannot be blank').exists(),

], async (req, res) => {
    let success=false
    // if there are errors ,return bad request and the error
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({success, error: "please try to login with correct credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success=false
            return res.status(400).json({success, error: "please try to login with correct credentials" })

        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET)
        success=true
        res.json({success, authToken })

    } catch (error) {
        console.log('error:', error)
        res.status(500).send('internal server error')
    }
})

//ROUTE 3:Get loggedin user details using ===> POST "/api/auth/getuser".Login required
router.get('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        console.log(user, 'user fields')
        res.send(user)

    } catch (error) {
        console.log('error:', error)
        res.status(500).send('internal server error')

    }

})




module.exports = router