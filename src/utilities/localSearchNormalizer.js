const { slugFormat } = require("./slugFormat")

const localSearchNormalizer = data => {
  let items = []
  data.forecasts.nodes.forEach(node => {
    items.push({
      id: node.recordId,
      type: "Forecast",
      path: `/forecasts/${slugFormat(node.data.Name)}`,
      title: node.data.Name,
      summary: node.data.Summary,
      description: node.data.Description.rawMarkdownBody,
    })
  })
  data.trends.nodes.forEach(node => {
    items.push({
      id: node.recordId,
      type: "Trend",
      path: `/trends/${slugFormat(node.data.Name)}`,
      title: node.data.Name,
      summary: node.data.Summary,
      description: node.data.Description.rawMarkdownBody,
    })
  })
  data.signals.nodes.forEach(node => {
    items.push({
      id: node.recordId,
      path: `/signals/${slugFormat(node.data.Name)}`,
      type: "Signal",
      title: node.data.Name,
      description: node.data.Description.rawMarkdownBody,
      sectors: node.data.Sector !== null ? node.data.Sector.join(" ") : "",
      tags: node.data.Tags !== null ? node.data.Tags.join(" ") : "",
    })
  })
  return items
}

module.exports = { localSearchNormalizer }
