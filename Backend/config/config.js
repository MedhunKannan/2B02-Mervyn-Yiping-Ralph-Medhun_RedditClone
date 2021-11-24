const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  secret: process.env.JWT_SECRET,
  port: process.env.PORT,
  cloudinaryUrl: process.env.CLOUDINARY_URL,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
}
