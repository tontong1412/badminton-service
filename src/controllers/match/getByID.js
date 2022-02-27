import match from '../../schema/match'

const MatchModel = match.model

const getByIDmatch = async (req, res) => {
  const { id } = req.params

  let getByIDResponse
  try {
    getByIDResponse = await MatchModel.findById(id)
      .populate({
        path: 'teamA.team teamB.team umpire',
        populate: {
          path: 'players'
        }
      })
  } catch (error) {
    console.error('Error: Failed to get match by id')
    throw error
  }

  if (getByIDResponse) {
    return res.send(getByIDResponse)
  }

  return res.status(404).send('match not found')
}

export default getByIDmatch
