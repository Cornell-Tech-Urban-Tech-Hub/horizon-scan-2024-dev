require("dotenv").config();
const fs = require("fs");
const path = require("path");
const {
  localSearchNormalizer,
} = require("./src/utilities/localSearchNormalizer");
const {
  author,
  siteTitle,
  siteShortTitle,
  siteDescription,
  siteIcon,
} = require(`./config`);
/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: siteTitle,
    description: siteDescription,
    author: author,
    icon: siteIcon, // This path is relative to the root of the site.
    version: "0.2.0",
    //version: String(process.env.npm_package_version),
    siteUrl: `https://futureofurbanai.org`,
  },
  plugins: [
    "gatsby-plugin-styled-components",
    "gatsby-transformer-remark",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/src/assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown`,
        path: `${__dirname}/src/content/markdown/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/content/data/`,
      },
    },
    {
      resolve: `gatsby-transformer-csv`,
      // options: {
      //   extensions: [`tsv`],
      //   delimiter: "\t",
      // },
    },
    {
      resolve: "gatsby-source-airtable",
      options: {
        apiKey: process.env.AIRTABLE_TOKEN,
        tables: [
          // {
          //   baseId: "appMZ894krIdPpZdm",
          //   tableName: "Sectors",
          // },
          // {
          //   baseId: "appMZ894krIdPpZdm",
          //   tableName: "Impacts",
          //   mapping: { Image: `fileNode`, Description: `text/markdown` },
          // },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Signals",
            tableLinks: ["Informs_Trends"],
            mapping: { Image: `fileNode`, Description: `text/markdown` },
            tableView: "Published Signals",
            //tableView: "Published Signals",
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Trends",
            mapping: { Image: `fileNode`, Description: `text/markdown` },
            tableLinks: ["Signals", "Informs_Forecasts"],
            tableView: "Published Trends",
            //tableView: "Published Trends",
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Forecasts",
            mapping: { Image: `fileNode`, Description: `text/markdown` },
            tableLinks: ["Impacts", "Trends"],
            tableView: "All Forecasts",
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Signals",
            tableView: "Incoming Signals",
          },
          // {
          //   baseId: "appMZ894krIdPpZdm",
          //   tableName: "Content",
          //   mapping: { Content: `text/markdown` },
          // },
        ],
      },
    },
    {
      resolve: `gatsby-omni-font-loader`,
      options: {
        mode: `async`,
        preconnect: [`https://use.typekit.net`],
        web: [
          {
            name: `adelle`,
            file: `https://use.typekit.net/${process.env.TYPEKIT_ID}.css`,
          },
          {
            name: `din-2014`,
            file: `https://use.typekit.net/${process.env.TYPEKIT_ID}.css`,
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-local-search",
      options: {
        name: "pages",
        // engine: "lunr",
        engine: "flexsearch",
        query: fs.readFileSync(
          path.resolve(__dirname, "src/utilities/localSearchQuery.graphql"),
          "utf-8"
        ),
        ref: "id",
        index: ["title", "summary", "description", "sectors", "tags"],
        store: ["title", "type", "summary", "path"],
        normalizer: ({ data }) => localSearchNormalizer(data),
      },
    },
  ],
};
