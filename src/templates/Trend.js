import React, { useState } from "react";
import { graphql } from "gatsby";
import styled from "styled-components";

import Seo from "../components/seo";
import Layout from "../components/layout";
import Breadcrumbs from "../components/breadcrumbs";
import {
  Section,
  Content,
  SectionMeta,
  Row,
  Col,
} from "../styles/StyledElements";
import { ChartTrend } from "../components/viz/chartTrend";
import PageImageHeader from "../components/pageImageHeader";

import { processTrendNetwork } from "../components/viz/processNetworkV4";
import { NetworkBuild3 } from "../components/viz/networkBuild3";
import { NetworkTagListFilter } from "../components/viz/networkTagListFilter";
// import { summarizeNodeTaxonomy } from "../components/viz/dataUtilities"
// import { ListTagsCounted } from "../components/listTags"
import { contentMapMarkdown } from "../components/pageUtilities";
import { SectionCardsLeft } from "../components/cardLayout";

const labelSet = require("../content/labels");

const PageHeader = styled.header``;

const ChartWrapper = styled.div`
  h4 {
    margin-top: 1rem;
  }
`;

export default function Trend({ data: { node, markdown } }) {
  // console.log(airtable.data)
  // console.log("LABELSET")
  // console.log({ labelSet })

  const networkData = processTrendNetwork(node);
  const markdownMap = contentMapMarkdown(markdown.nodes);

  // console.log(networkData)
  // const tagCounts = summarizeNodeTaxonomy(networkData.nodes, "tagsArray")
  // const sectorCounts = summarizeNodeTaxonomy(networkData.nodes, "sectorsArray")

  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [highlighting, setHighlighting] = useState(false);
  const filterUpdate = React.useCallback((results, selected) => {
    // console.log("NODES UPDATE")
    // console.log(results)
    //setSelectedNodes(results)
    setSelectedNodeIds(results.map((d) => d.id));
    setHighlighting(selected.sectors.length > 0 || selected.tags.length > 0);
  }, []);

  return (
    // <Layout location={location}>
    <Layout>
      <Seo title={`Trend: ${node.data.Name}`} />
      <PageHeader>
        <Breadcrumbs node={node} type={"trend"} />
        <PageImageHeader node={node} />
      </PageHeader>
      <Section>
        <Content>
          <Row>
            <Col size={1}>
              <blockquote className={"statement"}>
                <p>{node.data.Summary}</p>
              </blockquote>
            </Col>
          </Row>
          <Row>
            <Col size={1}>
              <ChartWrapper>
                <h4>{labelSet.trends.chart_title}</h4>
                <ChartTrend trend={node.data} />
              </ChartWrapper>
            </Col>
            <Col size={2}>
              {node.data.Description && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: node.data.Description.childMarkdownRemark.html,
                  }}
                />
              )}
            </Col>
          </Row>
        </Content>
      </Section>
      <SectionCardsLeft
        nodes={node.data.Signals}
        type={"signal"}
        heading={markdownMap.get("description-signals")?.frontmatter.title}
        description={markdownMap.get("description-signals")}
      />
      <SectionMeta>
        <Content>
          <Row>
            <Col>
              <h3>{labelSet.trends.metadata_section_heading}</h3>
            </Col>
          </Row>
          <Row>
            <Col size={1}>
              {/* <div>
                Steep: <strong>{node.data.STEEP}</strong>
              </div> */}
              <div className="categories">
                <ul>
                  <li>
                    Certainty: <strong>{node.data.Certainty}</strong>
                  </li>
                  <li>
                    Time Frame: <strong>{node.data.Time_Frame}</strong>
                  </li>
                  <li>
                    Impact: <strong>{node.data.Impact}</strong>
                  </li>
                  {/* <li>
            Research Driver:&nbsp;
            <strong>{node.data.Research_Driver?.join(", ")}</strong>
          </li> */}
                </ul>
              </div>
            </Col>
            <Col size={1}>
              <NetworkBuild3
                vizId={"forecast-graph"}
                vizContext={"forecast"}
                scaling={false}
                height={150}
                linksData={networkData.links}
                nodesData={networkData.nodes}
                highlighting={highlighting}
                selectedNodeIds={selectedNodeIds}
              />
            </Col>
            <Col size={1}>
              <NetworkTagListFilter
                nodes={networkData.nodes}
                selectable={true}
                filterUpdate={filterUpdate}
              />
            </Col>
          </Row>
        </Content>
      </SectionMeta>
    </Layout>
  );
}

export const query = graphql`
  query Trend($recordId: String!) {
    node: airtable(recordId: { eq: $recordId }) {
      id
      data {
        Name
        Summary
        Description {
          childMarkdownRemark {
            rawMarkdownBody
            html
          }
        }
        # STEEP
        Time_Frame
        Certainty
        # Research_Driver
        Impact
        Signals {
          data {
            Name
            Visibility
            # Description {
            #   childMarkdownRemark {
            #     rawMarkdownBody
            #     html
            #   }
            # }
            Signal_Source_URL
            Sector
            Tags
            Image {
              localFiles {
                childImageSharp {
                  # fluid(maxWidth: 1000) {
                  #   ...GatsbyImageSharpFluid
                  # }
                  gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
                }
              }
            }
            Image_Alt_Description
            Image_Source_URL
            Image_Credit
          }
          recordId
        }
        Informs_Forecasts {
          recordId
          data {
            Name
          }
        }
        Image {
          localFiles {
            childImageSharp {
              # fluid(maxWidth: 1000) {
              #   ...GatsbyImageSharpFluid
              # }
              gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
            }
          }
        }
        Image_Alt_Description
        Image_Source_URL
        Image_Credit
      }
      recordId
    }
    markdown: allMarkdownRemark(
      filter: { frontmatter: { section: { in: ["descriptions"] } } }
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
  }
`;
