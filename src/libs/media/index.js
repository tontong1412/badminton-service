var cloudinary = require('cloudinary').v2

const uploadPhoto = (photo, folder, name) => {
  return cloudinary.uploader.upload(photo, {
    folder,
    public_id: name
  }, (error, result) => {
    console.log(result, error)
    if (error) throw error
    return result
  })

}

export {
  uploadPhoto
}
