import gang from '../../schema/gang'

const GangModel = gang.model

const getMyGang = async (req, res) => {
  const { payload } = req
  console.info(`[GET] get my-gang ${payload.playerID}`)
  let searchOptions = {}
  if (payload?.playerID) {
    searchOptions = {
      ...searchOptions,
      $or: [
        { 'creator': payload.playerID },
        { 'managers': payload.playerID },
        { 'members': payload.playerID },
        { 'players': payload.playerID },
      ],
    }
  } else {
    return res.status(401).send()
  }
  let getAllResponse
  try {
    getAllResponse = await GangModel.find(searchOptions)
  } catch (error) {
    console.error('Error: Failed to get all gang')
    throw error
  }

  return res.send(getAllResponse)
}

export default getMyGang
