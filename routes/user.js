const express=require('express')
const app= express()
const fetchUser = require('../middleware/fetchuser')

const { userRegister,userLogin } = require('../utils/Auth')
app.use(express.json())

const router = express.Router()

// const express = require('express')

const { body, validationResult } = require('express-validator');

// user register//
router.post('/create-class-b', [

    body('email', 'provide a valid email').isEmail(),
    body('firstname', 'provide a valid name').isLength({ min: 4 }),
    body('lastname', 'provide a valid sirname').isLength({ min: 4 }),
    body('password', 'password should contain min of 5 characters').isLength({ min: 5 }),
    body('phone').isLength({ min: 10 }),

    // body('gender').notEmpty(),

], async (req, res) => {

    // if there are errors ,return bad request and the error
    let success = false
 
    const result = validationResult(req);
   
    
    if (!result.isEmpty()) {
        return res.status(400).json({ success, errors: result.array() });
    }
    
  
    await userRegister(req.body, "staff", res)


})



// user login//
router.post("/login-class-b",[

    body('email', 'provide a valid email').isEmail(),
    body('password', 'password cannot be blank').exists(),

], async(req, res) => {
    try{

        let success=false
        // if there are errors ,return bad request and the error
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        
        await userLogin(req.body,"staff",res)
    }catch(error){
        console.log('error:',error)
        res.status(500).send("something went wrong")
    }


})



// admin register//

// router.post('/create-admin', [

//     body('email', 'provide a valid email').isEmail(),
//     body('firstname', 'provide a valid name').isLength({ min: 4 }),
//     body('lastname', 'provide a valid sirname').isLength({ min: 4 }),
//     body('password', 'password should contain min of 5 characters').isLength({ min: 5 }),
//     body('phone').isLength({ min: 10 }),

// ], async (req, res) => {

//     // if there are errors ,return bad request and the error
//     let success = false
//     const result = validationResult(req);

//     if (!result.isEmpty()) {
//         return res.status(400).json({ success, errors: result.array() });
//     }

//     await userRegister(req.body, "admin", res)


// })



// admin login//


    router.post('/login-admin', [

        body('email', 'provide a valid email').isEmail(),
        body('password', 'password cannot be blank').exists(),
    
    ], async (req, res) => {
        let success=false
        // if there are errors ,return bad request and the error
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
       
    })
    



module.exports=router
