import tournament from '../../schema/tournament'

const TournamentModel = tournament.model

const getByIDTournament = async (req, res) => {
  const { id } = req.params

  let getByIDResponse
  try {
    getByIDResponse = await TournamentModel.findById(id)
    await getByIDResponse.populate({
      path: 'events events.teams events.order managers',
      populate: {
        path: `players teams.team teams.contact`,
        populate: {
          path: 'players group.team',
          populate: {
            path: 'players'
          }
        }
      }
    }).execPopulate()
    let populateGroup = []
    const populateEvent = await Promise.all(getByIDResponse.events.map(async (event, i) => {
      populateGroup = await Promise.all(event.order.group.map((group, j) => `order.group.${j}`))
      return `events.${i}`
    }))

    await getByIDResponse.populate({
      path: ` events events.teams ${populateEvent.join(' ')}`,
      populate: {
        path: `team players teams.contact teams.team ${populateGroup.join(' ')}`,
        populate: {
          path: 'team players'
        }
      }
    }).execPopulate()
  } catch (error) {
    console.error('Error: Get by ID tournament had failed')
    throw error
  }

  if (getByIDResponse) {
    return res.send(getByIDResponse)
  }

  return res.status(404).send('tournament not found')
}

export default getByIDTournament
