import React from "react";
import { graphql } from "gatsby";
import Seo from "../components/seo";
import Layout from "../components/layout";
// import { NetworkBuildLanding } from "../components/viz/networkBuildLanding"
import { processNetwork3 } from "../components/viz/processNetworkV4";
import styled from "styled-components";
import { Link } from "gatsby";
// import * as d3 from "d3"
// import Select from "react-select"
// import { NetworkTagFilters } from "../components/viz/networkTagFilters"
// import { NetworkTagList } from "../components/viz/networkTagList"
// import { summarizeNodeTaxonomy } from "../components/viz/dataUtilities"
import { InsightPanel } from "../components/insight/insight-panel";
import {
  PageHeader,
  Section,
  Content,
  Row,
  Col,
} from "../styles/StyledElements";
import { FormSelect } from "../components/formSelect";
import { contentMapMarkdown } from "../components/pageUtilities";

const TrendDetails = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-radius: 0.5rem;
  background: #efefef;
  font-size: 0.85rem;
`;

export default function Landing({ location, data }) {
  const markdownMap = contentMapMarkdown(data.markdown.nodes);
  const mdNode = markdownMap.get("landing");
  //let dataset = processFullNetwork(data.forecasts.nodes);
  let dataset = processNetwork3(data);
  const title = "Insight Generator";
  // console.log("dataset")
  console.log(dataset);
  console.log(data.trends.nodes);

  const optionsSector = dataset.sectorKeys.map((d) => {
    let value = d;
    let label = d;
    return { value, label };
  });

  const optionsTrends = data.trends.nodes.map((d) => {
    let value = d.recordId;
    let label = d.data.Name;
    return { value, label };
  });
  const [selectedTrendID, setTrendID] = React.useState("none");
  const [selectedTrendNode, setTrendNode] = React.useState(
    dataset.lookup.get(optionsTrends[0].value)
  );

  function updateSelectedTrend(value) {
    setTrendID(value);
    setTrendNode(dataset.lookup.get(value));
    console.log("selectedTrendNode");
    console.log(dataset.lookup.get(value));
  }

  return (
    <Layout location={location}>
      <Seo title={title} />
      <PageHeader>
        <Content>
          <Row>
            <Col>
              <h1>{title}</h1>
            </Col>
          </Row>
        </Content>
      </PageHeader>
      <Section>
        <Content>
          <Row>
            <Col>
              <FormSelect
                id={"trend"}
                label={"Select Trend"}
                value={selectedTrendID}
                onChange={(e) => updateSelectedTrend(e.target.value)}
                options={optionsTrends}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <TrendDetails>
                <Row>
                  <Col>
                    {/* <h3>Trend: {selectedTrendNode.data.Name}</h3> */}
                    <div>Summary: {selectedTrendNode.data.Summary}</div>
                    <div>
                      Description:{" "}
                      {/* {
                        selectedTrendNode.data.Description?.childMarkdownRemark
                          ?.excerpt
                      } */}
                    </div>
                    {selectedTrendNode.data.Description && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            selectedTrendNode.data.Description
                              .childMarkdownRemark.html,
                        }}
                      />
                    )}
                    <div>Certainty: {selectedTrendNode.data.Certainty}</div>
                    <div>Impact: {selectedTrendNode.data.Impact}</div>{" "}
                  </Col>
                </Row>
              </TrendDetails>
            </Col>
          </Row>
          <Row>
            <Col>
              <InsightPanel
                trend={selectedTrendNode}
                optionsSector={optionsSector}
              ></InsightPanel>
            </Col>
          </Row>
        </Content>
      </Section>
    </Layout>
  );
}

export const query = graphql`
  {
    forecasts: allAirtable(
      filter: { table: { eq: "Forecasts" } }
      sort: { data: { Display_Order: ASC } }
    ) {
      nodes {
        recordId
        data {
          Name
          Category_Header
          Summary
          Display_Order
          #Impacts {
          #  recordId
          #  data {
          #    Name
          #  }
          # }
          Trends {
            recordId
            data {
              Name
              Visibility
              Summary
              #Description
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
          Image {
            localFiles {
              childImageSharp {
                gatsbyImageData(placeholder: BLURRED)
              }
            }
          }
          Image_Alt_Description
          Image_Source_URL
          Image_Credit
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
            }
          }
          Description {
            childMarkdownRemark {
              html
              rawMarkdownBody
              excerpt
            }
          }
        }
      }
    }
    signals: allAirtable(
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
    site {
      siteMetadata {
        title
        description
      }
    }
    markdown: allMarkdownRemark(
      filter: { frontmatter: { section: { in: ["landing", "descriptions"] } } }
    ) {
      nodes {
        html
        frontmatter {
          ref
          section
          title
          link_text
        }
      }
    }
    # content: allAirtable(
    #   filter: {
    #     table: { eq: "Content" }
    #     # data: { Content_Ref: { eq: "introduction" } }
    #   }
    # ) {
    #   nodes {
    #     data {
    #       Content_Ref
    #       Content {
    #         childMarkdownRemark {
    #           rawMarkdownBody
    #           html
    #         }
    #       }
    #     }
    #   }
    # }
    # placeholder: file(relativePath: { eq: "placeholder.png" }) {
    #   childImageSharp {
    #     fluid {
    #       ...GatsbyImageSharpFluid
    #     }
    #   }
    # }
  }
`;
