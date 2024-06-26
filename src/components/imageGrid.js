import React from "react"
import styled from "styled-components"
import { StaticImage, GatsbyImage, getImage } from "gatsby-plugin-image"
import { sample } from "underscore"
import { below } from "../styles/utilities/breakpoints"
import { Content } from "../styles/StyledElements"

const ImageGridWrapper = styled.div`
  position: relative;
  margin-top: 6rem;
  margin-bottom: 2rem;
`

const Inner = styled.div`
  position: relative;
  z-index: 100;
  display: grid;
  grid-template-columns: 3fr 1fr;
  //grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;

  ${below.laptop} {
    grid-template-columns: 1fr;
  }

  blockquote {
    line-height: 1.6;
    span {
      padding: 0.25rem 0;
      background-color: white;
      box-shadow: 10px 0 0 white, -10px 0 0 white;
    }
  }
`

const Grid = styled.div`
  position: relative;
  z-index: 1;
  /* margin-top: -90px; */
  overflow-x: hidden;
  white-space: nowrap;
  margin-bottom: 4rem;
  /* display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr; */
`

const GridRow = styled.div`
  &.offset {
    padding-left: 6vw;
    /* ${below.laptop} {
      padding-left: 60px;
    } */
  }
  /* white-space: nowrap; */
  /* display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr; */
`

const StyledImage = styled.div`
  display: inline-block;
  .image-frame {
    height: 12vw; // 140
    width: 12vw;
    border-radius: 50%;
    margin-right: 10px;
    /* ${below.laptop} {
      height: 120px;
      width: 120px;
    } */
  }
`

// export const Statement = styled.div`
//   display: grid;
//   grid-template-columns: 2fr 1fr;
//   //grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
//   gap: 4rem;

//   @media (max-width: 600px) {
//     grid-template-columns: 1fr;
//   }
// `

export const ImageGrid = ({ nodes, children }) => {
  let nodeSubset = sample(nodes, 18)

  // console.log(nodeSubset)
  return (
    <ImageGridWrapper>
      <Grid>
        <GridRow>
          {nodeSubset.slice(0, 8)?.map(node => (
            <Image key={node.recordId} node={node} />
          ))}
        </GridRow>
        <GridRow className={"offset"}>
          {nodeSubset.slice(8, 16)?.map(node => (
            <Image key={node.recordId} node={node} />
          ))}
        </GridRow>
      </Grid>
      <Content>
        <Inner>{children}</Inner>
      </Content>
    </ImageGridWrapper>
  )
}

const Image = ({ node }) => {
  const image = getImage(node.data.Image?.localFiles[0])
  return (
    <StyledImage>
      {image ? (
        <GatsbyImage className={"image-frame"} image={image} alt="" />
      ) : (
        <StaticImage
          className={"image-frame"}
          src="../assets/placeholder.png"
          alt=""
        />
      )}
    </StyledImage>
  )
}
