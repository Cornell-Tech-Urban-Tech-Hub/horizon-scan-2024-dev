import React from "react";
import { useStaticQuery, graphql } from "gatsby";
// import Headroom from "react-headroom"
import styled from "styled-components";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";

import { StaticImage, GatsbyImage, getImage } from "gatsby-plugin-image";
import { Row, Col } from "../styles/StyledElements";

import { below } from "../styles/utilities/breakpoints";

const { slugFormat } = require("../utilities/slugFormat");

const NavWrapper = styled.header`
  z-index: 1000;
  /* position: fixed;
  display: block;
  width: 100%; */
`;

const NavBar = styled.header`
  background: ${(props) => props.theme.colors.primary};
  img {
    margin-bottom: 0;
  }

  // Navbar Toggler Animated
`;

const Toggle = styled.button`
  border: none;
  padding: 0.25rem 0.75rem;
  background-color: transparent;
  border-radius: 0.25rem;

  .toggler-animated-icon {
    width: 30px;
    height: 20px;
    position: relative;
    margin: 0px;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: 0.5s ease-in-out;
    -moz-transition: 0.5s ease-in-out;
    -o-transition: 0.5s ease-in-out;
    transition: 0.5s ease-in-out;
    cursor: pointer;
  }

  // Icon

  .toggler-animated-icon {
    span {
      background: #fff;
      display: block;
      position: absolute;
      height: 3px;
      width: 100%;
      border-radius: 9px;
      opacity: 1;
      left: 0;
      transform: rotate(0deg);
      transition: 0.25s ease-in-out;
    }
    span:nth-child(1) {
      top: 0px;
    }
    span:nth-child(2),
    span:nth-child(3) {
      top: 10px;
    }
    span:nth-child(4) {
      top: 20px;
    }
    &.open {
      span:nth-child(1) {
        top: 11px;
        width: 0%;
        left: 50%;
      }
      span:nth-child(2) {
        transform: rotate(45deg);
      }
      span:nth-child(3) {
        transform: rotate(-45deg);
      }
      span:nth-child(4) {
        top: 11px;
        width: 0%;
        left: 50%;
      }
    }
  }
`;

const NavBarContent = styled.div`
  font-family: ${(props) => props.theme.type.sans};
  margin: 0 auto;
  width: 90%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  padding: 1rem 1rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;

  .nav-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    text-decoration: none;
    transition: all 0.25s ease;
    &:hover {
      opacity: 0.75;
    }
  }
  .nav-title-home {
    visibility: hidden;
  }
`;

const NavMenu = styled.div`
  background: ${(props) => props.theme.colors.primary};
  .collapse-button {
    display: block;
    width: 100%;
  }

  /* .collapse-content {
    transition: visibility 0s, opacity 0.5s linear;
  } */

  &.collapsed {
    display: none;
  }

  &.expanded {
    display: block;
  }
`;

const NavMenuContent = styled.header`
  margin: 0 auto;
  width: 90%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  padding: 2rem 0;
  margin: 0 auto;

  .forecast-wrapper {
    padding: 0.5rem 1rem;
    background: white;
    border-radius: 0.5rem;
  }

  .main-nav-item,
  h2 {
    font-family: ${(props) => props.theme.type.sans};

    font-size: 2rem;
    margin: 0 0 1rem;
  }

  h2 {
    color: grey;
    margin-top: 0;
    font-weight: 400;
  }

  .main-nav-item {
    padding: 0.5rem 1rem;
    display: block;
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
    background: white;
    border-radius: 0.5rem;

    transition: all 0.25s ease-out;
    &:hover {
      opacity: 0.5;
    }

    span {
      font-weight: 700;
    }
  }
`;

export const ForecastGrid = styled.div`
  /* display: grid;
  grid-template-columns: 1f; */
  /* grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); */
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  ${below.laptop} {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const Navigation = ({ siteMetadata, open = false }) => {
  const [isNavOpen, setIsNavOpen] = React.useState(open);
  const location = useLocation();

  const navData = useStaticQuery(graphql`
    query NavQuery {
      forecasts: allAirtable(
        filter: { table: { eq: "Forecasts" } }
        sort: { order: ASC, fields: data___Display_Order }
      ) {
        nodes {
          recordId
          data {
            Name
            Category_Header
            Summary
            Image {
              localFiles {
                childImageSharp {
                  gatsbyImageData
                }
              }
            }
            Image_Alt_Description
            Image_Source_URL
            Image_Credit
          }
        }
      }
    }
  `);

  // const toggleNav = React.useCallback(() => {
  //   console.log("TOGGLE NAV")
  //   setIsNavOpen(!isNavOpen)
  // })

  // function handleNavClick(event) {
  //   console.log("CLICKED")
  //   console.log(event)
  // }

  return (
    // <Headroom
    //   style={{ zIndex: 1000 }}
    //   className={`${isNavOpen ? "headroom--pinned" : ""}`}
    //   disable={isNavOpen ? true : false}
    // >
    <NavWrapper>
      <NavBar>
        <NavBarContent>
          <Link
            className={`nav-title ${
              location.pathname === "/" ? "nav-title-home" : ""
            }`}
            to="/"
            onClick={() => setIsNavOpen(false)}
          >
            {siteMetadata?.title}
          </Link>
          <Toggle
            className={`navbar-toggler ${isNavOpen ? "open" : "close"}`}
            onClick={() => setIsNavOpen(!isNavOpen)}
            type="button"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <div
              className={`toggler-animated-icon ${
                isNavOpen ? "open" : "close"
              }`}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </Toggle>
        </NavBarContent>
      </NavBar>

      <NavMenu
        className={`collapse-content ${isNavOpen ? "expanded" : "collapsed"}`}
        aria-expanded={isNavOpen}
      >
        <NavMenuContent>
          <Row collapse={"md"}>
            <Col size={1}>
              {/* <Link
                onClick={() => setIsNavOpen(!isNavOpen)}
                activeClassName="active-link"
                // onClick={e => handleNavClick}
                className="main-nav-item"
                to="/introduction"
              >
                Read the <span>introduction</span>
              </Link> */}
              <Link
                onClick={() => setIsNavOpen(!isNavOpen)}
                activeClassName="active-link"
                className="main-nav-item"
                to="/explorer/"
              >
                View the horizon scan <span>explorer</span>
              </Link>
            </Col>
            <Col size={2}>
              <div className="forecast-wrapper">
                <h2>Explore a forecast</h2>
                <ForecastGrid>
                  {navData.forecasts.nodes?.map((node) => (
                    <NavForecast
                      key={node.recordId}
                      node={node}
                      click={() => setIsNavOpen(!isNavOpen)}
                    ></NavForecast>
                  ))}
                </ForecastGrid>
              </div>
            </Col>
          </Row>
        </NavMenuContent>
      </NavMenu>
    </NavWrapper>
    // </Headroom>
  );
};

export default Navigation;

const StyledNavForecast = styled.div`
  position: relative;
  //box-shadow: rgb(0 0 0 / 15%) 0px 5px 15px;
  h4 {
    top: 20px;
    left: 20px;
    font-size: 1.3rem;
    line-height: 1.3;
    margin-top: 0;
    max-width: 80%;
    span {
      background-color: white;
      box-shadow:
        10px 0 0 white,
        -10px 0 0 white;
    }
  }

  .card-content {
    padding: 1rem 1rem 1rem 120px;
  }

  .card-image {
    position: absolute;
    .gatsby-image-wrapper {
      border-radius: 50%;
    }
  }

  a {
    display: block;
    opacity: 1;
    transition: all 0.25s ease-out;
    color: inherit;
    text-decoration: none;
    &:hover {
      opacity: 0.5;
    }
  }
`;

export const NavForecast = ({ node, click }) => {
  let nodePath = `/forecasts/${slugFormat(node.data.Name)}`;
  return (
    <StyledNavForecast>
      <Link onClick={click} to={nodePath}>
        <CardImage node={node} />
        <div className="card-inner">
          <div className="card-content">
            <h4>
              <span>{node.data.Name}</span>
            </h4>
            {node.data.Summary}
          </div>
        </div>
      </Link>
    </StyledNavForecast>
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
          style={{ height: "100px", width: "100px" }}
        />
      ) : (
        <StaticImage
          style={{ height: "100px", width: "100px" }}
          src="../assets/placeholder.png"
          alt="Placeholder"
        />
      )}
    </div>
  );
};
