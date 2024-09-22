import React from "react";
import styled from "styled-components";
import { below } from "../styles/utilities/breakpoints";
// import { Link } from "gatsby"
// import Img from "gatsby-image"
// import { StaticImage, GatsbyImage, getImage } from "gatsby-plugin-image"
// import CardReadMore from "../components/cardReadMore"
// import CardFooter from "../components/cardFooter"
// import { ListTagsSmall, ListTagsCard } from "./listTags"
import { Content, Row, RowWrap, Col, ColCard } from "../styles/StyledElements";
import { ButtonMore } from "./button";
import {
  CardTrend2,
  CardSignal2,
  CardSignal3,
  CardImpact,
  CardForecast,
} from "./cards";
import { lighten } from "polished";

const SectionCards = styled.div`
  background-color: lightgrey;

  /* background-color: ${(props) =>
    lighten(0.6, props.theme.colors.primary)}; */
  padding-top: 2rem;
  padding-bottom: 2rem;

  &.cards-impact {
    background-color: lightgrey;
  }

  h2 {
    font-size: 1.8rem;
    margin-top: 1rem;
  }
  .description {
    font-size: 1.25rem;
    font-family: ${({ theme }) => theme.type.serif_alt};
    ${below.md} {
      font-size: 1rem;
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

// export const CardsIntro = styled.div``

// export const CardIntroGrid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 2fr;
//   gap: 2rem;
//   grid-auto-rows: auto auto;
//   margin-bottom: 2rem;

//   @media (max-width: 600px) {
//     grid-template-columns: 1fr;
//   }

//   .description {
//     font-size: 1.2rem;

//     &.centered {
//       font-size: 1.2rem;
//       margin-bottom: 2rem;
//       padding: 0 20%;
//       text-align: center;
//       ${below.laptop} {
//         padding: 0;
//       }
//     }
//   }
// `

export const CardsExpandable = ({ nodes, expanded = false, type }) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);
  return (
    <StyledCardsSet>
      <Row>
        <Col size={1}>
          <div className={"options"}>
            <ButtonMore
              className="collapse-button"
              onClick={() => setIsExpanded(!isExpanded)}
              isExpanded={isExpanded}
              openText={"Show Details"}
              closeText={"Hide Details"}
            />
          </div>
        </Col>
      </Row>

      <RowWrap>
        {nodes?.map((node) => (
          <ColCard key={node.recordId}>
            {type === "trend" && (
              <CardTrend2 node={node} expanded={isExpanded} />
            )}
            {type === "signal" && (
              <CardSignal3 node={node} expanded={isExpanded} />
            )}
          </ColCard>
        ))}
      </RowWrap>
    </StyledCardsSet>
  );
};

export const CardsSet = ({ nodes, type }) => {
  return (
    <StyledCardsSet>
      <RowWrap>
        {nodes?.map((node) => (
          <ColCard key={node.recordId}>
            {/* {type === "trend" && (
              <CardTrend node={node} expanded={isExpanded} />
            )} */}
            {/* {type === "signal" && (
              <CardSignal node={node} expanded={isExpanded} />
            )} */}
            {type === "impact" && <CardImpact node={node} />}
            {type === "forecast" && <CardForecast node={node} />}
          </ColCard>
        ))}
      </RowWrap>
    </StyledCardsSet>
  );
};

export const SectionCardsLeft = ({
  nodes,
  heading,
  description,
  type,
  expandable,
}) => {
  // console.log(nodes)
  return (
    <SectionCards className={`cards-${type}`}>
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
        {(type === "trend" || type === "signal") && (
          <CardsExpandable nodes={nodes} type={type} />
        )}
        {(type === "forecast" || type === "impact") && (
          <CardsSet nodes={nodes} type={type} />
        )}
        {nodes === null && (
          <Row>
            <Col>
              <p>No Cards</p>
            </Col>
          </Row>
        )}
      </Content>
    </SectionCards>
  );
};
