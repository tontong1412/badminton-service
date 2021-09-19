import gang from '../../schema/gang'

const GangModel = gang.model

const getByIDGang = async (req, res) => {
  const { id } = req.params

  let getByIDResponse
  try {
    getByIDResponse = await GangModel.findById(id)
      .populate({
        path: 'creator players queue',
        select: ['playerID', 'displayName', 'officialName', 'shuttlecockUsed', 'status'],
        populate: {
          path: 'playerID teamA.team teamB.team',
          populate: {
            path: 'players'
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
