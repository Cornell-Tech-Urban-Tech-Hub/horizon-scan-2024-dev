import React from "react";
import { graphql } from "gatsby";
import Seo from "../components/seo";
import Layout from "../components/layout";
import styled from "styled-components";
import { StaticImage, GatsbyImage, getImage } from "gatsby-plugin-image";
import { Link } from "gatsby";
import {
  PageHeader,
  Section,
  Content,
  Row,
  Col,
} from "../styles/StyledElements";
import { SourceLink } from "../components/sourceLink";
import getHostName from "../utilities/getHostName";

const { slugFormat } = require("../utilities/slugFormat");

const StyledNodeRow = styled.div`
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  background-color: #efefef;
  h3 {
    margin: 0;
  }
`;

export default function Incoming({ data, location }) {
  const mdNode = data.allMarkdownRemark.edges[0].node;

  return (
    <Layout location={location}>
      <Seo title={mdNode.frontmatter.title} />
      <PageHeader>
        <Content>
          <Row>
            <Col>
              <h1>{mdNode.frontmatter.title}</h1>
            </Col>
          </Row>
        </Content>
      </PageHeader>
      <Section>
        <Content>
          <Row>
            <Col>
              <div
                dangerouslySetInnerHTML={{
                  __html: mdNode.html,
                }}
              />
            </Col>
          </Row>
        </Content>
      </Section>
      <Section>
        <Content>
          <IncomingList data={data} />
        </Content>
      </Section>
    </Layout>
  );
}

export const query = graphql`
  {
    signals: allAirtable(
      filter: {
        table: { eq: "Signals" }
        data: { Visibility: { eq: "Screened" } }
      }
      sort: { data: { Created: ASC } }
    ) {
      nodes {
        recordId
        data {
          Name
          Visibility
          Created
          Signal_Source_URL
        }
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/incoming.md/" } }
    ) {
      edges {
        node {
          html
          fileAbsolutePath
          frontmatter {
            title
          }
        }
      }
    }
  }
`;

const IncomingList = ({ data }) => {
  // console.log(data);
  let signals = data.signals;
  return (
    <>
      {signals.nodes.map((node) => (
        <NodeRow key={node.recordId} node={node} />
      ))}
    </>
  );
};

const NodeRow = ({ node }) => {
  //let nodePath = `/forecasts/${node.recordId}`
  //let nodePath = `/forecasts/${slugFormat(node.data.Name)}`
  // console.log(node);
  let host = node.data.Signal_Source_URL
    ? getHostName(node.data.Signal_Source_URL)
    : null;

  return (
    <StyledNodeRow>
      <h3 class Name>
        {node.data.Name}
      </h3>
      Source:{" "}
      <a href={node.data.Signal_Source_URL} target="_blank" rel="noreferrer">
        {host}
      </a>
    </StyledNodeRow>
  );
};
