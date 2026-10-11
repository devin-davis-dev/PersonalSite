import path from "node:path";
import dotenv from "dotenv";
import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";

dotenv.config();

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

async function fetchCommits(githubURL: string): Promise<Commit[]> {
  try {
    const { pathname } = new URL(githubURL);
    const parts = pathname.replace(/^\//, "").split("/");
    if (parts.length < 2) return [];
    const [owner, repo] = parts;
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`,
    );
    if (!res.ok) return [];
    const data = (await res.json()) as any[];
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

export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
}) => {
  const { createPage } = actions;

  function genPostPage(node: any, post: any) {
    createPage({
      path: `${node.fields.slug}`,
      component: `${path.resolve(`./src/templates/BlogPostPage.tsx`)}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        title: post.title,
        slug: node.fields.slug,
      },
    });
  }

  async function genProjectPage(node: any, project: any) {
    const githubURL = node.frontmatter.githubURL;
    const commits = githubURL ? await fetchCommits(githubURL) : [];
    createPage({
      path: node.fields.slug,
      component: `${path.resolve(`./src/templates/ProjectPage.tsx`)}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        frontmatter: node.frontmatter,
        title: project.title,
        slug: node.fields.slug,
        commits,
      },
    });
  }

  function genCategoryPage(category: string) {
    createPage({
      path: `/blog/${category}`,
      component: path.resolve(`src/templates/CategoryPage.tsx`),
      context: {
        category: category,
      },
    });
  }

  const projectsResult = graphql<any>(`
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
        return Promise.reject(result.errors);
      }
      for (const { node } of result.data.allMdx.edges) {
        const project = node.frontmatter;
        await genProjectPage(node, project);
      }
    })
    .catch((error) =>
      console.log("Error occured while generating project pages", error),
    );

  const categoryResult = graphql<any>(`
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
      return Promise.reject(result.errors);
    }

    for (const category of result.data.allMdx.distinct) {
      genCategoryPage(category);
    }
  });

  const postsResult = graphql<any>(`
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
      return Promise.reject(result.errors);
    }
    for (const { node } of result.data.allMdx.edges) {
      if (!node.frontmatter.draft) {
        const post = node.frontmatter;
        genPostPage(node, post);
      }
    }
  });

  await Promise.allSettled([categoryResult, postsResult, projectsResult]);
};

export const onCreateNode: GatsbyNode["onCreateNode"] = async ({
  node,
  actions: { createNodeField },
  getNode,
}) => {
  if (node.internal.type === `Mdx`) {
    let path: string;
    const frontmatter = node.frontmatter as Record<string, any> | undefined;
    if (frontmatter?.path) {
      path = frontmatter.path;
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

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
  getConfig,
}) => {
  const config = getConfig();
  actions.replaceWebpackConfig(config);
};
