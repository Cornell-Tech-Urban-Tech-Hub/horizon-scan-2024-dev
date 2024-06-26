import React from "react"
import styled from "styled-components"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage, GatsbyImage, getImage } from "gatsby-plugin-image"
import { ImageCredit } from "../styles/StyledElements"

export const StyledMasthead = styled.header`
  // grid-template-columns: 3fr 1fr;
  // grid-gap: 40px

  .tags {
    max-width: 90%;
  }
  .title-block {
    position: relative;
  }

  .image-block {
  }
  .main-image {
    height: 440px;
  }
`

export const Inner = styled.header`
  position: absolute;
  top: 0;
  width: 100%;
`

const Content = styled.div`
  margin: 0 auto;
  padding: 2rem 0;
  width: 90%;
  max-width: ${({ theme }) => theme.layout.maxWidth};

  h1 {
    font-size: 3rem;
    max-width: 80%;
    span {
      padding: 0.25rem 0;
      background-color: white;
      box-shadow: 10px 0 0 white, -10px 0 0 white;
    }
  }
  .subtitle {
    font-family: ${({ theme }) => theme.type.serif_alt};
    display: inline-block;
    font-size: 2rem;
    background-color: white;
    box-shadow: 10px 0 0 white, -10px 0 0 white;
  }
`

const Masthead = () => {
  const data = useStaticQuery(graphql`
    query MastheadQuery {
      site {
        siteMetadata {
          title
          description
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
    }
  `)

  const image = getImage(data.cover.nodes[0])

  return (
    <StyledMasthead>
      <div className="title-block">
        {/* <Img
            alt="Main Image"
            style={{ height: "360px" }}
            fluid={node.data.Image?.localFiles[0].childImageSharp?.fluid}
          /> */}
        {image ? (
          <GatsbyImage
            image={image}
            layout="fullWidth"
            className={"main-image"}
            alt="banner-image"
          />
        ) : (
          <StaticImage
            src="../assets/placeholder.png"
            layout="fullWidth"
            className={"main-image"}
            alt="banner-image"
          />
        )}
        <ImageCredit>{"Credit: Khara Woods on Unsplash"}</ImageCredit>
        <Inner>
          <Content>
            <h1>
              <span>{data.site.siteMetadata?.title}</span>
            </h1>
            <div className="subtitle">
              {data.site.siteMetadata?.description}
            </div>
          </Content>
        </Inner>
      </div>
    </StyledMasthead>
  )
}

export default Masthead
