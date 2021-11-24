const cloudinary = require('cloudinary').v2
const config = require('../config/config')
const connection = require('../database.js')

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  cloudinaryurl: config.cloudinaryUrl,
  upload_preset: 'upload',
})

// module.exports.uploadFile = async (file, callback) => {
//   cloudinary.uploader
//     .upload(file, cloudinary.config().upload_preset, callback)
//     .then((result) => {
//       //let data = { imageURL: result.url, publicId: result.public_id, status: 'success' };
//       callback(result, null)
//     })
//     .catch((error) => {
//       console.log(error)
//       callback(null, error)
//     })
// }

module.exports.uploadFile = (file, callback) => {
  console.log(file)
  console.log('hello')
  // console.log(file.originalname)
  // upload image here
  cloudinary.uploader
    .upload(file.tempFilePath, { upload_preset: 'upload' })
    .then((result) => {
      //Inspect whether I can obtain the file storage id and the url from cloudinary
      //after a successful upload.
      //console.log({imageURL: result.url, publicId: result.public_id});
      let data = {
        imageURL: result.url,
        status: 'success',
      }
      callback(null, data)
      console.log('success')
      return
    })
    .catch((error) => {
      let message = 'fail'
      console.log('error')
      console.log(error)
      callback(error, null)
      return
    })
} //End of uploadFile

module.exports.insertImage = async (
  type,
  title,
  body,
  author_id,
  subreddit_id,
  cloudinary_url,
  callback
) => {
  const insertPostQuery = `INSERT INTO posts (type, title, body, author_id, subreddit_id, created_at, updated_at, cloudinary_url) VALUES ($1, $2, $3, $4, $5, NOW() at time zone 'SGT', NOW() at time zone 'SGT', $6) RETURNING id;`
  connection
    .query(insertPostQuery, [
      type,
      title,
      body,
      author_id,
      subreddit_id,
      cloudinary_url,
    ])
    .then((returnid) => {
      callback(returnid, null)
    })
    .catch((err) => {
      console.log(err)
      callback(null, err)
    })
}
