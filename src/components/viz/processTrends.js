export default function getTrends(trends) {
  let nodes = []
  let links = []
  let sectorSet = []

  trends.nodes.map(d => {
    let certainty = d.data.Certainty
    let impact = d.data.Impact
    let steep = d.data.STEEP
    let timeframe = d.data.Time_Frame
    let driver = d.data.Research_Driver
    let sectors = d.data.Signals !== null ? sectorCounts(d.data.Signals) : null
    let sectorsArray = sectors !== null ? sectors.map(d => d.name) : []

    if (sectors !== null) {
      sectorSet.push(sectors)
    }

    nodes.push({
      type: "trend",
      name: d.data.Name,
      id: d.recordId,
      radius: 12,
      certainty,
      impact,
      steep,
      timeframe,
      driver,
      sectors,
      sectorsArray,
    })
  })

  sectorSet = sectorSet
    .flat()
    .filter(d => d.name !== null)
    .reduce((acc, sec) => {
      // check if existing topping
      const existingSector = acc[sec.name]
      if (existingSector) {
        existingSector.count += sec.count // if yes increment by one
      } else {
        acc[sec.name] = {
          name: sec.name,
          count: sec.count,
        }
      }
      // otherwise create a new entry and set to 1
      return acc
    }, {})

  // sectorArray= Object.keys(sectorSet).map(key => ({
  //   name: key.name,
  //   count: key.count,
  // }))
  let sectorKeys = Object.keys(sectorSet)

  let dataset = {}
  dataset.nodes = nodes
  dataset.links = links
  dataset.sectorSet = sectorSet
  dataset.sectorKeys = sectorKeys

  return dataset
}

function sectorCounts(signals) {
  const items = signals
    .map(signal => {
      return signal.data.Sector
    })
    .flat()
    .reduce((acc, sec) => {
      // check if existing topping
      const existingSector = acc[sec]
      if (existingSector) {
        existingSector.count += 1 // if yes increment by one
      } else {
        acc[sec] = {
          name: sec,
          count: 1,
        }
      }
      // otherwise create a new entry and set to 1
      return acc
    }, {})
  const itemsSorted = Object.values(items).sort((a, b) => b.count - a.count)
  //console.log({ itemsSorted })
  return itemsSorted
}
