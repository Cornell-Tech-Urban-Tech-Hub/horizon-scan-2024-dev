import PropTypes from "prop-types";
import React from "react";
// import styled from "styled-components"

import Navigation from "./navigation";

// import logo from "../images/gatsby-icon.png"

// const HeaderWrapper = styled.header`
//   background: ${props => props.theme.colors.primary};
//   img {
//     margin-bottom: 0;
//   }
// `
// const HeaderContainer = styled.div`
//   font-family: ${props => props.theme.type.sans};
//   margin: 0 auto;
//   max-width: 960;
//   padding: 1rem;
// `

const Header = ({ siteMetadata }) => (
  <>{<Navigation siteMetadata={siteMetadata} />}</>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
