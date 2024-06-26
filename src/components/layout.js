import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import Header from "./header";
import Footer from "./footer";
// import "normalize.css"
// import { Helmet } from "react-helmet"
import styled, { ThemeProvider } from "styled-components";
import theme from "../styles/Theme";
import GlobalStyles from "../styles/GlobalStyles";
import Typography from "../styles/Typography";
// import { useCookieBar, siteVersion } from "../../config"
// import CookieBar from "./cookieBar"

const MainLayout = styled.main``;

const Layout = ({ children, location }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          description
          version
        }
      }
    }
  `);

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Typography />
        <Header siteMetadata={data.site.siteMetadata} />
        <MainLayout>{children}</MainLayout>
        <Footer siteMetadata={data.site.siteMetadata} />
        {/* {useCookieBar && <CookieBar />} */}
      </ThemeProvider>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

Layout.defaultProps = {
  location: {},
};

export default Layout;
