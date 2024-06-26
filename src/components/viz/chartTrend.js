import React, { useEffect, useRef } from "react"
import * as d3 from "d3"
//import tooltip } from "./tooltip.module.css"
import styled from "styled-components"
// import D3Component from "./D3Component"
// import vizSettings from "./vizSettings"

const ChartTrendWrapper = styled.div`
  max-width: 320px;
  margin: 0 auto;
  position: relative;

  .axis {
    font-size: 0.8rem;
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
`

export function ChartTrend({
  vizId = "trend-chart",
  height = 300,
  trend,
  selectedX = "timeframe",
  selectedY = "certainty",
  selectedS = "impact",
}) {
  let width = 700
  //let height = 700

  // console.log(trend["Certainty"])

  // let color = "#999"

  let rRange = [8, 12, 16]

  let orders = {
    certainty: ["unproven", "attainable", "likely"],
    impact: ["sustaining", "disruptive", "transformative"],
    timeframe: [
      "soon (0 to 3 years)",
      "later (3 to 7 years)",
      "eventually (8 to 10 years)",
    ],
  }
  const divRef = useRef(null)
  // const selectionRef = useRef(null)

  function drawChart() {
    // let selectionSVG = d3.select(divRef.current).select("svg")

    // console.log(vizSettings)

    // console.log(divWidth) // NOT WORKING
    width = divRef.current.getBoundingClientRect().width
    let margin = { top: 60, right: 120, bottom: 140, left: 60 }

    height = width - margin.left - margin.right + margin.top + margin.bottom

    let innerHeight = height - margin.top - margin.bottom
    let innerWidth = width - margin.left - margin.right

    // Initialize Scales
    let scaleX = d3.scaleBand().domain(orders.timeframe).range([0, innerWidth])
    let scaleY = d3.scaleBand().domain(orders.certainty).range([innerHeight, 0])
    let scaleS = d3.scaleOrdinal().domain(orders.impact).range(rRange)

    // console.log(scaleX(trend.Time_Frame))
    // console.log(scaleY(trend.Certainty))
    // console.log(scaleS(trend.Impact))

    let xAxis = d3.axisTop(scaleX).tickFormat(d => d.substr(0, d.indexOf(" ")))
    let yAxis = d3.axisRight(scaleY)

    const svg = d3
      .create("svg")
      // .attr("width", width)
      // .attr("height", height)
      .attr("viewBox", [0, 0, width, height])

    const group = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    group
      .append("rect")
      .attr("class", "background")
      .attr("width", innerWidth)
      .attr("height", innerHeight)

    // X Axis
    group
      .append("g")
      .attr("class", "x axis")
      //   .attr("transform", "translate(" + 0 + "," + innerHeight + ")")
      .call(xAxis)
      .call(g => g.selectAll(".domain").remove())
      .call(g => g.selectAll(".tick line").clone().attr("y2", innerHeight))
      .selectAll("text")
      .attr("y", -10)
      .attr("x", 8)
      .attr("dy", ".35em")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "start")

    // X Axis Label
    group
      .append("text")
      .text("Time Frame")
      .attr("text-anchor", "middle")
      .attr("class", "axis-title")
      .attr("x", (width - margin.left - margin.right) / 2.0)
      .attr("alignment-baseline", "hanging")
      .attr("y", innerHeight + 10)

    // Y Axis
    group
      .append("g")
      .attr("class", "y axis")
      .attr("transform", `translate(${innerWidth}, 0)`)
      .call(yAxis)
      .call(g => g.selectAll(".domain").remove())
      .call(g => g.selectAll(".tick line").clone().attr("x2", -innerWidth))

    // Y Axis Label
    group
      .append("text")
      .attr("class", "axis-title")
      .text("Certainty")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${-10},${innerHeight / 2}) rotate(-90)`)

    // S Axis Label
    group
      .append("text")
      .text("Impact")
      .attr("text-anchor", "middle")
      .attr("class", "axis-title")
      .attr("x", 0)
      .attr("transform", `translate(${-10},${innerHeight + 68}) rotate(-90)`)

    let sAxis = group.append("g").attr("class", "s axis")

    let sLabelSet = sAxis
      .selectAll(".s-legend")
      .data(scaleS.domain().filter(d => d !== null))
      .join("g")
      .attr("class", "s-axis axis")
      .attr("transform", function (d, i) {
        return `translate( ${20},${innerHeight + 45 + i * 20})`
      })

    sLabelSet
      .append("circle")
      .attr("r", d => scaleS(d))
      .attr("stroke", "#414042")
      .attr("stroke-width", d => {
        return trend.Impact === d ? "2" : "1"
      })
      .attr("fill", "none")
      .attr("opacity", d => {
        return trend.Impact === d ? "1.0" : "0.5"
      })

    sLabelSet
      .append("text")
      .attr("class", "s-label")
      .attr("x", 24)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(d => d)
      .attr("opacity", d => {
        return trend.Impact === d ? "1.0" : "0.6"
      })

    // console.log(trend)

    // Data Point
    if (
      trend["Certainty"] !== null &&
      trend["Time_Frame"] !== null &&
      trend["Impact"] !== null
    ) {
      group
        .datum(trend)
        .append("g")
        .attr("transform", d => {
          // console.log(scaleX.bandwidth())
          // console.log(scaleY.bandwidth())
          return `translate(${
            scaleX(d["Time_Frame"]) + scaleX.bandwidth() / 2
          }, ${scaleY(d["Certainty"]) + scaleY.bandwidth() / 2})`
        })
        .attr("class", "node")
        .append("circle")
        .attr("class", "bubble")

        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("r", d => {
          return scaleS(d["Impact"]) + 2
        })
        .attr("fill", "#333")
    } else {
      group
        .append("text")
        .text("No Data")
        .attr("fill", "#CCC")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("class", "axis-title")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight / 2)
    }

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
    <ChartTrendWrapper>
      <div id={vizId} ref={divRef} />
    </ChartTrendWrapper>
  )
}
