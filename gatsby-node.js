const path = require("path");
//const slugify = require("slugify")
// import slugFormat from "./src/utilities/slugFormat"

const { slugFormat } = require("./src/utilities/slugFormat");

// function slugFormat(string) {
//   return slugify(string, {
//     // replacement: '-',  // replace spaces with replacement character, defaults to `-`
//     remove: undefined, // remove characters that match regex, defaults to `undefined`
//     lower: true, // convert to lower case, defaults to `false`
//     strict: true, // strip special characters except replacement, defaults to `false`
//     trim: true, // trim leading and trailing replacement chars, defaults to `true`
//   })
// }

// const pathsToIgnore = ["/style-guide/"]
// exports.onCreatePage = ({ page, actions: { deletePage } }) => {
//   if (process.env.NODE_ENV === "production") return

//   if (pathsToIgnore.includes(page.path)) {
//     deletePage(page)
//   }
// }

// exports.createSchemaCustomization = ({ actions }) => {
//   const { createTypes } = actions
//   const typeDefs = `
//     type MarkdownRemark implements Node {
//       frontmatter: Frontmatter
//     }
//     type Frontmatter {
//       ref: [String!]!
//       section: [String!]!
//     }
//   `
//   createTypes(typeDefs)
// }

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const forecasts = graphql(`
    {
      allAirtable(filter: { table: { eq: "Forecasts" } }) {
        nodes {
          recordId
          data {
            Name
          }
        }
      }
    }
  `).then((results) => {
    results.data.allAirtable.nodes.forEach((node) => {
      createPage({
        // path: `/forecasts/${node.recordId}`,
        path: `/forecasts/${slugFormat(node.data.Name)}`,
        component: path.resolve("./src/templates/Forecast.js"),
        context: {
          recordId: node.recordId,
        },
      });
    });
  });

  const trends = graphql(`
    {
      allAirtable(filter: { table: { eq: "Trends" } }) {
        nodes {
          recordId
          data {
            Name
          }
        }
      }
    }
  `).then((results) => {
    results.data.allAirtable.nodes.forEach((node) => {
      createPage({
        // path: `/trends/${node.recordId}`,
        path: `/trends/${slugFormat(node.data.Name)}`,
        component: path.resolve("./src/templates/Trend.js"),
        context: {
          recordId: node.recordId,
        },
      });
    });
  });

  const signals = graphql(`
    {
      allAirtable(filter: { table: { eq: "Signals" } }) {
        nodes {
          recordId
          data {
            Name
          }
        }
      }
    }
  `).then((results) => {
    results.data.allAirtable.nodes.forEach((node) => {
      createPage({
        // path: `/signals/${node.recordId}`,
        path: `/signals/${slugFormat(node.data.Name)}`,
        component: path.resolve("./src/templates/Signal.js"),
        context: {
          recordId: node.recordId,
        },
      });
    });
  });

  // const posts = graphql(`
  //   query {
  //     allFile(filter: {relativeDirectory: {eq: "posts"}}) {
  //       edges {
  //         node {
  //           childMarkdownRemark {
  //             fields {
  //               slug
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // `).then(result => {
  //   result.data.allFile.edges.forEach(({ node }) => {
  //     createPage({
  //       path: node.childMarkdownRemark.fields.slug,
  //       component: path.resolve('./src/templates/post.js'),
  //       context: {
  //         slug: node.childMarkdownRemark.fields.slug,
  //       },
  //     });
  //   });
  // })

  return Promise.all([forecasts, trends, signals]);
};

// export async function createPages(params) {
//   console.log("CREATING PAGES")
//   // Wait for all promises to be resolved
//   await Promise.all([turnForecastsIntoPages(params)])
// }
