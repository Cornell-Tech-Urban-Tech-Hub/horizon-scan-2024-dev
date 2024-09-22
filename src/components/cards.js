import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
// import Img from "gatsby-image"
import { StaticImage, GatsbyImage, getImage } from "gatsby-plugin-image";
// import CardReadMore from "../components/cardReadMore"
// import CardFooter from "../components/cardFooter"
import { ListTagsSmall } from "./listTags";
// import { CardGrid } from "../styles/StyledElements"
// import { Button } from "./button"
// import { above, below } from "../styles/utilities/breakpoints"
import { SourceLink } from "./sourceLink";
const { slugFormat } = require("../utilities/slugFormat");

export const CardBase = styled.div`
  .card-link {
    color: inherit;
    text-decoration: none;
  }
  display: flex;
  flex: auto;
  /* a:link,
  a:visited {
    color: inherit;
    text-decoration: none;
    display: flex;
    flex: auto;
  } */

  a:hover h3 span {
    transition: all 0.5s ease;
    background-color: ${({ theme }) => theme.colors.primary};
    box-shadow:
      10px 0 0 ${({ theme }) => theme.colors.primary},
      -10px 0 0 ${({ theme }) => theme.colors.primary};
    color: white;
  }

  position: relative;
  display: flex;
  flex: 1;
  /* width: 100%; */
  flex-direction: column;

  .card-inner {
    display: flex;
    flex-direction: column;
    flex: 1 auto;
  }

  /* @supports (display: grid) {
    margin-right: 0;
    margin-bottom: 0;
    width: auto;
  } */

  .card-content {
    padding: 1rem;
    background-color: #eee;
    display: flex;
    flex-direction: column;
    flex: auto;

    a:link {
    }
  }

  .card-footer {
    padding: 1rem;
  }

  .card-image {
    height: 240px;
    position: relative;
  }

  .card-summary {
    font-family: ${({ theme }) => theme.type.serif_alt};
    font-weight: bold;
  }

  /* .card-content .static {
    min-height: 5rem;
  } */

  &.full {
    background-color: #eee;
    .card-description {
      font-size: 0.9rem;
      line-height: 1.4;
      flex: auto;
    }
  }
`;

export const StyledCard = styled(CardBase)`
  box-shadow: 0 2px 40px 0 rgb(0 0 0 / 7%);
  transition:
    box-shadow 0.3s ease-out,
    transform 0.3s ease-out,
    opacity 0.2s ease-out;
  transition-delay: 0.1s;
  transform: translateZ(0);

  &:hover {
    box-shadow:
      rgb(45 45 45 / 5%) 0px 2px 2px,
      rgb(49 49 49 / 5%) 0px 4px 4px,
      rgb(42 42 42 / 5%) 0px 8px 8px,
      rgb(32 32 32 / 5%) 0px 16px 16px,
      rgb(49 49 49 / 5%) 0px 32px 32px,
      rgb(35 35 35 / 5%) 0px 64px 64px;
    transform: translate(0, -4px);
    z-index: 999;
  }

  /* .card-image {
    transition: all 0.25s ease-out;
    &:hover {
      opacity: 0.7;
    }
  } */

  h3 {
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 1.6rem;
    line-height: 1.3;
    margin-top: 0;
    max-width: 80%;
    span {
      background-color: white;
      box-shadow:
        10px 0 0 white,
        -10px 0 0 white;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }
  }
`;

const StyledCardImpact = styled(CardBase)`
  display: flex;
  flex-direction: column;
  h3 {
    font-size: 1.6rem;
    line-height: 1.3;
    margin-top: 0;
    margin-bottom: 0.25rem;
  }

  .card-who {
    font-family: ${({ theme }) => theme.type.serif_alt};
  }

  .image-credit {
    font-size: 0.8rem;
    color: #777;
  }
`;

// const SignalSourceLink = styled.a`
//   font-family: ${({ theme }) => theme.type.sans};
//   font-size: 0.9rem;

//   display: block;
//   padding: 0.25rem 0.5rem;
//   border-radius: 0.5em;
//   background-color: lightgrey;
//   transition: all 0.5s ease;
//   text-decoration: none;
//   color: inherit;

//   &:hover {
//     /* opacity: 0.7; */
//     background-color: ${props => props.theme.colors.primary};
//     color: #fff;
//   }
// `

export const CardForecast = ({ node }) => {
  //let nodePath = `/forecasts/${node.recordId}`
  let nodePath = `/forecasts/${slugFormat(node.data.Name)}`;
  return (
    <StyledCard>
      <Link to={nodePath} className="card-inner card-link">
        <CardImage node={node} />
        <h3>
          <span>{node.data.Name}</span>
        </h3>
        <div className="card-content">
          <div className="card-summary">{node.data.Summary}</div>
        </div>
      </Link>
    </StyledCard>
  );
};

// export const CardTrend = ({ node }) => {
//   return (
//     <StyledCard>
//       <div className="card-inner">
//         <Link to={`/trends/${node.recordId}`}>
//           <CardImage node={node} />

//           <h3>
//             <span>{node.data.Name}</span>
//           </h3>
//         </Link>
//         <div className="card-content">
//           <div className="card-summary">
//             <strong>{node.data.Summary}</strong>
//           </div>
//           <CardFooter
//             readmore={node.data.Description}
//             link={`/trends/${node.recordId}`}
//             linkText={"View Trend"}
//           ></CardFooter>
//         </div>
//       </div>
//     </StyledCard>
//   )
// }

export const CardTrend2 = ({ node, expanded }) => {
  //let nodePath = `/trends/${node.recordId}`
  let nodePath = `/trends/${slugFormat(node.data.Name)}`;
  const readmore = node.data.Description;
  return (
    <StyledCard className="full">
      <Link to={nodePath} className="card-inner card-link">
        <CardImage node={node} />
        <h3>
          <span>{node.data.Name}</span>
        </h3>

        <div className="card-content">
          <div className="card-summary">{node.data.Summary}</div>
          {expanded && readmore && (
            <div className={"card-description"}>
              <div
                dangerouslySetInnerHTML={{
                  __html: readmore.childMarkdownRemark.html,
                }}
              />
            </div>
          )}
        </div>
      </Link>
    </StyledCard>
  );
};

export const CardSignal2 = ({ node, expanded }) => {
  //let nodePath = `/trends/${node.recordId}`
  let nodePath = `/signals/${slugFormat(node.data.Name)}`;
  const readmore = node.data.Description;
  let url = node.data.Signal_Source_URL;

  return (
    <StyledCard className="full">
      <Link to={nodePath} className="card-inner card-link">
        <div className="card-header">
          <CardImage node={node} />
          <h3>
            <span>{node.data.Name}</span>
          </h3>
        </div>
        {expanded && readmore && (
          <div className="card-content">
            <div className="card-tags">
              <ListTagsSmall array={node.data.Sector} type="Sector" />
              <ListTagsSmall array={node.data.Tags} type="Tags" />
            </div>
            <div className={"card-description"}>
              <div
                dangerouslySetInnerHTML={{
                  __html: readmore.childMarkdownRemark.html,
                }}
              />
            </div>
            <div className="card-link">
              <SourceLink url={url} />
            </div>
          </div>
        )}
      </Link>
    </StyledCard>
  );
};

// Card Signal No Description
export const CardSignal3 = ({ node, expanded }) => {
  //let nodePath = `/trends/${node.recordId}`
  let nodePath = `/signals/${slugFormat(node.data.Name)}`;
  const readmore = node.data.Description;
  let url = node.data.Signal_Source_URL;

  return (
    <StyledCard className="full">
      <Link to={nodePath} className="card-inner card-link">
        <div className="card-header">
          <CardImage node={node} />
          <h3>
            <span>{node.data.Name}</span>
          </h3>
        </div>
        {expanded && readmore && (
          <div className="card-content">
            <div className="card-tags">
              <ListTagsSmall array={node.data.Sector} type="Sector" />
              <ListTagsSmall array={node.data.Tags} type="Tags" />
            </div>
            {/* <div className={"card-description"}>
              <div
                dangerouslySetInnerHTML={{
                  __html: readmore.childMarkdownRemark.html,
                }}
              />
            </div> */}
            <div className="card-link">
              <SourceLink url={node.data.Signal_Source_URL} />
            </div>
          </div>
        )}
      </Link>
    </StyledCard>
  );
};

export const CardImpact = ({ node }) => {
  // const image = getImage(node.data.Image?.localFiles[0])
  return (
    <StyledCardImpact className="full">
      <div className="card-inner">
        <div className="card-header">
          <CardImage node={node} />
        </div>
        <div className="card-content">
          <h3>
            <span>{node.data.Name}</span>
          </h3>
          <div className="card-who">
            Who: <strong>{node.data.Who}</strong>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: node.data.Description.childMarkdownRemark.html,
            }}
          />
        </div>
        <div className="card-footer image-credit">
          {`Image: ${
            node.data.Image_Credit ? node.data.Image_Credit : "Add Image Credit"
          }`}
        </div>
      </div>
    </StyledCardImpact>
  );
};

export const CardImage = ({ node }) => {
  const image = getImage(node.data.Image?.localFiles[0]);
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
          style={{ height: "240px" }}
        />
      ) : (
        <StaticImage
          style={{ height: "240px" }}
          src="../assets/placeholder.png"
          alt="Placeholder"
          layout="fullWidth"
        />
      )}
    </div>
  );
};
