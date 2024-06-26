import React from "react"
import { graphql } from "gatsby"
import Seo from "../components/seo"
import Layout from "../components/layout"
import {
  PageHeader,
  Section,
  Content,
  Row,
  Col,
} from "../styles/StyledElements"

export default function About({ location, data }) {
  const mdNode = data.allMarkdownRemark.edges[0].node

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
    </Layout>
  )
}

export const query = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/page-about.md/" } }
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
`
