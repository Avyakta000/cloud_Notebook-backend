const multer=require('multer')
const path=require('path')
// multer
// upload is a middleware 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('multer diddleware working to set up destination...')
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        console.log('multer diddleware working to name the file...')
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-'+path.extname(file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
const upload = multer({ 
    storage:storage,
    limits:{fileSize:1000000*100}
 })


module.exports=upload