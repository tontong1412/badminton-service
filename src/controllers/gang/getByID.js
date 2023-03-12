import gang from '../../schema/gang'

const GangModel = gang.model

const getByIDGang = async (req, res) => {
  const { id } = req.params

  let getByIDResponse
  try {
    getByIDResponse = await GangModel.findById(id)
      .populate({
        path: 'creator players managers queue',
        select: 'displayName officialName teamA teamB shuttlecockUsed status scoreLabel',
        populate: {
          path: 'teamA.team teamB.team',
          strictPopulate: false,
          populate: {
            path: 'players',
            select: 'officialName displayName photo'
          }
        }
      })
  } catch (error) {
    console.error('Error: Get by ID gang had failed')
    throw error
  }

  if (getByIDResponse) {
    return res.send(getByIDResponse)
  }

  return res.status(404).send('gang not found')
}

export default getByIDGang
