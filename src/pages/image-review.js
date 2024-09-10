import React from "react"
import { graphql } from "gatsby"
import Seo from "../components/seo"
import Layout from "../components/layout"
import styled from "styled-components"
import { StaticImage, GatsbyImage, getImage } from "gatsby-plugin-image"
import { Link } from "gatsby"
import {
  PageHeader,
  Section,
  Content,
  Row,
  Col,
} from "../styles/StyledElements"
const { slugFormat } = require("../utilities/slugFormat")

const StyledNodeRow = styled.div`
  display: flex;
  flex-direction: row;
  /* margin-bottom: 1rem; */
  margin-bottom: 0.5rem;

  .low {
    font-weight: bold;
    color: red;
  }
  .med {
    font-weight: bold;
    color: orange;
  }
`

export default function ImageCheck({ data, location }) {
  const title = "Image Check"

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
          <ImageReviewListing data={data} />
        </Content>
      </Section>
    </Layout>
  )
}

export const query = graphql`
  {
    all: allAirtable(sort: { fields: data___Name, order: ASC }) {
      nodes {
        recordId
        data {
          Name
          Image {
            localFiles {
              childImageSharp {
                gatsbyImageData(sizes: "500", placeholder: BLURRED)
                original {
                  height
                  width
                  src
                }
              }
              extension
            }
          }
          Image_Alt_Description
          Image_Credit
          Image_Source_URL
        }
        table
      }
    }
  }
`

const ImageReviewListing = ({ data }) => {
  //console.log(data)
  let forcasts = data.all.nodes.filter(d => d.table === "Forecasts")
  let trends = data.all.nodes.filter(d => d.table === "Trends")
  let signals = data.all.nodes.filter(d => d.table === "Signals")
  let impacts = data.all.nodes.filter(d => d.table === "Impacts")
  return (
    <>
      <Row>
        <Col>
          <h2>Forecasts</h2>
        </Col>
      </Row>
      {forcasts.map(node => (
        <NodeRow key={node.recordId} node={node} />
      ))}
      <Row>
        <Col>
          <h2>Impacts</h2>
        </Col>
      </Row>
      {impacts.map(node => (
        <NodeRow key={node.recordId} node={node} />
      ))}
      <Row>
        <Col>
          <h2>Trends</h2>
        </Col>
      </Row>
      {trends.map(node => (
        <NodeRow key={node.recordId} node={node} />
      ))}
      <Row>
        <Col>
          <h2>Signals</h2>
        </Col>
      </Row>
      {signals.map(node => (
        <NodeRow key={node.recordId} node={node} />
      ))}
    </>
  )
}

const NodeRow = ({ node }) => {
  //let nodePath = `/forecasts/${node.recordId}`
  //let nodePath = `/forecasts/${slugFormat(node.data.Name)}`

  let file = node.data.Image?.localFiles[0]
  let ext = file?.extension

  let original = file?.childImageSharp?.original //

  let widthClass =
    original?.width < 1200 ? "low" : original?.width < 1600 ? "med" : ""

  //   console.log(file)

  return (
    <StyledNodeRow>
      <Col>
        <Image node={node} />
      </Col>
      <Col size={2}>
        <Link to={`/${node.table.toLowerCase()}/${slugFormat(node.data.Name)}`}>
          {node.data.Name}
        </Link>
        <div>
          Dimensions: <span className={widthClass}>W {original?.width}px</span>{" "}
          x H {original?.height}px ({ext})
        </div>
        <small>Alt Text: {node.data.Image_Alt_Description}</small>
        <small>
          Source:{" "}
          <a href={node.data.Image_Source_URL} target="_blank" rel="noreferrer">
            {node.data.Image_Credit}
          </a>
        </small>
      </Col>
    </StyledNodeRow>
  )
}

const Image = ({ node }) => {
  const image = getImage(node.data.Image?.localFiles[0])
  return (
    <div className="card-image">
      {image ? (
        <GatsbyImage
          image={image}
          alt={
            node.data.Image_Alt_Description
              ? node.data.Image_Alt_Description
              : "Add Description"
          }
          style={{ height: "120px" }}
        />
      ) : (
        <StaticImage
          style={{ height: "120px" }}
          src="../assets/placeholder.png"
          alt="Placeholder"
          layout="fullWidth"
        />
      )}
    </div>
  )
}
