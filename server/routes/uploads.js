const express = require('express')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
require('dotenv').config()

const router = express.Router()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

// POST /api/uploads - upload an image and return secure URL
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    const bufferStream = streamifier.createReadStream(req.file.buffer)

    const uploadResult = await new Promise((resolve, reject) => {
      const cld_upload_stream = cloudinary.uploader.upload_stream(
        { folder: 'mern-blog' },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )
      bufferStream.pipe(cld_upload_stream)
    })

    return res.json({ success: true, url: uploadResult.secure_url, raw: uploadResult })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ success: false, message: 'Upload failed', error: error.message })
  }
})

module.exports = router
