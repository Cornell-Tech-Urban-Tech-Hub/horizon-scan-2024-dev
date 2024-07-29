import React, { useState } from "react";
import { graphql } from "gatsby";
// import Seo from "../components/seo";
import Layout from "../components/layout";
import { NetworkBuild3 } from "../components/viz/networkBuild3";
import { processNetwork3 } from "../components/viz/processNetworkV4";
import styled from "styled-components";
// import * as d3 from "d3"
// import Select from "react-select"
import { NetworkTagFilters } from "../components/viz/networkTagFilters";
// import { NetworkTagList } from "../components/viz/networkTagList"
// import { summarizeNodeTaxonomy } from "../components/viz/dataUtilities"
import { Section, Content, Row, Col } from "../styles/StyledElements";
// import Select from "react-select"
import { contentMapMarkdown } from "../components/pageUtilities";
import { FormSelect } from "../components/formSelect";

import { FilteredOutline } from "../components/filteredOutline";

// const SelectionBox = styled.div`
//   display: none;
//   position: absolute;
//   top: 10px;
//   left: 10px;
//   width: 200px;
//   padding: 10px;
//   border-radius: 6px;
//   background-color: rgba(240, 240, 240, 0.8);
//   z-index: 400;
// `

const NetworkInterface = styled.div`
  font-family: ${({ theme }) => theme.type.sans};
`;

const CustomOptions = styled.div`
  margin-top: 1rem;
  min-height: 20px;
  padding: 9px;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 5%);

  h4 {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

const NetworkWrapper = styled.div`
  position: relative;
`;

// const FormGroup = styled.div`
//   display: block;
//   label {
//     display: block;
//   }
//   select {
//   }
// `

// const SelectGroup = styled.div`
//   display: inline-block;
//   margin-right: 1rem;
//   label {
//     color: hsl(0, 0%, 50%);
//   }
//   select {
//     min-width: 15ch;
//     max-width: 30ch;
//     border: 1px solid hsl(0, 0%, 80%);
//     border-radius: 0.25em;
//     padding: 2px 8px;
//     cursor: pointer;
//     background-color: #fff;
//     border-radius: 4px;
//   }
// `

const optionsLayout = [
  { value: "network", label: "Network" },
  { value: "grid", label: "Trend Grid" },
  { value: "custom", label: "Custom" },
];

const optionsView = [
  { value: "network", label: "Full Network" },
  { value: "forecasts", label: "Forecasts" },
  { value: "forecaststrends", label: "Forecasts + Trends" },
  { value: "trends", label: "Trends" },
];

const optionsX = [
  { value: "none", label: "None" },
  { value: "timeframe", label: "Timeframe" },
  { value: "certainty", label: "Certainty" },
  { value: "impact", label: "Impact" },
];

const optionsY = [
  { value: "none", label: "None" },
  { value: "certainty", label: "Certainty" },
];

const optionsS = [
  { value: "none", label: "None" },
  { value: "impact", label: "Impact" },
];

// Force Trend Based
// const VizContainer = styled.div`
//   background: #eee;
// `

export default function Explorer({ location, data }) {
  // console.log(data)
  // let dataset = processFullNetwork(data.forecasts.nodes);
  let dataset = processNetwork3(data);

  // console.log("dataset")
  // console.log(dataset)

  // const [selectedNodes, setSelectedNodes] = useState([])
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [highlighting, setHighlighting] = useState(false);

  const filterUpdate = React.useCallback((results, selected) => {
    // console.log("NODES UPDATE")
    // setSelectedNodes(results)
    setSelectedNodeIds(results.map((d) => d.id));
    setHighlighting(selected.sectors.length > 0 || selected.tags.length > 0);
  }, []);

  // const nodeHoverTooltip = React.useCallback(node => {
  //   return `<div>${node.type}: <strong>${node.name}</strong></div>`
  // }, [])

  // const nodeHandleSelection = React.useCallback(node => {
  //   setNodeSelection(node.id)
  // }, [])

  // const [selectedSector, setSector] = React.useState("none")
  const [selectedX, setX] = React.useState("none");
  const [selectedY, setY] = React.useState("none");
  const [selectedS, setS] = React.useState("none");
  const [selectedLayout, setLayout] = React.useState("network");

  // const [selectedType, setType] = React.useState("all")
  const [selectedView, setView] = React.useState("network");
  // const [selectedNodes, setNodes] = React.useState(dataset.nodes)
  // const [selectedLinks, setLinks] = React.useState(dataset.links)
  // const [nodeSelection, setNodeSelection] = React.useState("none")

  function updateView(value) {
    setView(value);
    // console.log("UPDATE VIEW")
  }

  function updateLayout(value) {
    setLayout(value);

    if (value === "network") {
      setX("none");
      setY("none");
      setS("none");
    }

    if (value === "grid") {
      setX("timeframe");
      setY("certainty");
      setS("impact");
      updateView("trends");
    }

    if (value === "custom") {
      setX("timeframe");
      setY("none");
      setS("none");
    }

    // console.log("UPDATE LAYOUT")
  }

  const [selectionLayout, setSelectionLayout] = React.useState("network");

  // function handleChangeLayout(selectedOption) {
  //   setSelectionLayout(selectedOption.value)
  //   console.log(selectedOption.value)
  //   if (selectedOption.value === "network") {
  //     setX("none")
  //     setY("none")
  //     setS("none")
  //   }

  //   if (selectedOption.value === "grid") {
  //     setX("timeframe")
  //     setY("certainty")
  //     setS("impact")
  //   }

  //   if (selectedOption.value === "custom") {
  //     setX("timeframe")
  //     setY("none")
  //     setS("none")
  //   }
  // }

  const markdownMap = contentMapMarkdown(data.markdown.nodes);
  const title = markdownMap.get("explorer-intro")?.frontmatter.title;

  return (
    <Layout>
      {/* <Seo title={title} /> */}
      <Section>
        <Content>
          <Row>
            <Col>
              <h1>{title}</h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: markdownMap.get("explorer-intro")?.html,
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col size={3}>
              <NetworkWrapper>
                <NetworkBuild3
                  vizId={"networkViz"}
                  visContext={"explorer"}
                  scaling={true}
                  height={700}
                  linksData={dataset.links}
                  nodesData={dataset.nodes}
                  // linksData={selectedLinks}
                  // nodesData={selectedNodes}
                  highlighting={highlighting}
                  selectedNodeIds={selectedNodeIds}
                  selectedLayout={selectionLayout.value}
                  selectedX={selectedX}
                  selectedY={selectedY}
                  selectedS={selectedS}
                  selectedView={selectedView}
                  // colorForecast={true}
                  // nodeHighlight={selectedSector}
                  // nodeHoverTooltip={nodeHoverTooltip}
                  // nodeSelection={nodeSelection}
                  // nodeHandleSelection={nodeHandleSelection}
                />
              </NetworkWrapper>
            </Col>
            <Col>
              <NetworkInterface>
                {/* <FormGroup>
                <Select
                  //defaultValue={optionsLayout[0]}
                  defaultValue={"network"}
                  options={optionsLayout}
                  onChange={handleChangeLayout}
                />
              </FormGroup> */}
                <FormSelect
                  id={"layout"}
                  label={"Layout"}
                  value={selectedLayout}
                  onChange={(e) => updateLayout(e.target.value)}
                  options={optionsLayout}
                />

                {/* <SelectGroup>
                <label>
                  Layout:&nbsp;
                  <select
                    value={selectedLayout}
                    onChange={e => updateLayout(e.target.value)}
                  >
                    <option value="network">Network</option>
                    <option value="grid">Grid</option>
                    <option value="custom">Custom</option>
                  </select>
                </label>
              </SelectGroup> */}
                {selectedLayout === "custom" && (
                  <CustomOptions>
                    <h4>Custom Axis Selections</h4>
                    <FormSelect
                      id={"x-axis"}
                      label={"X Axis"}
                      value={selectedX}
                      onChange={(e) => setX(e.target.value)}
                      options={optionsX}
                    />
                    <FormSelect
                      id={"y-axis"}
                      label={"Y Axis"}
                      value={selectedY}
                      onChange={(e) => setY(e.target.value)}
                      options={optionsY}
                    />
                    <FormSelect
                      id={"bubble"}
                      label={"Bubble"}
                      value={selectedS}
                      onChange={(e) => setS(e.target.value)}
                      options={optionsS}
                    />
                  </CustomOptions>
                )}
                <FormSelect
                  id={"view"}
                  label={"View"}
                  value={selectedView}
                  onChange={(e) => updateView(e.target.value)}
                  options={optionsView}
                />
                {/* <SelectGroup>
                <label>
                  &nbsp;View:&nbsp;
                  <select
                    value={selectedView}
                    onChange={e => updateView(e.target.value)}
                  >
                    <option value="network">Full Network</option>
                    <option value="forecasts">Forecasts</option>
                    <option value="forecaststrends">Forecasts + Trends</option>
                    <option value="trends">Trends</option>
                  </select>
                </label>
              </SelectGroup> */}

                <NetworkTagFilters
                  nodes={dataset.nodes}
                  filterUpdate={filterUpdate}
                  filterTypes={{ sectors: true, tags: true }}
                ></NetworkTagFilters>
                <p className={"filter-notes"}>
                  <small>
                    Sectors and Tags appear on signals. Trends are highlighted
                    based on having a link to a highlighted signal.
                  </small>
                </p>
              </NetworkInterface>
            </Col>
          </Row>
        </Content>
      </Section>
      <Section>
        <Content>
          <Row>
            <Col>
              <FilteredOutline
                forecasts={data.forecasts}
                ids={selectedNodeIds}
              ></FilteredOutline>
            </Col>
          </Row>
        </Content>
      </Section>
    </Layout>
  );
}

export const query = graphql`
  {
    forecasts: allAirtable(filter: { table: { eq: "Forecasts" } }) {
      nodes {
        recordId
        data {
          Name
          Category_Header
          Summary
          Trends {
            recordId
            data {
              Name
              Visibility
              Summary
              # STEEP
              Time_Frame
              Certainty
              Impact
              # Research_Driver
              Signals {
                recordId
                data {
                  Name
                  Visibility
                  Sector
                  Tags
                }
              }
            }
          }
        }
      }
    }
    trends: allAirtable(filter: { table: { eq: "Trends" } }) {
      nodes {
        recordId
        data {
          Name
          Summary
          # STEEP
          Time_Frame
          Certainty
          Impact
          # Research_Driver
          Signals {
            recordId
            data {
              Name
              Visibility
              Sector
              Tags
            }
          }
        }
      }
    }
    signals: allAirtable(
      # filter: { table: { eq: "Signals" }, data: { Published: { eq: true } } }
      filter: {
        table: { eq: "Signals" }
        # data: { Visibility: { eq: "Published" } }
      }
    ) {
      nodes {
        recordId
        data {
          Name
          Visibility
          Sector
          Tags
        }
      }
    }
    markdown: allMarkdownRemark(
      filter: { frontmatter: { section: { eq: "explorer" } } }
    ) {
      nodes {
        html
        frontmatter {
          ref
          section
          title
        }
      }
    }
  }
`;
