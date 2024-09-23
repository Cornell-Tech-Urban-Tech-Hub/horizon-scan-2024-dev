import React, { useEffect } from "react";
// import * as d3 from "d3"
// import { Link } from "gatsby"
import styled from "styled-components";
// import Markdown from "markdown-to-jsx"
import { Waypoint } from "react-waypoint";
import { NetworkBuild3 } from "../components/viz/networkBuild3";
import { processFullNetwork } from "../components/viz/processNetworkV4";
import { NetworkTagFilters } from "../components/viz/networkTagFilters";
import { lighten } from "polished";
import { above } from "../styles/utilities/breakpoints";

// import stickybits from "stickybits";

const WaypointWrapper = styled.div`
  .graphic {
    flex-basis: 60%;
    height: 100vh;
    position: sticky;
    top: 10px;
    z-index: 10;
    /* background: cornflowerblue; */
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  /* .description {
    height: 600px;
    text-align: center;
    padding: 50px 50px;
    font-size: 20px;
  } */
  .container {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  .scroller {
    flex-basis: 35%;
    z-index: 100;
    pointer-events: none;
  }

  /* .trigger {
    border-top: 1px dashed #eee;
    top: 0;
    margin-top: 33vh;
    position: fixed;
    width: 100%;
    color: #ccc;
    z-index: -1000;
  } */

  ${above.md} {
    .container {
      flex-direction: row;
    }
    /* .step {
      &:last-child {
        margin-bottom: 200px;
      }
    } */
  }

  /* ${above.lg} {
    .graphic {
      flex-basis: 60%;
    }
    .container {
      flex-direction: row;
    }
  } */
`;

const WaypointContent = styled.div`
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.8);

  margin-bottom: 90vh;
  pointer-events: all;

  ${above.md} {
    margin-bottom: 200px;
  }

  /* &::after {
    content: "";
    display: block;
    height: 400px;
  } */

  .forecast-highlights {
    strong {
      padding: 0 0.25rem;
      white-space: nowrap;
    }
  }

  h2 {
    margin-top: 1rem;
    /* color: lightgrey; */
    background: white;
  }

  transition: all 1s ease;

  &.active {
    /* color: inherit; */
    h2 {
      /* color: ${(props) => props.theme.colors.red}; */
    }

    .amplified-actions {
      background-color: ${(props) =>
        lighten(0.2, props.theme.forecast.amplified_actions)};
    }
    .optimized-insights {
      background-color: ${(props) =>
        lighten(0.2, props.theme.forecast.optimized_insights)};
    }
    .expansive-views {
      background-color: ${(props) =>
        lighten(0.2, props.theme.forecast.expansive_views)};
    }
    .wild-well {
      background-color: ${(props) =>
        lighten(0.2, props.theme.forecast.wild_well)};
    }
    .resilient {
      background-color: ${(props) =>
        lighten(0.2, props.theme.forecast.resilient)};
    }
    .urban-innovation {
      background-color: ${(props) =>
        lighten(0.2, props.theme.forecast.urban_innovation)};
    }
  }
`;

export const ScrollNetworkIntro = ({ data, markdownMap }) => {
  // const [selectedVizMode, setVizMode] = React.useState("trend")

  // console.log("data")
  // console.log(data)
  // let dataset = processNetwork3(data)
  let dataset = processFullNetwork(data.forecasts.nodes);

  // console.log("dataset")
  // console.log(dataset)

  // const [selectedNodes, setSelectedNodes] = React.useState([])
  const [selectedNodeIds, setSelectedNodeIds] = React.useState([]);
  const [highlighting, setHighlighting] = React.useState(false);

  const filterUpdate = React.useCallback((results, selected) => {
    // console.log("NODES UPDATE")
    // setSelectedNodes(results)
    setSelectedNodeIds(results.map((d) => d.id));
    setHighlighting(selected.sectors.length > 0 || selected.tags.length > 0);
  }, []);

  const [selectedX, setX] = React.useState("none");
  const [selectedY, setY] = React.useState("none");
  const [selectedS, setS] = React.useState("none");
  const [selectedView, setView] = React.useState("none");
  // const [selectedNodes, setNodes] = React.useState(dataset.nodes)
  // const [selectedLinks, setLinks] = React.useState(dataset.links)

  const [colorForecast, setColorForecast] = React.useState(false);

  const [nodeSelection, setNodeSelection] = React.useState("none");
  const nodeHandleSelection = React.useCallback((node) => {
    setNodeSelection(node.id);
  }, []);

  const stepUpdate = React.useCallback((view) => {
    //console.log(`Activate: ${view}`)
    // setVizMode(view)
    setView(view);

    if (view === "forecasts" || view === "forecaststrends") {
      setColorForecast(true);
    } else {
      setColorForecast(false);
    }

    if (view === "trends") {
      setX("timeframe");
      setY("certainty");
      setS("impact");
    } else {
      setX("none");
      setY("none");
      setS("none");
    }
  });

  let wpTopOffset = "40%";
  let wpBottomOffset = "40%";

  // useEffect(() => {
  //   var trendCountRefs = document.getElementsByClassName("trend-count")
  //   for (var i = 0; i < trendCountRefs.length; i++) {
  //     trendCountRefs[i].innerHTML = trend_count
  //   }
  // })

  useEffect(() => {
    // console.log("NUMBERS")
    // console.log(dataset.counts.trends)
    let trendCountRefs = document.getElementsByClassName("trend-count");
    for (let i = 0; i < trendCountRefs.length; i++) {
      trendCountRefs[i].innerHTML = dataset.counts.trends;
    }

    let sectorCountRefs = document.getElementsByClassName("sector-count");
    for (let i = 0; i < trendCountRefs.length; i++) {
      sectorCountRefs[i].innerHTML = dataset.counts.sectors;
    }

    // var signalCountRefs = document.getElementsByClassName("signal-count")
    // for (var i = 0; i < trendCountRefs.length; i++) {
    //   signalCountRefs[i].innerHTML = dataset.counts.signals
    // }

    let totalCountRefs = document.getElementsByClassName("total-count");
    for (let i = 0; i < totalCountRefs.length; i++) {
      totalCountRefs[i].innerHTML = dataset.counts.total;
    }

    // StickyBits Polyfill
    // console.log("stickybits")
    // console.log(stickybits)
    // stickybits(".graphic", { useStickyClasses: true });
  });

  return (
    <>
      <WaypointWrapper>
        <div className="trigger"></div>
        <div className="container">
          <div className="graphic">
            {/* <p>Network View {selectedVizMode}</p> */}

            <NetworkBuild3
              vizId={"networkVizScrolling"}
              height={600}
              scaling={true}
              vizContext={"scolling"}
              linksData={dataset.links}
              nodesData={dataset.nodes}
              // linksData={selectedLinks}
              // nodesData={selectedNodes}ß
              highlighting={highlighting}
              selectedNodeIds={selectedNodeIds}
              selectedX={selectedX}
              selectedY={selectedY}
              selectedS={selectedS}
              selectedView={selectedView}
              colorForecast={colorForecast}
              // nodeHighlight={selectedSector}
              // nodeHoverTooltip={nodeHoverTooltip}
              nodeSelection={nodeSelection}
              nodeHandleSelection={nodeHandleSelection}
            />
          </div>
          <div className="scroller">
            <div style={{ height: "300px" }}></div>
            <WaypointStep
              step={"network"}
              stepUpdate={stepUpdate}
              topOffset={wpTopOffset}
              bottomOffset={wpBottomOffset}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: markdownMap.get("intro-scroll-network")?.html,
                }}
              />
            </WaypointStep>
            <WaypointStep
              step={"forecasts"}
              stepUpdate={stepUpdate}
              topOffset={wpTopOffset}
              bottomOffset={wpBottomOffset}
            >
              <div
                className={"forecast-highlights"}
                dangerouslySetInnerHTML={{
                  __html: markdownMap.get("intro-scroll-forecasts")?.html,
                }}
              />
            </WaypointStep>
            <WaypointStep
              step={"forecaststrends"}
              stepUpdate={stepUpdate}
              topOffset={wpTopOffset}
              bottomOffset={wpBottomOffset}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: markdownMap.get("intro-scroll-trends")?.html,
                }}
              />
            </WaypointStep>
            <WaypointStep
              step={"trends"}
              stepUpdate={stepUpdate}
              topOffset={wpTopOffset}
              bottomOffset={wpBottomOffset}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: markdownMap.get("intro-scroll-trend-details")?.html,
                }}
              />
            </WaypointStep>
            <WaypointStep
              step={"network"}
              stepUpdate={stepUpdate}
              topOffset={wpTopOffset}
              bottomOffset={wpBottomOffset}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: markdownMap.get("intro-scroll-sectors")?.html,
                }}
              />
              <div>
                <NetworkTagFilters
                  nodes={dataset.nodes}
                  filterUpdate={filterUpdate}
                  filterTypes={{ sectors: true, tags: false }}
                ></NetworkTagFilters>
              </div>
            </WaypointStep>
            <div style={{ height: "100px" }}></div>
          </div>
        </div>
        <div style={{ height: "100px" }}></div>
      </WaypointWrapper>
    </>
  );
};

const WaypointStep = ({
  step,
  stepUpdate,
  topOffset,
  bottomOffset,
  children,
}) => {
  const [stepActive, setStepActive] = React.useState(false);

  // this.ActiveWaypoint_
  const onEnter = () => {
    setStepActive(true);
    stepUpdate(step);
  };

  const onLeave = () => {
    setStepActive(false);
  };

  return (
    <Waypoint
      onEnter={onEnter}
      onLeave={onLeave}
      // scrollableAncestor={window}
      topOffset={topOffset}
      bottomOffset={bottomOffset}
    >
      <WaypointContent className={`step ${stepActive ? "active" : ""}`}>
        {children}
      </WaypointContent>
    </Waypoint>
  );
};
