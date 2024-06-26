import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import {
  PageHeader,
  Section,
  Content,
  Row,
  Col,
} from "../styles/StyledElements"

export default function PageNotFound() {
  const title = "404: Page Not found"
  return (
    <Layout>
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
              <p>You just hit a route that doesn&#39;t exist...</p>
            </Col>
          </Row>
        </Content>
      </Section>
    </Layout>
  )
}
