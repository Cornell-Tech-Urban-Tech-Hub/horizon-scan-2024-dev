import * as d3 from "d3"

export function summarizeNodeTaxonomy(nodes, array) {
  let items = nodes
    .map(node => {
      if (node[array] !== null || node[array] !== undefined) {
        return node[array]
      }
    })
    .flat()
    .filter(node => node !== undefined && node !== null)
    // .filter(element => element !== undefined)
    .reduce((acc, tag) => {
      // check if existing topping
      const existingTag = acc[tag]
      if (existingTag) {
        existingTag.count += 1 // if yes increment by one
      } else {
        acc[tag] = {
          //id: topping.id,
          value: tag,
          label: tag,
          count: 1,
        }
      }
      // otherwise create a new entry and set to 1
      return acc
    }, {})

  let itemsSorted = Object.values(items)
    .sort((a, b) => d3.ascending(a.label.toLowerCase(), b.label.toLowerCase()))
    .sort((a, b) => d3.descending(a.count, b.count))

  //.sort((a, b) => b.count - a.count)

  return itemsSorted
}
