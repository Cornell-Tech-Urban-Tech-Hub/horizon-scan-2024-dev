import React, { useEffect } from "react";
import styled from "styled-components";
import { Waypoint } from "react-waypoint";
import { Link } from "gatsby";
import cornellLogo from "../assets/vertical-jacobs-cornell-dark.svg";
import { above, below } from "../styles/utilities/breakpoints";
import { NetworkBuild4 } from "./viz/networkBuild4-cover";

const WaypointWrapper = styled.div`
  .container {
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    ${above.md} {
      flex-direction: row;
    }
  }

  .graphic {
    flex-basis: 60%;
    height: 100vh;
    position: sticky;
    top: 10px;
    z-index: 10;
    /* background: cornflowerblue; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .scroller {
    flex-basis: 35%;
    z-index: 100;
    pointer-events: none;
    ${below.md} {
      margin-top: -350px;
    }
  }

  /* .trigger {
    border-top: 1px dashed #eee;
    top: 0;
    margin-top: 33vh;
    position: fixed;
    width: 100%;
    color: #ccc;
    z-index: -1000;
  } */
`;

const NetworkWrapper = styled.div`
  svg {
    transform: scale(1.4);
    transition: transform 2s;
    width: 100%; // Was breaking IE display
    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      width: auto;
    }
  }

  &.cover-mode svg {
    transform: scale(2.4);
    pointer-events: none;
  }
`;

const WaypointContent = styled.div`
  padding: 1rem;
  margin-bottom: 70vh;
  pointer-events: all;

  &.step-standard {
    background-color: rgba(255, 255, 255, 0.85);
  }

  &.step-cover {
    padding: 0;
  }

  ${above.md} {
    margin-bottom: 200px;
  }

  h2 {
    margin-top: 1rem;
    background: white;
  }

  transition: all 1s ease;

  &.active {
  }
`;

const IntroWrapper = styled.div`
  ${below.md} {
    padding-right: 25%;
  }

  .title {
    margin-top: 1rem;
    z-index: 100;
    /* padding: 1rem; */
    pointer-events: none;
    padding-left: 10px;
    padding-right: 10px;

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
`;

const HeaderLogo = styled.div`
  position: absolute;
  right: 0;
  top: 20%;
  .logo {
    visibility: hidden;
    width: 80px;
    z-index: 4000;
    opacity: 0;
    transition: all 0.5s linear;
    &.cover-mode {
      visibility: visible;
      opacity: 1;
    }
  }
`;

export const LayoutNetworkCover = ({ site, dataset, mdNode }) => {
  const [selectedView, setView] = React.useState("all");
  const [categoryFocus, setCategoryFocus] = React.useState("all");

  const stepUpdate = React.useCallback((view) => {
    //console.log(`Activate: ${view}`)
    // setVizMode(view)
    setView(view);
    if (view === "cover") {
      setCategoryFocus("all");
      // setLabeling(false);
    } else {
      setCategoryFocus(view);
      // setLabeling(true);
    }
  });

  let wpTopOffset = "40%";
  let wpBottomOffset = "40%";

  return (
    <WaypointWrapper>
      <div className="trigger"></div>
      <div className="container">
        <div className="scroller">
          <WaypointStep
            type={"cover"}
            step={"cover"}
            stepUpdate={stepUpdate}
            topOffset={wpTopOffset}
            bottomOffset={wpBottomOffset}
          >
            <IntroWrapper>
              <div className="title">
                <h1>
                  <span>{site.siteMetadata?.title}</span>
                </h1>
                <div className="subtitle">{site.siteMetadata?.description}</div>
              </div>
            </IntroWrapper>
          </WaypointStep>

          <WaypointStep
            step={"all"}
            stepUpdate={stepUpdate}
            topOffset={wpTopOffset}
            bottomOffset={wpBottomOffset}
          >
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
          </WaypointStep>
          <div style={{ height: "100px" }}></div>
        </div>
        <div className="graphic">
          <NetworkWrapper
            className={selectedView === "cover" ? "cover-mode" : null}
          >
            <NetworkBuild4
              vizId={"networkViz"}
              visContext={"explorer"}
              scaling={true}
              height={700}
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
          <HeaderLogo>
            <img
              id={"main-logo"}
              className={`logo ${selectedView === "cover" ? "cover-mode" : ""}`}
              src={cornellLogo}
              alt="Cornell Tech Logo"
            />
          </HeaderLogo>
        </div>
      </div>
      <div style={{ height: "100px" }}></div>
    </WaypointWrapper>
  );
};

const WaypointStep = ({
  step,
  type = "standard",
  stepUpdate,
  topOffset,
  bottomOffset,
  children,
}) => {
  const [stepActive, setStepActive] = React.useState(false);

  // this.ActiveWaypoint_
  const onEnter = () => {
    setStepActive(true);
    stepUpdate(step);
  };

  const onLeave = () => {
    setStepActive(false);
  };

  return (
    <Waypoint
      onEnter={onEnter}
      onLeave={onLeave}
      // scrollableAncestor={window}
      topOffset={topOffset}
      bottomOffset={bottomOffset}
    >
      <WaypointContent
        className={`step step-${type} ${stepActive ? "active" : ""}`}
      >
        {children}
      </WaypointContent>
    </Waypoint>
  );
};
