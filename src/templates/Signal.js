import React from "react";
import { graphql } from "gatsby";
import styled from "styled-components";
import Seo from "../components/seo";
import Layout from "../components/layout";
import Breadcrumbs from "../components/breadcrumbs";
import { Section, Content, Row, Col } from "../styles/StyledElements";
import { ListTags } from "../components/listTags";
import PageImageHeader from "../components/pageImageHeader";
import { SourceLink } from "../components/sourceLink";

const SignalDetails = styled.div`
  padding-top: 1rem;

  a {
    margin-bottom: 2rem;
  }
`;

const PageHeader = styled.header``;

export default function Signal({ data: { node } }) {
  // console.log(airtable.data)
  let url = node.data.Signal_Source_URL;

  // let tree = processTree(node, "signal")
  // console.log(tree)

  return (
    // <Layout location={location}>
    <Layout>
      <Seo title={`Signal: ${node.data.Name}`} />
      <PageHeader>
        <Breadcrumbs node={node} type={"signal"} />
        <PageImageHeader node={node} />
      </PageHeader>
      <Section>
        <Content>
          <Row>
            <Col size={2}>
              {node.data.Description && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: node.data.Description.childMarkdownRemark.html,
                  }}
                />
              )}
              {/* {url && (
                <div>
                  <SignalSourceLink>View Signal Source</SignalSourceLink>
                  <br />
                  <small>{host}</small>
                </div>
              )} */}
            </Col>
            <Col size={1}>
              <SignalDetails>
                <SourceLink url={url} />
                <ListTags array={node.data.Sector} type="Sector" />
                <ListTags array={node.data.Tags} type="Tags" />
                {/* <h5>Informs Trend</h5>
                {node.data.Informs_Trends?.map(forecast => (
                  <div key={forecast.recordId}>
                    <Link to={`/trends/${forecast.recordId}`}>
                      <strong>{forecast.data.Name}</strong>
                    </Link>
                  </div>
                ))} */}
              </SignalDetails>
            </Col>
          </Row>
        </Content>
      </Section>
    </Layout>
  );
}

export const query = graphql`
  query Signal($recordId: String!) {
    node: airtable(recordId: { eq: $recordId }) {
      id
      data {
        Name
        Description {
          childMarkdownRemark {
            rawMarkdownBody
            html
          }
        }
        Sector
        Tags
        Signal_Source_URL
        Informs_Trends {
          recordId
          data {
            Name
            Informs_Forecasts {
              recordId
              data {
                Name
              }
            }
          }
        }
        # Image {
        #   localFiles {
        #     childImageSharp {
        #       # fluid(maxWidth: 1000) {
        #       #   ...GatsbyImageSharpFluid
        #       # }
        #       gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
        #     }
        #   }
        # }
        # Image_Alt_Description
        # Image_Source_URL
        # Image_Credit
      }
      recordId
    }
  }
`;
