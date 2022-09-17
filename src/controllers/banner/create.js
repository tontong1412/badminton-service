import banner from '../../schema/banner'

const BannerModel = banner.model

const createBanner = async (req, res) => {
  const { body } = req
  const bannerObject = new BannerModel({
    ...body,
  })
  let saveResponse
  try {
    saveResponse = await bannerObject.save()
  } catch (error) {
    console.error('Error: Failed to create banner')
    throw error
  }

  return res.send(saveResponse.toObject())
}

export default createBanner
