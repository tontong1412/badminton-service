import { randomNoDup } from "./utils"

const group = (playerList, groupCount) => {
  const playerCount = playerList.length
  const playerPerGroup = Math.floor(playerCount / groupCount)
  const extraPlayer = playerCount % groupCount
  const chosen = []
  const order = []
  for (let i = 0; i < groupCount; i++) {
    order[i] = []
    for (let j = 0; j < playerPerGroup; j++) {
      const chosenIndex = randomNoDup(playerCount, chosen)
      order[i].push(playerList[chosenIndex].team)
      // order[i].push(chosenIndex)
      chosen.push(chosenIndex)
    }
  }
  for (let i = 0; i < extraPlayer; i++) {
    const group = i % groupCount
    const chosenIndex = randomNoDup(playerCount, chosen)
    order[group].push(playerList[chosenIndex].team)
    // order[group].push(chosenIndex)
    chosen.push(chosenIndex)
  }
  return order
}
export default group
