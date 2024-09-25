/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import { useLocation } from "@reach/router";

function Seo({ description, meta, title }) {
  const location = useLocation();

  const { site, ogimage } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          subtitle
          description
          author
        }
      }
      ogimage: allFile(filter: { relativePath: { eq: "social-card.png" } }) {
        nodes {
          publicURL
        }
      }
    }
  `);

  const siteTitle = site.siteMetadata.title;
  const siteSubtitle = site.siteMetadata.subtitle;
  const siteDescription = description
    ? description
    : site.siteMetadata.description;
  const siteFullTitle = `${siteTitle}: ${siteSubtitle}`;
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  const ogTitle = title ? title : siteTitle;
  const ogImageURL = ogimage.nodes[0].publicURL;

  // location.pathname === "/" && console.log("LOCATION IS HOMEPAGE")
  //const pageDescription = description ? description : siteDescription
  const ogDescription =
    location.pathname === "/"
      ? siteDescription
      : description
        ? description
        : siteFullTitle;

  return (
    <Helmet
      htmlAttributes={{
        lang: "en",
      }}
      title={pageTitle}
      // titleTemplate={title ? `${title} | ${siteTitle}` : null}
      defaultTitle={siteTitle}
      meta={[
        {
          name: `description`,
          content: ogDescription,
        },
        {
          property: `og:title`,
          content: ogTitle,
        },
        {
          property: `og:description`,
          content: ogDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: ogImageURL,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        // {
        //   name: `twitter:creator`,
        //   content: site.siteMetadata?.author || ``,
        // },
        {
          name: `twitter:title`,
          content: ogTitle,
        },
        {
          name: `twitter:description`,
          content: ogDescription,
        },
        {
          name: `twitter:image`,
          content: ogImageURL,
        },
      ].concat(meta)}
    >
      {process.env.NODE_ENV !== "development" && (
        <script
          defer
          data-domain="futureofurbanai.org"
          src="https://plausible.io/js/script.js"
        ></script>
      )}
    </Helmet>
  );
}

Seo.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};

export default Seo;
