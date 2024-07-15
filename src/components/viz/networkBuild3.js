import React, { useEffect, useRef } from "react"
import * as d3 from "d3"
//import tooltip } from "./tooltip.module.css"
import styled from "styled-components"
// import D3Component from "./D3Component"
import theme from "../../styles/Theme"
import { Link } from "gatsby"

const { slugFormat } = require("../../utilities/slugFormat")

const NetworkWrapper = styled.div`
  position: relative;

  svg {
    width: 100%; // Was breaking IE display
    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      width: auto;
    }
  }
`

const TooltipBox = styled.div`
  position: absolute;
  text-align: center;
  min-width: 30px;
  border-radius: 4px;
  height: auto;
  background: rgba(250, 250, 250, 0.9);
  border: 1px solid #ddd;
  font-size: 0.8rem;
  padding: 4px 8px;
  text-align: left;
  opacity: 0;
  font-family: ${props => props.theme.type.sans};
  span {
    text-transform: capitalize;
  }
`

const SelectionBox = styled.div`
  display: none;
  position: absolute;
  top: 10px;
  left: 10px;
  max-width: 200px;
  padding: 10px;
  /* background-color: rgba(240, 240, 240, 0.8); */
  box-shadow: rgb(0 0 0 / 10%) 0px 5px 15px;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 400;
  border-radius: 6px;
  font-family: ${props => props.theme.type.sans};

  .type {
    text-transform: uppercase;
    font-size: 0.8rem;
  }
  .name {
    font-family: ${props => props.theme.type.sans};
    font-weight: 700;
    line-height: 1.2;
  }
  .summary {
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }

  .close {
    margin-right: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme.colors.coolgrey};
    cursor: pointer;
    background: none;
    transition: all 0.5s ease;
    :hover {
      background: ${({ theme }) => theme.colors.coolgrey};
      color: #fff;
    }
  }

  .node-link {
    text-decoration: none;
    transition: all 0.5s ease;
    :hover {
      text-decoration: underline;
    }
  }
`

export function NetworkBuild3({
  vizId,
  vizContext,
  scaling = true,
  height,
  selectedLayout,
  linksData,
  nodesData,
  selectedX = "none",
  selectedY = "none",
  selectedS = "none",
  selectedView,
  nodeHighlight,
  colorForecast = false,
  nodeHighlightSet = [],
  nodeHoverTooltip,
  nodeSelection,
  highlighting = false,
  selectedNodeIds = [],
  nodeHandleSelection,
  introTransition = false,
}) {
  // const [divWidth, setDivWidth] = React.useState(600)
  // let scaleX = d3.scaleBand().domain(orderTimeframe).range([0, innerWidth])
  // let scaleY = d3.scaleBand().domain(orderCertainty).range([innerHeight, 0])
  // let scaleS = d3.scaleOrdinal().domain(orderImpact).range([8, 12, 16])
  const [selectedNode, setSelectedNode] = React.useState({})
  const [isFirstLoad, setIsFirstLoad] = React.useState(true)
  // const [selectedNodeURL, setSelectedNodeURL] = React.useState()

  let width = 700
  //let height = 700

  const breaks = {
    sm: 500,
    md: 600,
  }

  const nodeBaseRadius = {
    forecast: 36,
    trend: 18,
    signal: 6,
  }

  const colorSet = {
    forecast: "#444",
    trend: "#999",
    signal: "#CCC",
  }

  let orders = {
    certainty: ["unproven", "attainable", "likely"],
    impact: ["sustaining", "disruptive", "transformative"],
    timeframe: [
      "soon (0 to 3 years)",
      "later (3 to 7 years)",
      "eventually (8 to 10 years)",
    ],
  }

  let links = linksData.map(d => Object.assign({}, d))
  let nodes = nodesData.map(d => Object.assign({}, d))

  // let filterNodes = []
  // let filterLinks = []

  const divRef = useRef(null)
  // const selectionRef = useRef(null)

  let simulation
  const simulationRef = useRef()

  let nodeVisibility = ["forecast", "trend", "signal"]
  let linkVisibility = ["forecast-trend", "trend-signal"]

  function updateVisibility() {
    // console.log("UPDATE DATA")
    // console.log(selectedView)
    switch (selectedView) {
      case "forecasts":
        nodeVisibility = ["forecast"]
        linkVisibility = []
        break
      case "forecaststrends":
        // console.log("forecaststrends")
        nodeVisibility = ["forecast", "trend"]
        linkVisibility = ["forecast-trend"]
        break
      case "trends":
        // console.log("data view trends")
        nodeVisibility = ["trend"]
        linkVisibility = []
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break
      case "none":
        // console.log("data view none")
        nodeVisibility = []
        linkVisibility = []
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break
      default:
        nodeVisibility = ["forecast", "trend", "signal"]
        linkVisibility = ["forecast-trend", "trend-signal"]
    }
  }

  function drawGraph() {
    // let selectionSVG = d3.select(divRef.current).select("svg")

    // console.log(divWidth) // NOT WORKING
    let width = divRef.current.getBoundingClientRect().width

    // reduce height for homepage intro at smaller size
    if (introTransition && width < breaks.sm) {
      height = 400
    }

    let margin = { top: 20, right: 20, bottom: 20, left: 20 }

    if (selectedY !== "none" || selectedS !== "none") {
      margin.left = 100
    }

    if (selectedX !== "none" || selectedS !== "none") {
      margin.bottom = 120
    }

    let innerHeight = height - margin.top - margin.bottom
    let innerWidth = width - margin.left - margin.right

    // Initialize Scales
    let scaleX = d3.scaleBand()
    let scaleY = d3.scaleBand()
    let scaleS = d3.scaleOrdinal().domain(orders.impact).range([8, 11, 14])

    // Internet Explorer 6-11
    // let isIE = /*@cc_on!@*/ false || !!document.documentMode

    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])

    // if (!isIE) {
    //   svg.attr("width", width).attr("height", height)
    // }

    updateVisibility()

    const labelgroup = svg
      .append("g")
      .attr("class", "label-group")
      .attr("transform", `translate(${margin.left},${margin.top})`)
    const forcegroup = svg
      .append("g")
      .attr("class", "force-group")
      .attr("transform", `translate(${margin.left},${margin.top})`)
    const axisLabels = labelgroup.append("g").attr("class", "axis-labels")

    simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id(d => d.id)
          .strength(0.1)
      )
      .force("charge", d3.forceManyBody().strength(-12))
      // .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .on("tick", tick)

    function tick() {
      //node.attr("cx", d => d.x).attr("cy", d => d.y)
      node.attr("transform", d => {
        d.x = Math.max(d.radius, Math.min(innerWidth - d.radius, d.x))
        d.y = Math.max(d.radius, Math.min(innerHeight - d.radius, d.y))
        return `translate(${d.x}, ${d.y})`
      })
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
    }

    // Add Nodes Links

    const linkGroup = forcegroup.append("g").attr("class", "links")
    const link = linkGroup
      .selectAll(".link")
      .data(links)
      .join("line")
      .attr("class", "link")

    const nodeGroup = forcegroup.append("g").attr("class", "nodes")

    // if introTransition is true and is first load set node opacity initially to 0
    const transitionNodes = introTransition && isFirstLoad

    const node = nodeGroup
      .selectAll(".node")
      .data(nodes, d => d.id)
      .join(
        enter =>
          enter
            .append("g")
            .attr("class", "node")
            .attr("id", d => `${d.type} - ${d.name}`)
            .attr("transform", d => {
              // console.log(`x: ${d.x} / y: ${d.y}`)
              d.x = innerWidth / 2
              d.y = innerHeight / 2
              // return `translate(${innerWidth / 2}, ${innerHeight / 2})`
              // return `translate(${d.x}, ${d.y})`
            })
            .call(drag(simulation))
            .append("circle")
            .attr("class", "bubble")
            .attr("opacity", d => {
              return transitionNodes ? 0 : 1
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .attr("r", d => {
              d.radius = nodeBaseRadius[d.type]
              if (selectedS === "impact" && d.type === "trend") {
                d.radius = scaleS(d.impact)
              }
              if (scaling) {
                if (width < breaks.sm) {
                  d.radius = d.radius * 0.7
                } else if (width <= breaks.md) {
                  d.radius = d.radius * 0.8
                }
              }
              return d.radius
            })
            .attr("fill", d => colorSet[d.type])
            .on("mouseover", nodeMouseOver)
            .on("mouseout", nodeMouseOut)
            .on("click", nodeClick),
        // update =>
        //   update
        //     .attr("transform", function (d) {
        //       return `translate(${x(d.date)},${y(d[selectType])})`
        //     })
        //     .attr("opacity", d => (!isNaN(d[selectType]) ? 1 : 0)), // hide if value is NaN
        exit => exit.remove()
      )

    const linkedByIndex = {}
    links.forEach(d => {
      linkedByIndex[`${d.source.index},${d.target.index}`] = 1
    })
    function isConnected(a, b) {
      return (
        linkedByIndex[`${a.index},${b.index}`] ||
        linkedByIndex[`${b.index},${a.index}`] ||
        a.index === b.index
      )
    }

    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
        // event.subject.fx = event.subject.x
        // event.subject.fy = event.subject.y
      }
      function dragged(event, d) {
        d.fx = event.x
        d.fy = event.y
        // event.subject.fx = event.x
        // event.subject.fy = event.y
      }
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }
      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    }

    // function releasenode(event, d) {
    //   d.fx = null
    //   d.fy = null
    // }

    // Add the tooltip element to the graph
    // const tooltip = document.querySelector("#graph-tooltip")
    // if (!tooltip) {
    //   const tooltipDiv = document.createElement("div")
    //   tooltipDiv.classList.add(styles.tooltip)
    //   tooltipDiv.style.opacity = "0"
    //   tooltipDiv.id = "graph-tooltip"
    //   document.body.appendChild(tooltipDiv)
    // }

    const addTooltip = (hoverTooltip, d, x, y) => {
      //div.transition().duration(200).style("opacity", 0.9)
      d3.select("#graph-tooltip").style("opacity", 0.9)
      d3.select("#graph-tooltip")
        //.html(hoverTooltip(d))
        .html(`<div><span>${d.type}<span><br><strong>${d.name}</strong></div>`)
        .style("pointer-events", "none")
        .style("max-width", "250px")
        .style("z-index", 300)
        .style("left", `${x + 24}px`)
        .style("top", `${y + 24}px`)
    }

    const removeTooltip = () => {
      //div.transition().duration(200).style("opacity", 0)
      d3.select("#graph-tooltip").style("opacity", 0)
    }

    //const selection = document.querySelector("#nodeSelected")

    // const showSelection = d => {
    //   //div.transition().duration(200).style("opacity", 0.9)

    //   //d3.select("#nodeSelected").style("opacity", 0.9)
    //   d3.select("#nodeSelected").style("display", "block")
    //   d3.select("#nodeSelected .inner")
    //     //.html(hoverTooltip(d))
    //     .html(`<div>${d.type}: <strong>${d.name}</strong></div>`)
    //     .style("pointer-events", "none")
    //     .style("z-index", 300)
    //     .style("left", 0)
    //     .style("top", 0)
    // }

    let transitionTime = 250

    function nodeMouseOver(event, d) {
      let fadeOpacity = 0.2
      d3.select(event.target).attr("stroke", "#000")
      //addTooltip(nodeHoverTooltip, d, event.pageX, event.pageY)
      // addTooltip(nodeHoverTooltip, d, event.offsetX, event.offsetY)
      addTooltip(nodeHoverTooltip, d, d.x + margin.left, d.y + margin.top)
      d3.selectAll(".node")
        .transition()
        .duration(transitionTime)
        .style("opacity", function (o) {
          return isConnected(d, o) ? 1 : fadeOpacity
        })
      d3.selectAll(".link")
        .transition()
        .duration(transitionTime)
        .style("opacity", function (o) {
          return o.source === d || o.target === d ? 1 : fadeOpacity
        })
    }
    function nodeMouseOut(event, d) {
      let isSelected = d3.select(event.target).classed("selected")
      //console.log(isSelected)
      d3.select(event.target).attr("stroke", e => {
        return isSelected ? "red" : "#fff"
      })
      removeTooltip()

      d3.selectAll(".node")
        .transition()
        .duration(transitionTime)
        .style("opacity", 1)
      d3.selectAll(".link")
        .transition()
        .duration(transitionTime)
        .style("opacity", 1)
    }

    function nodeClick(event, d) {
      // d3.select(event.target).attr("stroke", "red")
      //d3.select(event.target).classed("selected", true)

      //nodeHandleSelection(d)
      setSelectedNode(d)

      // Highlight Selected Node
      d3.select(".bubble.selected")
        .classed("selected", false)
        .attr("stroke", "#fff")

      d3.select(event.target).classed("selected", true)
      d3.select(event.target).attr("stroke", "red")

      // let slug = d.id
      // let content = `<span>${d.type}</span><br>`
      // content += `<strong>${d.name}</strong>`
      // if (d.type === "forecast" || d.type === "trend") {
      //   if (d.summary !== null) {
      //     content += `</br>${d.summary}`
      //   }
      // }

      // d3.select("#nodeSelected .inner")
      //   //.html(hoverTooltip(d))
      //   //.html(`<div>${d.type}: <strong>${d.name}</strong></div>`)
      //   .html(content)
      //   .style("pointer-events", "none")
      //   .style("z-index", 300)
      //   .style("left", 0)
      //   .style("top", 0)

      d3.select("#nodeSelected").style("display", "block")
    }

    // Domain Settings
    // console.log(selectedX)
    if (selectedX !== "none") {
      scaleX.domain(orders[selectedX])
      scaleX.range([0, innerWidth])
    }

    if (selectedY !== "none") {
      scaleY.domain(orders[selectedY])
      scaleY.range([innerHeight, 0])
    }

    // Draw Axes
    const yLabelSet = axisLabels
      .selectAll("y-label")
      .data(scaleY.domain(), d => d)
      .join("text")
      .attr("class", "y-label")
      .attr("x", -margin.left / 2)
      .attr("y", d => scaleY(d) + scaleY.bandwidth() / 2)
      .attr("dy", ".35em")
      .attr("font-size", ".75rem")
      .attr("text-anchor", "middle")
      .text(d => d)

    const xLabelSet = axisLabels
      .selectAll(".x-label")
      .data(scaleX.domain(), d => d)
      .join("text")
      .attr("class", "x-label")
      .attr("x", d => scaleX(d) + scaleX.bandwidth() / 2)
      .attr("y", innerHeight)
      .attr("dy", ".35em")
      .attr("font-size", ".75rem")
      .attr("text-anchor", "middle")
      .text(d => {
        if (width < breaks.sm) {
          return d.substr(0, d.indexOf(" "))
        } else {
          return d
        }
      })

    // Draw Impact Legend if Active
    if (selectedS === "impact") {
      let sLabelSet = axisLabels
        .selectAll(".s-label-group")
        .data(scaleS.domain().filter(d => d !== null))
        .join("g")
        .attr("class", "s-label-group")
        .attr("transform", function (d, i) {
          return `translate( ${
            -margin.left * 0.75
          },${innerHeight + 24 + i * 20})`
        })

      sLabelSet
        .append("circle")
        .attr("r", d => scaleS(d))
        .attr("stroke", "#414042")
        .attr("stroke-weight", 2)
        .attr("fill", "none")
        .attr("opacity", "1.0")

      sLabelSet
        .append("text")
        .attr("class", "s-label")
        .attr("x", 24)
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .text(d => d)
        .attr("font-size", ".75rem")
    }

    // Update Simulation Forces
    simulation.force(
      "collision",
      d3.forceCollide().radius(function (d) {
        if (scaling && width < breaks.sm) {
          return d.radius + 4
        } else if (scaling && width < breaks.md) {
          return d.radius + 6
        } else {
          return d.radius + 8
        }
      })
    )

    simulation
      .force("x")
      .x(d => {
        if (selectedX !== "none" && d.type === "trend") {
          //console.log(scaleX(d[selectedX]))
          return d[selectedX] !== null
            ? scaleX(d[selectedX]) + scaleX.bandwidth() / 2
            : 0
        } else {
          return innerWidth / 2
        }
      })
      .strength(d => {
        if (selectedX === "none" && selectedY === "none") {
          return 0.05
        } else {
          if (d.type === "trend") {
            return 1.0
          } else {
            return 0.0
          }
        }
      })

    simulation
      .force("y")
      .y(d => {
        if (selectedY !== "none" && d.type === "trend") {
          return d[selectedY] !== null
            ? scaleY(d[selectedY]) + scaleY.bandwidth() / 2
            : 0
        } else {
          return innerHeight / 2
        }
      })
      .strength(d => {
        if (selectedX === "none" && selectedY === "none") {
          return 0.05
        } else {
          if (d.type === "trend") {
            return 1.0
          } else {
            return 0.0
          }
        }
      })

    // simulation.force("center", d => {
    //   if (selectedX === "none" && selectedY === "none") {
    //     return null
    //   } else {
    //     return d3.forceCenter(innerWidth / 2, innerHeight / 2)
    //   }
    // })

    simulation.force("link").strength(d => {
      if (selectedX === "none" && selectedY === "none") {
        return 0.75
      } else {
        return 0.25
      }
    })

    // link simulation to ref so it can be accesses outside of useRef
    simulationRef.current = simulation

    return svg
  }

  // Apply Styles
  function applyStyle(selectionSVG) {
    // console.log("APPLY STYLE")
    // console.log("Color Forecast: " + colorForecast)

    // console.log(highlighting)
    updateVisibility()

    if (!introTransition && !isFirstLoad) {
      // Standard Style Update
      selectionSVG
        .selectAll(".bubble")
        .transition()
        .duration(500)
        .attr("r", d => {
          return d.radius
        })
        .attr("opacity", d => {
          if (nodeVisibility.includes(d.type)) {
            return 1
          } else {
            return 0
          }
        })
        .attr("fill", d => {
          let c
          if (highlighting && d.type !== "forecast") {
            c = selectedNodeIds.includes(d.id) ? "purple" : colorSet[d.type]
          } else {
            c = colorSet[d.type]
          }
          if (colorForecast && d.type === "forecast") {
            c = highlighting
              ? colorSet[d.type]
              : theme.forecast[d.forecastClass]
          }
          return c
        })

      selectionSVG
        .selectAll(".link")
        .transition()
        .duration(500)
        .attr("stroke", "#999")
        .attr("stroke-opacity", d => {
          if (linkVisibility.includes(d.type)) {
            return 0.6
          } else {
            return 0.0
          }
        })
        .attr("stroke-width", 1)
    } else {
      // First Load Transition
      setIsFirstLoad(false)
      selectionSVG
        .selectAll(".bubble")
        .attr("r", d => {
          return d.radius
        })
        .attr("fill", d => {
          let c
          if (highlighting && d.type !== "forecast") {
            c = selectedNodeIds.includes(d.id) ? "purple" : colorSet[d.type]
          } else {
            c = colorSet[d.type]
          }
          if (colorForecast && d.type === "forecast") {
            c = theme.forecast[d.forecastClass]
          }
          return c
        })
        .transition()
        .duration(1000)
        .delay(function (d, i) {
          return i * 10 + 500
        })
        .style("opacity", 1.0)
        .on("end", nodeStyled)

      function nodeStyled() {
        selectionSVG
          .selectAll(".link")
          .transition()
          .duration(1000)
          .attr("stroke", "#999")
          .attr("stroke-opacity", d => {
            if (linkVisibility.includes(d.type)) {
              return 0.6
            } else {
              return 0.0
            }
          })
          .attr("stroke-width", 1)
      }
    }
  }

  //const simulationRef = React.useRef(simulation)

  //ComponentDidMount - Initialize
  useEffect(() => {
    // console.log(`ComponentDidMount`)
    //Append d3 svg to ref div
    // console.log("nodes")
    // console.log(nodes)
  }, [])

  //ComponentDidUpdate - Run only on dependent variable change
  useEffect(() => {
    // console.log(`ComponentUpdate1`)
  }, [
    nodeHighlight,
    nodeHighlightSet,
    selectedView,
    highlighting,
    colorForecast,
  ])

  useEffect(() => {
    // console.log(`ComponentUpdate2`)
    //simulationRef.current.alpha(1).restart()
    var div = d3.select(divRef.current)

    let svg = drawGraph()
    if (div.node().firstChild) {
      div.node().removeChild(div.node().firstChild)
    }
    div.node().appendChild(svg.node())
  }, [selectedX, selectedY, selectedS])

  // useEffect(() => {
  //   console.log(`ComponentUpdate4`)
  //   console.log(simulationRef)
  //   simulationRef.current.alpha(1).restart()
  // }, [])

  //ComponentDidUpdate - Runs Every Change
  useEffect(() => {
    // console.log(`ComponentUpdate3`)
    var div = d3.select(divRef.current)

    applyStyle(div.select("svg"))
  })
  // console.log(selectedNode.name)
  //Render
  return (
    <NetworkWrapper>
      <SelectionBox id="nodeSelected">
        <div className="inner">
          <div className="type">{selectedNode.type}</div>
          <div className={"name"}>{selectedNode.name}</div>
          {selectedNode.summary !== null && (
            <div className={"summary"}>{selectedNode.summary}</div>
          )}
        </div>
        <button
          className="close"
          onClick={e => {
            // console.log("close SelectionBox")
            d3.select(".bubble.selected")
              .classed("selected", false)
              .attr("stroke", "#fff")
            document.getElementById("nodeSelected").style.display = "none"
          }}
        >
          close
        </button>
        {/* <Link to={`/${selectedNode.type}s/${selectedNode.id}`}>View Page</Link> */}

        <Link
          className="node-link"
          to={`/${selectedNode.type}s/${
            selectedNode.name ? slugFormat(selectedNode.name) : ""
          }`}
        >
          View Page
        </Link>
      </SelectionBox>
      <div id={vizId} ref={divRef} />
      {/* <div>{selectedNode.id}</div> */}
      <TooltipBox id="graph-tooltip"></TooltipBox>
    </NetworkWrapper>
  )
}
