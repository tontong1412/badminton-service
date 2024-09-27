var cloudinary = require('cloudinary').v2

const uploadPhoto = (photo, folder, name) => {
  return cloudinary.uploader.upload(photo, {
    folder,
    public_id: name
  }, (error, result) => {
    if (error) throw error
    return result
  })
}

const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id)
    console.log('Delete result:', result);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

export {
  uploadPhoto,
  deleteImage
}
