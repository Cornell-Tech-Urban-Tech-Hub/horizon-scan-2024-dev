import React, { useEffect, useRef } from "react"
import * as d3 from "d3"
//import tooltip } from "./tooltip.module.css"
import styled from "styled-components"
// import D3Component from "./D3Component"
import { useStaticQuery, graphql } from "gatsby"

// import datacsv from "./data.csv"

const vizTitle = `Human-Made (anthropogenic) Mass vs Biomass`
const vizDesc = `Chart showing how global biomass was project to be exceeded by Anthropogenic or manmade mass` // Accessibility
const vizSource = `Source: “Global Human-Made Mass Exceeds All Living Biomass,” by Emily Elhacham et al. (<a href="https://github.com/milo-lab/anthropogenic_mass">dataset</a>)`

const xLabel = "Year"
const yLabel = "weight (Teratonnes)"

const stackKeys = [
  "concrete",
  "aggregates",
  "bricks",
  "asphalt",
  "metals",
  "other",
]

const codebook = {
  concrete: {
    label: "Concrete",
    labelDetail: "",
    color: "#AAA",
  },
  aggregates: {
    label: "Aggregates",
    labelDetail: "(gravel etc.)",
    color: "#DEE0E6",
  },
  bricks: {
    label: "Bricks",
    labelDetail: "",
    color: "#FA7C5A",
  },
  asphalt: {
    label: "Asphalt",
    labelDetail: "",
    color: "#4B4B4B",
  },
  metals: {
    label: "Metals",
    labelDetail: "",
    color: "#C4C4C4",
  },
  other: {
    label: "Other",
    labelDetail: "(Wood, glass and plastic)",
    color: "#F6BB93",
  },
  antropogenic: {
    label: "Antropogenic Mass",
    labelDetail: "",
    color: "#333",
  },
  biomass: {
    label: "Biomass (dry)",
    labelDetail: "",
    color: "#8dc63f",
  },
}

const ChartWrapper = styled.div`
  margin: 0 auto;
  position: relative;

  .axis {
    font-size: 0.7rem;
    font-family: "DIN-2014", sans-serif;
    font-weight: 400;
  }

  .axis-title {
    font-size: 0.9rem;
    font-family: "DIN-2014", sans-serif;
    font-weight: 700;
    fill: rgba(0, 0, 0, 0.6);
  }

  .background {
    fill: rgba(0, 0, 0, 0.05);
  }

  .tick line {
    stroke: #fff;
    stroke-width: 2px;
  }

  h4 {
    margin-top: 1rem;
  }
`

export function ChartMass({ vizId = "mass-chart", height = 300 }) {
  const data = useStaticQuery(graphql`
    query MassQuery {
      allMassCsv {
        nodes {
          year
          other
          metals
          concrete
          bricks
          biomass
          asphalt
          antropogenic
          aggregates
        }
      }
    }
  `)

  // console.log(data)

  let color = d3
    .scaleOrdinal()
    .domain(stackKeys)
    .range(stackKeys.map(d => codebook[d].color))

  // let dataset = []

  let width = 700
  //let height = 700
  let dataset = processData(data.allMassCsv.nodes, stackKeys, codebook)

  const divRef = useRef(null)
  // const selectionRef = useRef(null)

  function drawChart() {
    // console.log(dataset)

    // let selectionSVG = d3.select(divRef.current).select("svg") // Unused

    // console.log(divWidth) // NOT WORKING
    width = divRef.current.getBoundingClientRect().width
    let margin = { top: 20, right: 20, bottom: 80, left: 60 }

    // height = width - margin.left - margin.right + margin.top + margin.bottom

    let innerHeight = height - margin.top - margin.bottom
    let innerWidth = width - margin.left - margin.right

    // filtering previous teams that havent scored more than 2 points in a season.
    // let selectSeries = standings.series.filter(d => d.maxpoints > 2)

    // Define SVG
    const svg = d3
      .create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("id", vizId)
      .attr("aria-label", vizDesc)

    // Main chart group/area inset by top/left margin
    const group = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // Define Scales
    let y = d3
      .scaleLinear()
      // .domain(standings.extPoints)
      .domain([0, Math.max(dataset.lineMax, dataset.stackMax)])
      .nice()
      .range([innerHeight, 0])
      .nice()

    let x = d3
      .scaleLinear()
      .domain(dataset.timeExtent)
      .nice()
      .range([20, innerWidth])

    // Define and Call Axes
    let yAxis = d3.axisLeft(y)
    let xAxis = d3.axisBottom(x).tickFormat(d3.format("d"))

    group
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + 0 + "," + (innerHeight + 20) + ")")
      .call(xAxis)
      .call(g => g.selectAll(".domain").remove())
      .selectAll("text")
      .attr("y", 4)
      .attr("x", 4)
      .attr("dy", ".35em")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start")

    group
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .call(g => g.selectAll(".domain").remove())

    // Grid Lines
    let grid = g => {
      g.attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .call(g =>
          g
            .append("g")
            .selectAll("line")
            .data(x.ticks())
            .join("line")
            .attr("x1", d => 0.5 + x(d))
            .attr("x2", d => 0.5 + x(d))
            .attr("y1", 0)
            .attr("y2", innerHeight + 20)
        )
        .call(g =>
          g
            .append("g")
            .selectAll("line")
            .data(y.ticks())
            .join("line")
            .attr("y1", d => 0.5 + y(d))
            .attr("y2", d => 0.5 + y(d))
            .attr("x1", 0)
            .attr("x2", innerWidth)
        )
    }

    group.append("g").call(grid)

    // Axis Labels
    group
      .append("text")
      .text(xLabel)
      .attr("text-anchor", "middle")
      .attr("class", "x-axis-label")
      .attr("y", innerHeight + 70)
      .attr("x", innerWidth / 2)
      .style("fill", "#999")
      .style("font-size", "14px")
      .style("font-family", "sans-serif")

    group
      .append("text")
      .text(yLabel)
      .attr("text-anchor", "middle")
      .attr("class", "graph-title")
      .attr(
        "transform",
        "translate(" +
          (0 - margin.left * 0.65) +
          "," +
          innerHeight / 2 +
          ") rotate(-90)"
      )
      .style("fill", "#999")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("font-family", "sans-serif")

    // Source Text
    // group
    //   .append("text")
    //   .attr("class", "graph-source")
    //   .text(vizSource)
    //   .attr("text-anchor", "left")
    //   .attr("x", 0)
    //   .attr("y", innerHeight + margin.bottom - 18)
    //   .style("fill", "#999")
    //   .style("font-size", ".60em")
    //   .style("font-family", "sans-serif")

    group
      .append("line")
      .attr("class", "y-highlight")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .style("stroke", "#999")
      .style("opacity", 0)

    let area = d3
      .area()
      .x(d => x(d.data.year))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))

    group
      .append("g")
      .attr("class", "data-area")
      .selectAll("path")
      .data(dataset.stack)
      .join("path")
      .attr("fill", ({ key }) => codebook[key].color)
      .attr("d", area)
      .append("title")
      .text(({ key }) => key)

    function isNum(n) {
      return !isNaN(parseFloat(n)) && isFinite(n) && n !== ""
    }

    let line = d3
      .line()
      .defined(d => isNum(d.value))
      .x(d => x(d.year))
      .y(d => y(d.value))

    let lines = group.append("g").attr("class", "lines")

    lines
      .append("path")
      .datum(dataset.lineMap.get("antropogenic"))
      .attr("d", line)
      .attr("class", function (d) {
        return "line line-antropogenic" //
      })
      .attr("fill", "none")
      .style("stroke", function (d) {
        return codebook["antropogenic"].color
      })

    lines
      .append("path")
      .datum(dataset.lineMap.get("biomass"))
      .attr("d", line)
      .attr("class", function (d) {
        return "line line-biomass" //
      })
      .style("stroke-width", 3)
      .attr("fill", "none")
      .style("stroke", function (d) {
        return codebook["biomass"].color
      })

    group
      .append("text")
      .text(codebook["biomass"].label)
      .attr("text-anchor", "start")
      .attr("class", "graph-title")
      .attr(
        "transform",
        `translate(${x(1910)},${
          y(dataset.lookupYear.get(1910)[0]["biomass"]) - 10
        })`
      )
      .style("fill", codebook["biomass"].color)
      .style("font-size", "0.8rem")
      .style("font-weight", "bold")
      .style("font-family", "sans-serif")

    group
      .append("text")
      // .text(codebook["antropogenic"].label)
      .text("Human-made Mass")
      .attr("text-anchor", "start")
      .attr("class", "graph-title")
      .attr("transform", `translate(${x(1910)},${innerHeight / 2})`)
      .style("fill", codebook["antropogenic"].color)
      .style("font-size", "0.8rem")
      .style("font-weight", "bold")
      .style("font-family", "sans-serif")

    // Area Legend

    let legendSize = 8
    let legend = group
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + 0 + "," + (innerHeight / 2 + 16) + ")")

    var aMassTypes = legend
      .selectAll("engine")
      .data(color.domain().reverse())
      .enter()
      .append("g")
      .attr("class", d => `engine-${d}`)
      .attr("transform", function (d, i) {
        return `translate(${x(1910)},${i * (legendSize * 2.5)})`
      })

    aMassTypes
      .append("circle")
      .attr("r", legendSize)
      .attr("fill", d => color(d))
      //.attr("r", function(d) { return size(d['goals_for']) })
      .attr("opacity", "1.0")

    aMassTypes
      .append("text")
      .attr("class", "label")
      .attr("x", legendSize * 2)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(d => {
        let label = codebook[d].label
        if (width > 350) {
          label += ` ${codebook[d].labelDetail}`
        }
        return label
      })
      .attr("fill", "#555")
      .style("font-weight", "bold")
      .style("font-size", ".7rem")
      .style("font-family", "sans-serif")

    return svg
  }

  //ComponentDidMount - Initialize
  useEffect(() => {
    // console.log(`ComponentDidMount`)

    //Append d3 svg to ref div
    var div = d3.select(divRef.current)

    let svg = drawChart()
    if (div.node().firstChild) {
      div.node().removeChild(div.node().firstChild)
    }
    div.node().appendChild(svg.node())
  })

  //Render
  return (
    <ChartWrapper>
      <h4>{vizTitle}</h4>
      <div id={vizId} ref={divRef} />
      <small
        dangerouslySetInnerHTML={{
          __html: vizSource,
        }}
      />
    </ChartWrapper>
  )
}

function processData(dataset, stackKeys, codebook) {
  // console.log(dataset)
  let results = {}
  // let dataParsed = data.map(d => d3.autoType(d)).filter(d => d.year < 2030)

  results.columns = Object.keys(codebook)

  let dataParsed = dataset
    .map(d => {
      let row = {}
      row.year = +d["year"]
      results.columns.forEach(g => {
        row[g] = d[g] === null ? null : +d[g]
      })
      return row
    })
    .filter(d => d.year < 2030)

  // console.log(
  //   dataset.map(d => {
  //     let row = {}
  //     results.columns.forEach(g => {
  //       row[g] = d[g] === null ? null : +d[g]
  //     })
  //     return row
  //   })
  // )

  let set = []

  dataParsed.forEach(d => {
    let year = d.year

    if (d.antropogenic) {
      set.push({ year, key: "antropogenic", value: d.antropogenic })
    }

    if (d.biomass) {
      set.push({ year, key: "biomass", value: d.biomass })
    }
  })

  let stack = d3.stack().keys(stackKeys)(dataParsed)

  results.stack = stack
  results.stackMax = d3.max(stack, d => d3.max(d, d => d[1]))

  results.lookupYear = d3.group(dataParsed, d => d.year)

  results.lineSet = set
  results.lineMap = d3.group(set, d => d.key)
  results.lineMax = d3.max(set, d => d.value)

  results.timeExtent = d3.extent(dataParsed, d => d.year)

  return results
}
