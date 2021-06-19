import { randomNoDup } from './utils'

const shuffle = (array) => {
  var currentIndex = array.length, randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

const findByeOrder = (round, byeCount) => {
  const section = Math.ceil(Math.log2(byeCount))
  const order = []
  const checkCountandPush = (selectedOrder) => {
    if (byeCount > 0) {
      order.push(selectedOrder)
      byeCount--
    }
  }
  if (section == 0) {
    checkCountandPush(1)
    checkCountandPush(round - 2)
  }
  for (let i = 0; i < section; i++) {
    if (i == 0) {
      checkCountandPush(i + 1)
      checkCountandPush(round - 2)
    } else {
      for (let j = 0; j < Math.pow(2, i - 1); j++) {
        const newBottom = (2 * j + 1) * round / Math.pow(2, i)
        checkCountandPush(newBottom - 1)
      }
      for (let j = 0; j < Math.pow(2, i - 1); j++) {
        const newBottom = (2 * j + 1) * round / Math.pow(2, i)
        checkCountandPush(newBottom + 1)
      }
    }
  }
  order.sort((a, b) => a - b)
  return order
}

const findSeededOrder = (round, seededCount) => {
  if (Math.log2(seededCount) % 1 != 0) throw 'number should be in the form of 2^n'
  const section = Math.ceil(Math.log2(seededCount))
  let order = []
  for (let i = 0; i < section; i++) {
    let tempOrder = []
    if (i == 0) { // 1st and 2nd seed
      tempOrder.push(0)
      tempOrder.push(round - 1)
    } else {
      for (let j = 0; j < Math.pow(2, i - 1); j++) {
        const newBottom = (2 * j + 1) * round / Math.pow(2, i)
        tempOrder.push(newBottom - 1)
      }
      for (let j = 0; j < Math.pow(2, i - 1); j++) {
        const newBottom = (2 * j + 1) * round / Math.pow(2, i)
        tempOrder.push(newBottom)
      }
      tempOrder = shuffle(tempOrder)
    }
    order = [...order, ...tempOrder]
  }
  return order
}

const knockOut = (playerList, { seededCount = 2, seeded } = {}) => {
  const playersCount = playerList.length
  const round = Math.pow(2, Math.ceil(Math.log2(playersCount)))
  const order = Array.from(Array(round))
  const byeOrder = findByeOrder(round, round - playersCount)
  const chosenIndex = []
  byeOrder.forEach(index => {
    order[index] = 'bye'
    chosenIndex.push(index)
  })
  if (seeded) {
    const seededOrder = findSeededOrder(round, seededCount)
    seededOrder.forEach((index, i) => {
      // playerList is sorted by seed
      // order[index] = i
      order[index] = playerList[i]
      chosenIndex.push(index)
    })
    playerList.splice(0, seededCount)
  }
  playerList.forEach((player, i) => {
    const random = randomNoDup(round, chosenIndex)
    order[random] = player
    chosenIndex.push(random)
  })
  return order
}

export default knockOut