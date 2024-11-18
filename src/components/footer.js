import { Link } from "gatsby";
import React from "react";
import styled from "styled-components";
// import { StaticImage } from "gatsby-plugin-image"
import { useStaticQuery, graphql } from "gatsby";
// import { node } from "prop-types"

// import cornellLogo from "../assets/vertical-jacobs-cornell.svg";
import cornellLogoHorizontal from "../assets/horizontal-jacobs-cornell.svg";
import urbanaiLogo from "../assets/URBAN-AI-Logo-Blanc-02.png";
import { above, below } from "../styles/utilities/breakpoints";

const Row = styled.footer`
  display: flex;
  ${below.tablet} {
    flex-direction: column;
  }
  margin-bottom: 2rem;
`;

const StyledFooter = styled.footer`
  background: #333;
  padding: 3rem 5%;
  margin: 0 auto;
  color: #eee;

  a:link,
  a:visited {
    color: #fff;
    text-decoration: none;
  }

  h3 {
    margin-top: 0;
    font-size: 0.85rem;
  }

  .description p {
  }
`;

const Column = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
`;

const OuterGrid = styled.div`
  /* display: flex; */
  /* display: grid;
  grid-template-columns: 1fr 7fr;
  gap: 2rem; */
`;

const FooterLogos = styled.div`
  display: flex;
  /* grid-template-columns: 1fr 1fr 1fr 1fr; */
  gap: 3rem;
  ${below.md} {
    grid-template-columns: 1fr 1fr;
  }
  margin-bottom: 3rem;
  padding: 0 1rem;
`;

const FooterLogo = styled.div`
  display: inline-block;
  display: flex;

  .logo {
    max-height: 80px;
    width: 100%;
    max-width: 200px;
    align-self: center;
  }
`;

const InnerGrid = styled.div`
  flex: 5;
  font-size: 0.85rem;

  /* display: grid;
  grid-template-columns: 2fr 1fr;
  row-gap: 0rem;
  column-gap: 3rem; */

  ${below.md} {
    /* grid-template-columns: 1fr; */
  }

  .row {
    display: flex;
  }

  .description {
    flex: 2;
  }
`;

const FooterNav = styled(Column)`
  flex: 1;

  font-family: ${({ theme }) => theme.type.sans};
  font-weight: 700;

  a {
    display: block;
    margin-bottom: 0.5rem;
    &:hover {
      text-decoration: underline;
    }
  }

  ${below.md} {
    margin-top: 1rem;
    a {
      display: inline-block;
      margin-right: 1rem;
    }
  }
`;

const Footer = ({ siteMetadata, location }) => {
  const footerDesc = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: {
          fileAbsolutePath: {
            regex: "/src/content/markdown/footer-description.md/"
          }
        }
      ) {
        edges {
          node {
            html
            fileAbsolutePath
          }
        }
      }
    }
  `);

  // console.log(footerDesc)
  // console.log(above.sm`font-weight: bold;`)

  return (
    <>
      <StyledFooter>
        <OuterGrid>
          <FooterLogos>
            <FooterLogo>
              <img
                className="logo"
                src={cornellLogoHorizontal}
                alt="Cornell Tech Logo"
              />
            </FooterLogo>
            <FooterLogo>
              <img className="logo" src={urbanaiLogo} alt="Cornell Tech Logo" />
            </FooterLogo>
          </FooterLogos>
          <InnerGrid>
            <Row>
              <Column
                className="description"
                dangerouslySetInnerHTML={{
                  __html: footerDesc.allMarkdownRemark.edges[0].node.html,
                }}
              />
              <FooterNav>
                <Link to="/">Home</Link>
                <Link to="/introduction">Introduction</Link>
                <Link to="/explorer">Explorer</Link>
                {/* <Link to="/insights">Insight Generator</Link> */}
                <Link to="/incoming">Incoming Signals</Link>
                <Link to="/search">Search</Link>
                <Link to="/about">About</Link>
                {/* <Link to="/content-index/">Content Index</Link>
                <Link to="/research-drivers/">Research Drivers</Link> */}
                {/* <Link to="/privacy">Privacy</Link> */}
                {/* <Link to="/forecasts">Forcasts</Link>
              <Link to="/trends/">Trends</Link>
              <Link to="/signals/">Signals</Link> */}
              </FooterNav>
            </Row>
            <Row>
              <Column className="copyright">
                <p>Version: {siteMetadata.version}</p>
                &copy; {new Date().getFullYear()} Cornell Tech. All rights
                reserved. This site includes AI-generated content. Please{" "}
                <a href="https://airtable.com/appsMLBagRr31sgJ5pagsah7NJjVZSeFjb/form">
                  report
                </a>{" "}
                errors, omissions, and hallucinations.
              </Column>
            </Row>
          </InnerGrid>
        </OuterGrid>
      </StyledFooter>
    </>
  );
};
export default Footer;

// query MyQuery {
//   allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/src/content/markdown/footer-description.md/"}}) {
//     edges {
//       node {
//         html
//       }
//     }
//   }
// }
