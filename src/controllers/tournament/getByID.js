import tournament from '../../schema/tournament'

const TournamentModel = tournament.model

const getByIDTournament = async (req, res) => {
  const { id } = req.params
  let getByIDResponse
  try {
    getByIDResponse = await TournamentModel.findById(id)
    await getByIDResponse.populate({
      path: 'events creator managers umpires',
      select: 'name format officialName displayName lineID tel club photo players teams',
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

    // for populate order ===> not use due to slow performance

    // let populateGroup = []
    // const populateEvent = await Promise.all(getByIDResponse.events.map(async (event, i) => {
    //   event.order?.group?.forEach((group, j) => populateGroup.push(`order.group.${j}`))
    //   return `events.${i}`
    // }))
    // await getByIDResponse.populate({
    //   path: `${populateEvent?.join(' ')}`,
    //   populate: {
    //     path: `${populateGroup?.join(' ')} order.singleElim`,
    //     options: { retainNullValues: true },
    //     populate: {
    //       path: 'team players',
    //       options: { retainNullValues: true }

    //     }
    //   }
    // }).execPopulate()

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
