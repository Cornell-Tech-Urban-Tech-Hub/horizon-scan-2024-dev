import React, { useState } from "react";
import { graphql } from "gatsby";

import styled from "styled-components";

import Seo from "../components/seo";
import Layout from "../components/layout";
//import SectorsList from "../components/SectorsList"
// import Img from "gatsby-image"
import Breadcrumbs from "../components/breadcrumbs";

import {
  Section,
  Content,
  SectionMeta,
  Row,
  Col,
} from "../styles/StyledElements";

// import { StaticImage } from "gatsby-plugin-image"
import { processForecastNetwork } from "../components/viz/processNetworkV4";
import { NetworkBuild3 } from "../components/viz/networkBuild3";

import { SectionCardsLeft } from "../components/cardLayout";
// import PageSocialShare from "../components/pageSocialShare"
import { NetworkTagListFilter } from "../components/viz/networkTagListFilter";

import { contentMapMarkdown } from "../components/pageUtilities";
import PageImageHeader from "../components/pageImageHeader";

const PageHeader = styled.header``;

export default function Forecast({ location, data: { node, markdown } }) {
  const networkData = processForecastNetwork(node);
  // const contentMap = contentMapAirtable(content.nodes)
  const markdownMap = contentMapMarkdown(markdown.nodes);

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
    <Layout>
      <Seo title={`Forecast: ${node.data.Name}`} />
      <PageHeader>
        <Breadcrumbs node={node} type={"forecast"} />
        {/* <Breadcrumbs>
          <Row>
            <Col size={1}>
              <div className="content-tag">
                <strong>{`FORECAST | ${node.data.Category_Header}`}</strong>
              </div>
            </Col>
          </Row>
        </Breadcrumbs> */}
        <PageImageHeader node={node} />
      </PageHeader>
      <Section>
        <Content>
          <Row collapse={"lg"}>
            <Col size={1}>
              <blockquote className={"statement"}>
                <p>{node.data.Summary}</p>
              </blockquote>
            </Col>
            <Col size={2} className="details">
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
      <SectionMeta>
        <Content>
          <Row>
            <Col size={1}>
              <NetworkBuild3
                vizId={"forecast-graph"}
                vizContext={"forecast"}
                scaling={false}
                height={300}
                linksData={networkData.links}
                nodesData={networkData.nodes}
                highlighting={highlighting}
                colorForecast={true}
                selectedNodeIds={selectedNodeIds}
              />
            </Col>
            <Col size={2} className="details">
              <h4>
                The <strong>{networkData.counts.trends}</strong> trends in this
                forecast are synthesized from{" "}
                <strong>{networkData.counts.signals}</strong> signals
              </h4>
              <NetworkTagListFilter
                nodes={networkData.nodes}
                selectable={true}
                filterUpdate={filterUpdate}
              />

              {/* <Tabs>
                <Tab title="Sectors">
                  <ListTagsCounted array={sectorCounts} type={"sector"} />
                </Tab>
                <Tab title="Tags">
                  <ListTagsCounted array={tagCounts} type={"tags"} />
                </Tab>
              </Tabs> */}
            </Col>
          </Row>
        </Content>
      </SectionMeta>
      {/* <StyledSection>
        <Content>
          <ForecastMeta>
            <div></div>
          </ForecastMeta>
        </Content>
      </StyledSection> */}
      <SectionCardsLeft
        nodes={node.data.Trends}
        type={"trend"}
        heading={markdownMap.get("description-trends")?.frontmatter.title}
        description={markdownMap.get("description-trends")}
      />
      {/* <Section>
        <Content>
          <h2 className="divider-center">Trends</h2>
          <CardsIntro
            className="center"
            dangerouslySetInnerHTML={{
              __html: contentMap.get("description_trends")?.data.Content
                .childMarkdownRemark.html,
            }}
          />
          <CardGrid>
            {airtable.data.Trends?.map(trend => (
              <CardTrend key={trend.recordId} node={trend}></CardTrend>
            ))}
          </CardGrid>
        </Content>
      </Section> */}
      <SectionCardsLeft
        nodes={node.data.Impacts}
        type={"impact"}
        heading={markdownMap.get("description-impacts")?.frontmatter.title}
        description={markdownMap.get("description-impacts")}
      />

      {/* <Section>
        <Content>
          <h2 className="divider-center">Impacts</h2>
          <CardsIntro
            dangerouslySetInnerHTML={{
              __html: contentMap.get("description_impacts")?.data.Content
                .childMarkdownRemark.html,
            }}
          />

          <CardGrid>
            {airtable.data.Impacts?.map(impact => (
              <CardImpact key={impact.recordId} node={impact} />
            ))}
          </CardGrid>
        </Content>
      </Section> */}
      {/* <Section>
        <Content>
          <PageSocialShare location={location} text={node.data.Name} />
        </Content>
      </Section> */}
    </Layout>
  );
}

export const query = graphql`
  query MyQuery($recordId: String!) {
    node: airtable(recordId: { eq: $recordId }) {
      recordId
      data {
        Name
        Category_Header
        Summary
        Description {
          childMarkdownRemark {
            rawMarkdownBody
            html
          }
        }
        Trends {
          recordId
          data {
            Name
            Summary
            Description {
              childMarkdownRemark {
                rawMarkdownBody
                html
              }
            }
            Signals {
              recordId
              data {
                Name
                Sector
                Tags
                # Sector_linked
              }
            }
            Image {
              localFiles {
                childImageSharp {
                  # fluid(maxWidth: 500) {
                  #   ...GatsbyImageSharpFluid
                  # }
                  gatsbyImageData(sizes: "500", placeholder: BLURRED)
                }
              }
            }
          }
        }
        # Impacts {
        #   recordId
        #   data {
        #     Name
        #     Who
        #     Description {
        #       childMarkdownRemark {
        #         rawMarkdownBody
        #         html
        #       }
        #     }
        #     Image {
        #       localFiles {
        #         childImageSharp {
        #           # fluid(maxWidth: 1000) {
        #           #   ...GatsbyImageSharpFluid
        #           # }
        #           gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
        #         }
        #       }
        #     }
        #     Image_Alt_Description
        #     Image_Source_URL
        #     Image_Credit
        #   }
        # }
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
    # placeholder: file(relativePath: { eq: "placeholder.png" }) {
    #   childImageSharp {
    #     fluid {
    #       ...GatsbyImageSharpFluid
    #     }
    #   }
    # }
  }
`;
