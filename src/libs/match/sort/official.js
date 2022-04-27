const officialSort = (arrangedMatches) => {
  const sortedArrangedMatches = arrangedMatches.reduce((prev, curr) => {
    return [...prev, ...curr]
  }, [])

  sortedArrangedMatches.sort((a, b) => {
    if (a.step === 'group') return -1
    if (b.step === 'group') return 1
    return a.step === 'knockOut' ? 1 : -1
  })

  // sort match round robin
  sortedArrangedMatches.sort((a, b) => {
    if (a.step === 'group' || b.step === 'group') {
      if (a.step === b.step) {
        if (a.round === b.round) {
          if (a.eventOrder === b.eventOrder) {
            return a.groupOrder - b.groupOrder
          }
          return a.eventOrder - b.eventOrder
        }
        return a.round - b.round
      }
      return a.step === 'group' ? -1 : 1
    }

    if (a.round === b.round) {
      if (a.eventOrder === b.eventOrder) {
        if (a.groupOrder === b.groupOrder) {
          return a.step === 'knockOut' ? 1 : -1
        }
        return a.groupOrder - b.groupOrder
      }
      return a.eventOrder > b.eventOrder ? 1 : -1

    }
    return a.round < b.round ? 1 : -1
  })

  return sortedArrangedMatches
}
export default officialSort