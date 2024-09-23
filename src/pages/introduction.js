import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";
import {
  Section,
  SectionMeta,
  Content,
  Row,
  Col,
} from "../styles/StyledElements";
import { ScrollNetworkIntro } from "../components/scrollNetworkIntro";
import { contentMapMarkdown } from "../components/pageUtilities";

import { ImageGrid } from "../components/imageGrid";
import { SectionCardsLeft } from "../components/cardLayout";

import PageImageHeader from "../components/pageImageHeader";

export default function Introduction({ data, location }) {
  // const contentMap = contentMapAirtable(data.content.nodes)
  const markdownMap = contentMapMarkdown(data.markdown.nodes);
  //console.log(markdownMap)
  const title = "Introduction";

  return (
    <Layout location={location}>
      <Seo title={title} />
      <PageImageHeader
        type="local"
        title={title}
        image={data.cover.nodes[0]}
        credit={"Credit: Cash Macanaya on Unsplash"}
      />
      <Section>
        <Content>
          <Row>
            <Col>
              <blockquote className="statement">
                <p>
                  {markdownMap.get("intro-urbanization")?.frontmatter.title}
                </p>
              </blockquote>
            </Col>
            <Col size={2}>
              <div
                dangerouslySetInnerHTML={{
                  __html: markdownMap.get("intro-urbanization")?.html,
                }}
              />
            </Col>
          </Row>
        </Content>
      </Section>
      <Section>
        <ImageGrid nodes={data.trendimages.nodes}>
          <blockquote className={"statement"}>
            <p>
              <span>
                {markdownMap.get("intro-scroll-network")?.frontmatter.title}
              </span>
            </p>
          </blockquote>
        </ImageGrid>
      </Section>
      <SectionMeta>
        <Content>
          <ScrollNetworkIntro data={data} markdownMap={markdownMap} />
        </Content>
      </SectionMeta>
      <SectionCardsLeft
        nodes={data.forecasts.nodes}
        type={"forecast"}
        heading={markdownMap.get("description-forecasts")?.frontmatter.title}
        description={markdownMap.get("description-forecasts")}
      />
    </Layout>
  );
}

export const query = graphql`
  {
    forecasts: allAirtable(
      filter: { table: { eq: "Forecasts" } }
      sort: { order: ASC, fields: data___Display_Order }
    ) {
      nodes {
        recordId
        data {
          Name
          Category_Header
          Summary
          Display_Order
          # Impacts {
          #   recordId
          #   data {
          #     Name
          #   }
          # }
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
        }
      }
    }
    signals: allAirtable(
      filter: {
        table: { eq: "Signals" }
        data: { Visibility: { eq: "Published" } }
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
    trendimages: allAirtable(filter: { table: { eq: "Trends" } }) {
      nodes {
        recordId
        data {
          Name
          Image {
            localFiles {
              childImageSharp {
                gatsbyImageData(
                  height: 200
                  width: 200
                  quality: 100
                  layout: CONSTRAINED
                  placeholder: BLURRED
                  transformOptions: { grayscale: true }
                )
              }
            }
          }
        }
      }
    }
    cover: allFile(
      filter: { relativePath: { eq: "khara-woods-n4Lw7zArIk-unsplash.jpeg" } } # filter: { relativePath: { eq: "Urbanized-01.png" } }
    ) {
      nodes {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
        }
      }
    }
    markdown: allMarkdownRemark(
      filter: { frontmatter: { section: { in: ["intro", "descriptions"] } } }
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
