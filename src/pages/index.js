import React from "react";
import { graphql } from "gatsby";
import Seo from "../components/seo";
import Layout from "../components/layout";
// import { NetworkBuildLanding } from "../components/viz/networkBuildLanding"
import { NetworkBuild4 } from "../components/viz/networkBuild4-cover";
import {
  processNetwork3,
  processFullNetwork,
} from "../components/viz/processNetworkV4";
import styled from "styled-components";
import { Link } from "gatsby";
// import * as d3 from "d3"
// import Select from "react-select"
// import { NetworkTagFilters } from "../components/viz/networkTagFilters"
// import { NetworkTagList } from "../components/viz/networkTagList"
// import { summarizeNodeTaxonomy } from "../components/viz/dataUtilities"
import { Section, SectionCrop, Content } from "../styles/StyledElements";
import { below } from "../styles/utilities/breakpoints";
import cornellLogo from "../assets/vertical-jacobs-cornell-dark.svg";

import { contentMapMarkdown } from "../components/pageUtilities";
import { SectionCardsLeft } from "../components/cardLayout";

import { LayoutNetworkCover } from "../components/layoutNetworkCover";

const NetworkWrapper = styled.div`
  position: relative;
  z-index: 1;
`;
const IntroWrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 2fr;
  padding-bottom: 2rem;
  ${below.md} {
    grid-template-columns: 1fr;
  }

  .graphic {
    grid-row: span 2;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .title {
    margin-top: 4rem;
    z-index: 100;
    padding: 1rem;
    pointer-events: none;

    h1 {
      font-size: 3rem;
      line-height: 1.2;
      ${below.md} {
        font-size: 2.4rem;
      }
    }

    ${below.md} {
      margin-top: 0rem;
    }

    .subtitle {
      font-family: ${({ theme }) => theme.type.serif_alt};
      display: inline-block;
      font-size: 1.5rem;
      background-color: white;
      box-shadow:
        10px 0 0 white,
        -10px 0 0 white;
    }
  }

  .intro {
    align-self: start;
    z-index: 100;
    padding: 1rem;
  }
`;

export default function Landing({ location, data }) {
  const markdownMap = contentMapMarkdown(data.markdown.nodes);
  const mdNode = markdownMap.get("landing");
  //let dataset = processFullNetwork(data.forecasts.nodes);
  let dataset = processFullNetwork(data.forecasts.nodes);

  // console.log("dataset")
  // console.log(dataset)

  return (
    <Layout>
      {/* <Seo /> */}
      <SectionCrop>
        <Content>
          <LayoutNetworkCover
            site={data.site}
            dataset={dataset}
            mdNode={mdNode}
          />
        </Content>
      </SectionCrop>
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
              Time_Frame
              Certainty
              Impact
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
          NodeImage: Image {
            localFiles {
              childImageSharp {
                gatsbyImageData(
                  height: 200
                  width: 200
                  quality: 100
                  layout: CONSTRAINED
                  placeholder: BLURRED
                )
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
