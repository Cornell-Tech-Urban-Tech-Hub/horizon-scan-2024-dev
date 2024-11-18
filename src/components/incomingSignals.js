import { Link } from "gatsby";
import React from "react";
import styled from "styled-components";
import { above, below } from "../styles/utilities/breakpoints";
// import { Link } from "gatsby"
// import Img from "gatsby-image"
// import { StaticImage, GatsbyImage, getImage } from "gatsby-plugin-image"
// import CardReadMore from "../components/cardReadMore"
// import CardFooter from "../components/cardFooter"
// import { ListTagsSmall, ListTagsCard } from "./listTags"
import outbound from "../assets/icon-outbound-link.svg";
import {
  Section,
  Content,
  Row,
  RowWrap,
  Col,
  ColCard,
  CardGrid,
} from "../styles/StyledElements";
import { lighten } from "polished";

import getHostName from "../utilities/getHostName";

const StyledSectionIncoming = styled.div`
  background-color: lightgrey;
  padding-top: 1rem;
  padding-bottom: 2rem;
  border-top: 2px solid #333333;

  h2 {
    padding-top: 1rem;
    margin-top: 0;
  }

  .description {
    font-size: 1.25rem;
    font-family: ${({ theme }) => theme.type.serif_alt};
    ${below.md} {
      font-size: 1rem;
    }
  }

  .learn-more {
    a:link,
    a:visited {
      color: inherit;
    }
  }
`;

const StyledIncomingGrid = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  ${above.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${above.md} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StyledIncomingCard = styled.div`
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

  border-top: 6px solid ${({ theme }) => theme.colors.primary};
  background-color: #efefef;

  padding: 0.5rem 1rem;
  display: flex;

  .card-inner {
    display: flex;
    flex: 1 auto;
    flex-direction: column;
    justify-content: stretch;
  }

  .card-link {
    color: inherit;
    text-decoration: none;

    .source {
      color: grey;
      margin-top: auto;
      font-size: 0.8rem;
      .icon {
        display: inline-block;
        width: 0.9rem;
        height: 0.9rem;
        background-image: url(${outbound});
        background-repeat: no-repeat;
        margin-right: 0.3rem;
        margin-bottom: -0.15rem;
      }
    }
  }

  h4 {
    margin: 0;
    line-height: 1.2;
    margin-bottom: 0.25rem;
  }
`;

const StyledCardsSet = styled.div`
  .options {
    margin-bottom: 1rem;
    &.centered {
      text-align: center;
    }
  }
`;

export const IncomingSignalsSection = ({ signals, heading, description }) => {
  return (
    <StyledSectionIncoming>
      <Content>
        <Row>
          <Col size={1}>
            <h2>{heading}</h2>
          </Col>
          <Col size={2}>
            <div
              className={"description"}
              dangerouslySetInnerHTML={{
                __html: description.html,
              }}
            />
          </Col>
        </Row>
        <IncomingSignalsGrid nodes={signals} />
        <Row>
          <Col>
            <Link to="/incoming">View More</Link>
          </Col>
        </Row>
      </Content>
    </StyledSectionIncoming>
  );
};

export const IncomingSignalsGrid = ({ nodes }) => {
  return (
    <StyledIncomingGrid>
      {nodes.map((node) => (
        <NodeRow key={node.recordId} node={node} />
      ))}
    </StyledIncomingGrid>
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
    <StyledIncomingCard>
      <a
        className="card-inner card-link"
        href={node.data.Signal_Source_URL}
        target="_blank"
        rel="noreferrer"
      >
        <h4 class Name>
          {node.data.Name}
        </h4>
        <div className="source">
          <span className="icon"></span>
          {host}
        </div>
      </a>
    </StyledIncomingCard>
  );
};
