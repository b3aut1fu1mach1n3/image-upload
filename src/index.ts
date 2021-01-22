import express from 'express'
import AWS, { S3 } from 'aws-sdk'
import multer from 'multer'
import multers3 from 'multer-s3'

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 8080;

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const uploadS3 = multer({
    storage: multers3({
      s3: s3,
      acl: 'public-read',
      bucket: 'kw-image-uploader',
      metadata: (req, file, cb) => {
        cb(null, {fieldName: file.fieldname})
      },
      key: (req, file, cb) => {
        cb(null, Date.now().toString() + '-' + file.originalname)
      }
    })
  });

  app.post('/upload', uploadS3.single('file'),(req, res) => {
    res.json(req.file);
  });

app.listen(PORT, () => {
    console.log(`\n⚡ server is running on port:${PORT} ⚡️\n`);
});


