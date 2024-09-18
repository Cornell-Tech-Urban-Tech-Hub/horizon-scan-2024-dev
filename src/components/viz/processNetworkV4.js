import forecastClass from "../../utilities/forecastClass";
import { summarizeNodeTaxonomy } from "./dataUtilities";
import * as d3 from "d3";
const devMode = true;

export function processNetwork3(data, type) {
  let nodes = [];
  let links = [];
  let sectorSet = [];
  let lookup = new Map();

  // Process Forcasts
  data.forecasts.nodes.forEach((d) => {
    lookup.set(d.recordId, d);
    nodes.push({
      type: "forecast",
      id: d.recordId,
      name: d.data.Name,
      summary: d.data.Summary,
      radius: 18,
      forecastClass: forecastClass[d.data.Name]?.class,
    });

    if (d.data.Trends) {
      d.data.Trends.forEach((f) => {
        links.push({
          type: "forecast-trend",
          source: d.recordId,
          target: f.recordId,
        });
      });
    }
  });

  // Process Trends
  data.trends.nodes.forEach((d) => {
    let certainty = d.data.Certainty;
    let impact = d.data.Impact;
    let steep = d.data.STEEP;
    let timeframe = d.data.Time_Frame;
    let driver = d.data.Research_Driver;
    let sectors = d.data.Signals !== null ? sectorCounts(d.data.Signals) : null;
    let sectorsArray = sectors !== null ? sectors.map((d) => d.name) : [];
    let tags = d.data.Signals !== null ? tagCounts(d.data.Signals) : null;
    let tagsArray = tags !== null ? tags.map((d) => d.name) : [];

    lookup.set(d.recordId, d);

    if (sectors !== null) {
      sectorSet.push(sectors);
    }

    nodes.push({
      type: "trend",
      id: d.recordId,
      name: d.data.Name,
      summary: d.data.Summary,
      radius: 12,
      certainty,
      impact,
      steep,
      timeframe,
      driver,
      sectors,
      sectorsArray,
      tags,
      tagsArray,
    });

    if (d.data.Signals) {
      d.data.Signals.forEach((f) => {
        if (f.data.Visibility === "Published" || devMode) {
          links.push({
            type: "trend-signal",
            source: d.recordId,
            target: f.recordId,
          });
        }
      });
    }
  });

  data.signals.nodes.forEach((d) => {
    lookup.set(d.recordId, d);
    nodes.push({
      type: "signal",
      id: d.recordId,
      name: d.data.Name,
      radius: 6,
      sectorsArray: d.data.Sector,
      tagsArray: d.data.Tags,
      // complete: d.data.Name,
    });
  });

  sectorSet = sectorSet
    .flat()
    .filter((d) => d.name !== null)
    .reduce((acc, sec) => {
      // check if existing topping
      const existingSector = acc[sec.name];
      if (existingSector) {
        existingSector.count += sec.count; // if yes increment by one
      } else {
        acc[sec.name] = {
          name: sec.name,
          count: sec.count,
        };
      }
      // otherwise create a new entry and set to 1
      return acc;
    }, {});

  let sectorKeys = Object.keys(sectorSet);

  let dataset = {};
  dataset.nodes = nodes;
  dataset.links = links;
  dataset.sectorSet = sectorSet;
  dataset.sectorKeys = sectorKeys;
  dataset.lookup = lookup;

  return dataset;
}

export function processForecastNetwork(forecast) {
  // console.log("forecastNewtork")
  let nodes = [];
  let links = [];

  let nodeIds = [];

  // console.log(forecast)

  nodes.push({
    type: "forecast",
    id: forecast.recordId,
    name: forecast.data.Name,
    forecastClass: forecastClass[forecast.data.Name]?.class,
    summary: forecast.data.Summary,
    radius: 18,
  });

  if (forecast.data.Trends) {
    forecast.data.Trends.forEach((d) => {
      let sectors =
        d.data.Signals !== null ? sectorCounts(d.data.Signals) : null;
      let sectorsArray = sectors !== null ? sectors.map((d) => d.name) : [];
      let tags = d.data.Signals !== null ? tagCounts(d.data.Signals) : null;
      let tagsArray = tags !== null ? tags.map((d) => d.name) : [];
      if (!nodeIds.includes(d.recordId)) {
        nodes.push({
          type: "trend",
          id: d.recordId,
          name: d.data.Name,
          summary: d.data.Summary,
          radius: 12,
          sectors,
          sectorsArray,
          tags,
          tagsArray,
        });
        nodeIds.push(d.recordId);
      }
      links.push({
        type: "forecast-trend",
        source: forecast.recordId,
        target: d.recordId,
      });
      if (d.data.Signals) {
        d.data.Signals.forEach((f) => {
          if (!nodeIds.includes(f.recordId)) {
            nodes.push({
              type: "signal",
              id: f.recordId,
              name: f.data.Name,
              radius: 6,
              sectorsArray: f.data.Sector,
              tagsArray: f.data.Tags,
            });
            nodeIds.push(f.recordId);
          }
          links.push({
            type: "trend-signal",
            source: d.recordId,
            target: f.recordId,
          });
        });
      }
    });
  }

  let dataset = {};
  dataset.nodes = nodes;
  dataset.links = links;

  dataset.counts = {};
  dataset.counts.trends = nodes.filter((d) => d.type === "trend").length;
  dataset.counts.signals = nodes.filter((d) => d.type === "signal").length;

  // console.log("counts")
  // console.log(dataset.counts)

  return dataset;
}

export function processTrendNetwork(d) {
  // console.log("forecastNewtork")
  let nodes = [];
  let links = [];

  // console.log(forecast)
  let sectors = d.data.Signals !== null ? sectorCounts(d.data.Signals) : null;
  let sectorsArray = sectors !== null ? sectors.map((d) => d.name) : [];
  let tags = d.data.Signals !== null ? tagCounts(d.data.Signals) : null;
  let tagsArray = tags !== null ? tags.map((d) => d.name) : [];
  nodes.push({
    type: "trend",
    id: d.recordId,
    name: d.data.Name,
    summary: d.data.Summary,
    radius: 12,
    sectors,
    sectorsArray,
    tags,
    tagsArray,
  });
  if (d.data.Signals) {
    d.data.Signals.map((f) => {
      nodes.push({
        type: "signal",
        id: f.recordId,
        name: f.data.Name,
        radius: 6,
        sectorsArray: f.data.Sector,
        tagsArray: f.data.Tags,
      });
      links.push({
        type: "trend-signal",
        source: d.recordId,
        target: f.recordId,
      });
    });
  }

  let dataset = {};
  dataset.nodes = nodes;
  dataset.links = links;

  dataset.counts = {};
  dataset.counts.trends = nodes.filter((d) => d.type === "trend").length;
  dataset.counts.signals = nodes.filter((d) => d.type === "signal").length;

  // console.log("counts")
  // console.log(dataset.counts)

  return dataset;
}

export function processFullNetwork(data) {
  // console.log("forecastNewtork")
  let nodes = [];
  let links = [];

  let nodeIds = [];

  // console.log(forecast)

  data.forEach((forecast) => {
    let forecastNodes = [];
    // let forecastLinks = []

    if (forecast.data.Trends) {
      forecast.data.Trends.forEach((d) => {
        if (d.data.Visibility === "Published" || devMode) {
          let sectors =
            d.data.Signals !== null ? sectorCounts(d.data.Signals) : null;
          let sectorsArray = sectors !== null ? sectors.map((d) => d.name) : [];
          let tags = d.data.Signals !== null ? tagCounts(d.data.Signals) : null;
          let tagsArray = tags !== null ? tags.map((d) => d.name) : [];

          let node = {
            type: "trend",
            id: d.recordId,
            name: d.data.Name,
            summary: d.data.Summary,
            radius: 12,
            certainty: d.data.Certainty,
            impact: d.data.Impact,
            steep: d.data.STEEP,
            timeframe: d.data.Time_Frame,
            driver: d.data.Research_Driver,
            sectors,
            sectorsArray,
            tags,
            tagsArray,
          };
          forecastNodes.push({ node });
          if (!nodeIds.includes(d.recordId)) {
            nodes.push(node);
            nodeIds.push(d.recordId);
          }
          links.push({
            type: "forecast-trend",
            source: forecast.recordId,
            target: d.recordId,
          });
          if (d.data.Signals) {
            d.data.Signals.forEach((f) => {
              if (f.data.Visibility === "Published" || devMode) {
                // f.data.Sector
                // f.data.Tags

                let node = {
                  type: "signal",
                  id: f.recordId,
                  name: f.data.Name,
                  radius: 6,
                  sectorsArray: f.data.Sector,
                  tagsArray: f.data.Tags,
                };
                if (!nodeIds.includes(f.recordId)) {
                  nodes.push(node);
                  nodeIds.push(f.recordId);
                }
                forecastNodes.push(node);
                links.push({
                  type: "trend-signal",
                  source: d.recordId,
                  target: f.recordId,
                });
              }
            });
          }
        }
      });
    }

    // let tags = summarizeNodeTaxonomy(forecastNodes, "tagsArray")
    // let sectors = summarizeNodeTaxonomy(forecastNodes, "sectorsArray")

    nodes.push({
      type: "forecast",
      id: forecast.recordId,
      name: forecast.data.Name,
      summary: forecast.data.Summary,
      radius: 18,
      nodeImage:
        forecast.data.NodeImage?.localFiles[0].childImageSharp.gatsbyImageData
          .images.fallback.src,
      forecastClass: forecastClass[forecast.data.Name]?.class,
      sectorsArray: summarizeNodeTaxonomy(forecastNodes, "sectorsArray").map(
        (g) => g.value
      ),
      tagsArray: summarizeNodeTaxonomy(forecastNodes, "tagsArray").map(
        (g) => g.value
      ),
    });

    // nodes.push(...forecastNodes)
    // links.push(...forecastLinks)
  });

  let dataset = {};
  dataset.nodes = nodes;
  dataset.links = links;

  dataset.tags = summarizeNodeTaxonomy(nodes, "tagsArray");
  dataset.sectors = summarizeNodeTaxonomy(nodes, "sectorsArray");

  dataset.counts = {};
  dataset.counts.total = nodes.length;
  dataset.counts.forecasts = nodes.filter((d) => d.type === "forecast").length;
  dataset.counts.trends = nodes.filter((d) => d.type === "trend").length;
  dataset.counts.signals = nodes.filter((d) => d.type === "signal").length;
  dataset.counts.tags = dataset.tags.length;
  dataset.counts.sectors = dataset.sectors.length;

  // console.log("counts")
  // console.log(dataset.counts)

  return dataset;
}

function sectorCounts(signals) {
  const items = signals
    .map((signal) => {
      if (signal.data.Sector !== null) {
        return signal.data.Sector;
      }
    })
    .flat()
    .filter((element) => element !== undefined)
    .reduce((acc, sec) => {
      // check if existing topping
      const existingSector = acc[sec];
      if (existingSector) {
        existingSector.count += 1; // if yes increment by one
      } else {
        acc[sec] = {
          name: sec,
          count: 1,
        };
      }
      // otherwise create a new entry and set to 1
      return acc;
    }, {});
  const itemsSorted = Object.values(items).sort((a, b) => b.count - a.count);
  //console.log({ itemsSorted })
  return itemsSorted;
}

function tagCounts(signals) {
  const items = signals
    .map((signal) => {
      if (signal.data.Tags !== null) {
        return signal.data.Tags;
      }
    })
    .flat()
    .filter((element) => element !== undefined)
    .reduce((acc, sec) => {
      // check if existing topping
      const existingSector = acc[sec];
      if (existingSector) {
        existingSector.count += 1; // if yes increment by one
      } else {
        acc[sec] = {
          name: sec,
          count: 1,
        };
      }
      // otherwise create a new entry and set to 1
      return acc;
    }, {});
  const itemsSorted = Object.values(items).sort((a, b) => b.count - a.count);
  //console.log({ itemsSorted })
  return itemsSorted;
}

export function processTree(node, type) {
  // console.log("processTree")
  // console.log(node)

  let nodes = [];
  let links = [];
  let nodeIds = [];

  // Process Forcasts
  let nodeId = node.recordId;

  function processSignalParents(items, id) {
    // console.log("processSignalParents")
    // console.log(items)
    items.forEach((t) => {
      let node = {
        type: "trend",
        id: t.recordId,
        name: t.data.Name,
      };
      if (!nodeIds.includes(t.recordId)) {
        nodes.push(node);
        nodeIds.push(t.recordId);
      }
      links.push({
        type: "trend-signal",
        source: t.recordId,
        target: id,
      });
      if (t.data.Informs_Forecasts) {
        processTrendParents(t.data.Informs_Forecasts, t.recordId);
      }
    });
  }

  function processTrendParents(items, id) {
    items.forEach((f) => {
      let node = {
        type: "forecast",
        id: f.recordId,
        name: f.data.Name,
      };
      if (!nodeIds.includes(f.recordId)) {
        nodes.push(node);
        nodeIds.push(f.recordId);
      }
      links.push({
        type: "forecast-trend",
        source: f.recordId,
        target: id,
      });
    });
  }

  if (type === "signal") {
    nodes.push({
      type,
      id: nodeId,
      name: node.data.Name,
    });
    if (node.data.Informs_Trends) {
      processSignalParents(node.data.Informs_Trends, nodeId);
    }
  }

  if (type === "trend") {
    nodes.push({
      type,
      id: nodeId,
      name: node.data.Name,
    });
    if (node.data.Informs_Forecasts) {
      processTrendParents(node.data.Informs_Forecasts, nodeId);
    }
  }

  // if (node.data.Informs_Trends) {
  //   node.data.Informs_Trends.forEach(t => {
  //     nodes.push({
  //       type: "trend",
  //       id: t.recordId,
  //       name: t.data.Name,
  //     })
  //     links.push({
  //       type: "trend-signal",
  //       source: t.recordId,
  //       target: nodeId,
  //     })

  //     if (t.data.Informs_Forecasts) {
  //       t.data.Informs_Forecasts.forEach(f => {
  //         nodes.push({
  //           type: "forecast",
  //           id: f.recordId,
  //           name: f.data.Name,
  //         })
  //         links.push({
  //           type: "forecast-trend",
  //           source: f.recordId,
  //           target: t.recordId,
  //         })
  //       })
  //     }
  //   })
  // }

  let dataset = {};

  if (type === "signal") {
    dataset.trends = nodes
      .filter((d) => d.type === "trend")
      .sort((a, b) => d3.ascending(a.name, b.name));
    dataset.forecasts = nodes
      .filter((d) => d.type === "forecast")
      .sort((a, b) => d3.ascending(a.name, b.name));
  }

  if (type === "trend") {
    dataset.forecasts = nodes
      .filter((d) => d.type === "forecast")
      .sort((a, b) => d3.ascending(a.name, b.name));
  }

  dataset.nodes = nodes;
  dataset.links = links;

  return dataset;
}

// function forecastTagCounts(trends) {
//   console.log({ trends })

//   const items = trends
//     .reduce(function (result, trend) {
//       if (trend.data.Signals) {
//         result.push(trend.data.Signals)
//       }
//       return result
//     }, [])
//     .flat()
//     // .map(signal => {
//     //   return signal.data.tags
//     // })
//     .reduce(function (result, signal) {
//       if (signal.data.Tags) {
//         result.push(signal.data.Tags)
//       }
//       return result
//     }, [])
//     .flat()
//     .reduce((acc, tag) => {
//       // check if existing topping
//       const existingTag = acc[tag]
//       if (existingTag) {
//         existingTag.count += 1 // if yes increment by one
//       } else {
//         acc[tag] = {
//           //id: topping.id,
//           name: tag,
//           count: 1,
//         }
//       }
//       // otherwise create a new entry and set to 1
//       return acc
//     }, {})

//   const itemsSorted = Object.values(items).sort((a, b) => b.count - a.count)
//   return itemsSorted
// }
