import React, { useEffect } from "react";
import styled from "styled-components";
import { Waypoint } from "react-waypoint";
import { Link } from "gatsby";
import cornellLogo from "../assets/vertical-jacobs-cornell-dark.svg";
import { above, below } from "../styles/utilities/breakpoints";
import { NetworkBuild4 } from "./viz/networkBuild4-cover";
import {
  Section,
  SectionCrop,
  Content,
  Row,
  Col,
} from "../styles/StyledElements";

const SectionIntro = styled.div`
  background: linear-gradient(
    0deg,
    rgba(48, 153, 117, 0.15) 0%,
    rgba(48, 153, 117, 0) 100%
  );
  padding-bottom: 1rem;
`;

const IntroLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;

  ${above.md} {
    grid-auto-rows: auto;
    grid-template-columns: 2fr 3fr;
  }

  .intro {
    order: 3;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .title {
    flex-basis: 60%;
    margin-top: 1rem;
    z-index: 100;
    /* padding: 1rem; */
    pointer-events: none;
    padding-left: 1rem;
    padding-right: 1rem;

    h1 {
      font-size: 3rem;
      line-height: 1.2;
      ${below.md} {
        font-size: 2.4rem;
      }
      margin-bottom: 0.25rem;
      span {
        background-color: white;
        box-shadow:
          10px 0 0 white,
          -10px 0 0 white;
        box-decoration-break: clone;
      }
    }

    ${below.md} {
      margin-top: 0rem;
    }

    .subtitle {
      font-family: ${({ theme }) => theme.type.serif_alt};
      display: inline-block;
      font-size: 1.5rem;
      background-color: white;
      box-shadow:
        10px 0 0 white,
        -10px 0 0 white;
      margin-bottom: 2rem;
    }
  }

  .graphic {
    top: 10px;
    z-index: 10;
    /* background: cornflowerblue; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    ${above.md} {
      order: 2;
      grid-column: 2;
      grid-row: 1 / span 2;
    }
  }
`;

const NetworkWrapper = styled.div`
  svg {
    transform: scale(1);
    transition: transform 2s;
    //width: 100%; // Was breaking IE display
    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      width: auto;
    }
  }

  &.cover-mode svg {
    transform: scale(1.8);
    pointer-events: none;
  }
`;

export const LayoutCover = ({ site, dataset, mdNode }) => {
  return (
    <SectionIntro>
      <Content>
        <IntroLayout>
          <div className="title">
            <h1>
              <span>{site.siteMetadata?.title}</span>
            </h1>
            <div className="subtitle">{site.siteMetadata?.subtitle}</div>
          </div>
          <div className="intro">
            <div
              dangerouslySetInnerHTML={{
                __html: mdNode?.html,
              }}
            />
            <Link to={`/introduction`} title={"Read the Introduction"}>
              {mdNode?.frontmatter.link_text}
            </Link>
          </div>

          <div className="graphic">
            <NetworkWrapper>
              <NetworkBuild4
                vizId={"networkViz"}
                visContext={"explorer"}
                scaling={true}
                height={800}
                linksData={dataset.links}
                nodesData={dataset.nodes}
                colorForecast={true}
                introTransition={true}
                nodeImages={true}
                // linksData={selectedLinks}
                // nodesData={selectedNodes}
                // highlighting={highlighting}
                // selectedNodeIds={selectedNodeIds}
                // selectedLayout={selectionLayout.value}
                // selectedX={selectedX}
                // selectedY={selectedY}
                // selectedS={selectedS}
                // selectedView={selectedView}
                // nodeHighlight={selectedSector}
                // nodeHoverTooltip={nodeHoverTooltip}
                // nodeSelection={nodeSelection}
                // nodeHandleSelection={nodeHandleSelection}
              />
            </NetworkWrapper>
          </div>
        </IntroLayout>
      </Content>
    </SectionIntro>
  );
};
