const express=require('express')
const router=express.Router()

const { body, validationResult } = require('express-validator');

const fetchUser = require('../middleware/fetchuser')
const upload=require('../middleware/multer')

const Note=require('../models/Notes')

const middle=express.urlencoded({extended:false})
const restrict=require('../middleware/restrict')


// route 1: get all notes using get "api/notes/getuser".Login required
router.get('/fetchallnotes',fetchUser,async(req,res)=>{
    try{
        const notes=await Note.find({user:req.user.id})
        console.log('notes:',notes,'user:',req.user.id)
        res.json(notes)

    }catch(error){
        res.status(500).send('internal server error:',error)
    }
    
})
// ,restrict("staff","admin")
// route 2: create a notes using post "api/notes/addnotes".Login required
router.post('/addanote',[middle,upload.any(),fetchUser,restrict.checkRole("staff","admin")],[

    body('title', 'provide a valid title').isLength({min:3}),
    body('description', 'description must be at least 5 characters').isLength({ min: 5 }),
 

],async(req,res)=>{
    const {title,description,tag}=req.body;
    
    const filePath=req.files[0].path
    console.log(filePath,'file in server',req.files)
    // if errors , return bad requests and errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try{

        const note=new Note({title,description,tag,file:filePath,user:req.user.id})
        const saveNote=await note.save()
        res.json(saveNote)
    }catch(error){
        res.status(500).send('internal server error:',error)

    }
  
})
// ,restrict("staff","admin")
// route 3: update a notes using put "api/notes/update".Login required
router.put('/updateanote/:id',[fetchUser],async(req,res)=>{
    const {title,description,tag,file}=req.body;
    // const {file}=req.file
    console.log(file,'file in server update note')

    // create anewnote object//
    const newNote={};
    if(title){
        newNote.title=title
    }if(description){
        newNote.description=description
    }if(tag){
        newNote.tag=tag
    }if(file){
        newNote.file=file
    }
    // find the note to update
    let note=await Note.findById(req.params.id)
    if(!note){
        return res.status(404).send("not found")
    }if(note.user.toString()!==req.user.id){
        return res.status(404).send("not allowed")
    }
    note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note});



})

// route 4: delete a notes using delete "api/notes/update".Login required
router.delete('/deleteanote/:id',fetchUser,async(req,res)=>{
   
    // find the note to delete
    let note=await Note.findById(req.params.id)
    if(!note){
        return res.status(404).send("not found")
    // allow deletion only if user owns this note    
    }if(note.user.toString()!==req.user.id){
        return res.status(401).send("not allowed")
    }
    note=await Note.findByIdAndDelete(req.params.id)
    res.json({note});



})


module.exports=router