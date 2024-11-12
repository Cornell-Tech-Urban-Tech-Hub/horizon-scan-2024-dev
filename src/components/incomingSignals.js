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

const SectionIncoming = styled.div`
  background-color: lightgrey;
  padding-top: 1rem;
  padding-bottom: 2rem;

  h2 {
    padding-top: 1rem;
    border-top: 2px solid #333333;
    margin-bottom: 0;
  }

  .learn-more {
    a:link,
    a:visited {
      color: inherit;
    }
  }

  .grid {
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
  }
`;

const StyledNodeRow = styled.div`
  border-top: 6px solid ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 1rem;
  // margin-bottom: 0.5rem;
  background-color: #efefef;

  display: flex;
  flex-direction: column;
  flex: 1 auto;

  h4 {
    margin: 0;
    line-height: 1.2;
    margin-bottom: 0.25rem;
  }

  .source {
    margin-top: auto;
    font-size: 0.8rem;
    a:link {
      color: inherit;
    }
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

export const IncomingSignals = ({ signals }) => {
  return (
    <SectionIncoming>
      <Content>
        <Row>
          <Col>
            <h2>Incoming Signals</h2>
            <div class="learn-more">
              <Link to="/incoming">Learn More</Link>
            </div>
          </Col>
        </Row>
        <div className="grid">
          {signals.map((node) => (
            <NodeRow key={node.recordId} node={node} />
          ))}
        </div>
      </Content>
    </SectionIncoming>
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
      <h4 class Name>
        {node.data.Name}
      </h4>
      <div className="source">
        Source:{" "}
        <a href={node.data.Signal_Source_URL} target="_blank" rel="noreferrer">
          {host}
        </a>
      </div>
    </StyledNodeRow>
  );
};
