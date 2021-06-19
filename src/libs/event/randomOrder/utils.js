const randomNoDup = (range, chosen) => {
  let randomNum = Math.floor(Math.random() * range)
  while (chosen.includes(randomNum)) {
      randomNum = Math.floor(Math.random() * range)
  }
  return randomNum
}

export { randomNoDup }