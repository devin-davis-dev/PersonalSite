const { createFilePath } = require("gatsby-source-filesystem");
require("dotenv").config();
const path = require("node:path");

async function fetchCommits(githubURL) {
  try {
    const { pathname } = new URL(githubURL);
    const parts = pathname.replace(/^\//, "").split("/");
    if (parts.length < 2) return [];
    const [owner, repo] = parts;
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`,
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((c) => ({
      sha: c.sha,
      message: c.commit.message.split("\n")[0],
      author: c.commit.author.name,
      date: c.commit.author.date,
      url: c.html_url,
    }));
  } catch {
    return [];
  }
}

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  function genPostPage(node, post) {
    createPage({
      path: `${node.fields.slug}`,
      component: `${path.resolve(`./src/templates/BlogPostPage.js`)}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        title: post.title,
        slug: node.fields.slug,
      },
    });
  }

  async function genProjectPage(node, project) {
    const githubURL = node.frontmatter.githubURL;
    const commits = githubURL ? await fetchCommits(githubURL) : [];
    createPage({
      path: node.fields.slug,
      component: `${path.resolve(`./src/templates/ProjectPage.js`)}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        frontmatter: node.frontmatter,
        title: project.title,
        slug: node.fields.slug,
        commits,
      },
    });
  }

  function genCategoryPage(category) {
    createPage({
      path: `/blog/${category}`,
      component: path.resolve(`src/templates/CategoryPage.js`),
      context: {
        category: category,
      },
    });
  }

  const projectsResult = graphql(`
    query ProjectsQuery {
      allMdx(
        filter: {
          frontmatter: { draft: { eq: false } }
          internal: { contentFilePath: { regex: "/content/projects/" } }
        }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              draft
              githubURL
              image1 {
                childImageSharp {
                  gatsbyImageData
                }
              }
              image2 {
                childImageSharp {
                  gatsbyImageData
                }
              }
              image3 {
                childImageSharp {
                  gatsbyImageData
                }
              }
              image4 {
                childImageSharp {
                  gatsbyImageData
                }
              }
              image5 {
                childImageSharp {
                  gatsbyImageData
                }
              }
              technologies {
                name
                image {
                  childImageSharp {
                    gatsbyImageData
                    original {
                      src
                    }
                  }
                }
              }
            }
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `)
    .then(async (result) => {
      if (result.errors) {
        Promise.reject(result.errors);
      }
      for (const { node } of result.data.allMdx.edges) {
        const project = node.frontmatter;
        await genProjectPage(node, project);
      }
    })
    .catch((error) =>
      console.log("Error occured while generating project pages", error),
    );

  const categoryResult = graphql(`
    query ProjectsPageQuery {
      allMdx(
        filter: {
          internal: { contentFilePath: { regex: "/content/blog/" } }
          frontmatter: { draft: { eq: false } }
        }
      ) {
        distinct(field: { frontmatter: { category: SELECT } })
      }
    }
  `).then((result) => {
    if (result.errors) {
      Promise.reject(result.errors);
    }

    for (const category of result.data.allMdx.distinct) {
      genCategoryPage(category);
    }
  });

  const postsResult = graphql(`
    query BlogQuery {
      allMdx(
        filter: {
          internal: { contentFilePath: { regex: "/content/blog/" } }
          frontmatter: { draft: { eq: false } }
        }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              category
            }
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      Promise.reject(result.errors);
    }
    for (const { node } of result.data.allMdx.edges) {
      if (!node.frontmatter.draft) {
        const post = node.frontmatter;
        genPostPage(node, post);
      }
    }
  });

  return Promise.allSettled([categoryResult, postsResult, projectsResult]);
};

exports.onCreateNode = async ({
  node,
  actions: { createNodeField },
  getNode,
}) => {
  if (node.internal.type === `Mdx`) {
    let path;
    if (node.frontmatter.path) {
      path = node.frontmatter.path;
    } else {
      path = createFilePath({ node, getNode });
    }

    createNodeField({
      name: `slug`,
      node,
      value: path,
    });
  }
};

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const config = getConfig();
  actions.replaceWebpackConfig(config);
};
