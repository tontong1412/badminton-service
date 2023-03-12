import tournament from '../../schema/tournament'

const TournamentModel = tournament.model

const getByIDTournament = async (req, res) => {
  const { id } = req.params
  try {
    const getByIDResponse = await TournamentModel.findById(id).populate({
      path: 'events managers umpires',
      select: 'name order format fee type teams description prize limit officialName displayName lineID tel club photo players',
      populate: {
        path: 'teams.contact teams.team',
        select: 'officialName displayName lineID tel club photo players',
        strictPopulate: false,
        populate: {
          path: 'players',
          strictPopulate: false,
          select: 'officialName displayName birthDate gender club photo'
        }
      }
    })

    if (getByIDResponse) {
      return res.send(getByIDResponse)
    }

    return res.status(404).send('Tournament not found')

  } catch (error) {
    console.error('Error: Get by ID tournament had failed')
    throw error
  }
}

export default getByIDTournament
