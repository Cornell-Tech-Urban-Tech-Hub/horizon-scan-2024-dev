import React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";
import {
  PageHeader,
  Section,
  Content,
  Row,
  Col,
} from "../styles/StyledElements";

export default function PageNotFound() {
  const title = "404: Page Not found";
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
              <p>You just landed on a page that doesn't exist</p>
              <p>
                Return <Link to="/">Home</Link> or try the{" "}
                <Link to="/search">Search</Link>page.
              </p>
            </Col>
          </Row>
        </Content>
      </Section>
    </Layout>
  );
}
