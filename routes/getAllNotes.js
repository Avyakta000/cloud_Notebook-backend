const express = require('express')
const router = express.Router()
const Note = require('../models/Notes')


// route 1: get all notes using get"
router.get('/get-all-notes', async (req, res) => {
    try {
        const notes = await Note.find()
        console.log('all notes:', notes,)
        res.json(notes)

    } catch (error) {
        res.status(500).send('internal server error:', error)
    }

})


// route 2: get all notes using get"
router.get('/:key', async (req, res) => {
    try {
        const key = req.params.key
        console.log(key,'this is key',typeof(key))
        const notes = await Note.find({

            "$or": [
                { "title": { $regex:key} },
                { "description": { $regex:key } },
            ]
            
        })
        console.log('all search results:', notes,)
        res.json(notes)

    } catch (error) {
        // res.status(500).send('internal server error:', error)
        console.log(error,'errrorr')
    }

})

module.exports = router