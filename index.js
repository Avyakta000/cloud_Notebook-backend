const connectMongo=require('./db');

const express=require('express')
const cors=require('cors')


connectMongo();  
const app=express()
const port=5000



app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
// Available routes
app.use('/api/auth',require('./routes/auth.js'))
app.use('/api/notes',require('./routes/notes.js'))


app.use('/api/auth',require('./routes/user.js'))
app.use('/api/user',require('./routes/getAllNotes.js'))


// app.get("/",(req,res)=>{
//     res.send('backend-home')

// })

app.listen(port,()=>{
    console.log(`app listening at port http://localhost:${port}`)
})

