import banner from '../../schema/banner'

const bannerModel = banner.model

const getAllBanner = async (req, res) => {
  let getAllResponse
  try {
    getAllResponse = await bannerModel.find({ isActive: true })
  } catch (error) {
    console.error('Error: Failed to get all banner')
    throw error
  }

  return res.send(getAllResponse)
}

export default getAllBanner
