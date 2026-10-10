require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    lang: "en",
    siteUrl: "https://devdeveloper.ca",
    title: "Devin Davis | Software Product Engineer",
    github: "https://github.com/barnacleDevelopments",
    linkedin: "https://www.linkedin.com/in/devin-dev-d-63008412b/",
    image: {
      src: `assets/logo_2.png`,
      width: 110,
      height: 110,
    },
    description:
      "Explore the professional portfolio of Devin Davis, a Product Software Engineer.",
    keywords: [
      "Web development",
      "Full-stack Web developer",
      "JavaScript Frameworks",
      "React developer",
      "Angular",
      "Node.js",
      "Next.Js",
      "Front-end",
      "Back-end",
      "Devops engineer",
      "API integration",
      "CI/CD pipelines",
      "Devin Davis portfolio",
    ],
  },
  plugins: [
    "gatsby-plugin-sitemap",
    "gatsby-transformer-json",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/locales`,
        name: `locale`,
      },
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`,
        languages: [`en`, `fr`],
        defaultLanguage: `en`,
        siteUrl: `https://devdeveloper.ca`,
        trailingSlash: "always",
        redirect: process.env.NODE_ENV !== "development",
        i18nextOptions: {
          interpolation: {
            escapeValue: false,
          },
          keySeparator: false,
          nsSeparator: ":",
          defaultNS: "common",
          ns: [
            "common",
            "navigation",
            "index",
            "about",
            "contact",
            "404",
            "posts",
            "projects",
            "blog",
            "climbing",
          ],
        },
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                });
              });
            },
            query: `
              {
                allMdx(
                  filter: {
                    internal: {contentFilePath: {regex: "/content/posts/"}}
                    frontmatter: { draft: { eq: false } }
                  }
                  sort: { frontmatter: { date: DESC } }
                ) {
                  edges {
                    node {
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                      }
                      excerpt(pruneLength: 100)
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "DevDeveloper RSS Feed",
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`, `.mdx`],
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-embed-video",
            options: {
              width: 800,
              ratio: 1.77,
              height: 400,
              related: false,
              noIframeBorder: true,
              loadingStrategy: "lazy",
              containerClass: "embedVideo-container",
              iframeId: false,
              defaults: {
                placeholder: "blurred",
              },
            },
          },
          "gatsby-remark-responsive-iframe",
          {
            resolve: `gatsby-remark-images`,
            options: {},
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/static/assets`,
        name: "images",
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: "gatsby-plugin-theme-ui",
      options: {
        preset: require(`${__dirname}/src/theme/theme.js`),
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `devdeveloper`,
        short_name: `devdeveloper`,
        start_url: `/`,
        background_color: `#FFF`,
        theme_color: `#30362F`,
        display: `standalone`,
        icon: "src/images/logo_2.png",
        description: "personal engineer portfolio for Devin Davis",
      },
    },
    {
      resolve: `gatsby-plugin-csp`,
      options: {
        mergeScriptHashes: false,
        mergeStyleHashes: false,
        directives: {
          "script-src": `'self' 'unsafe-inline' data: www.google-analytics.com`,
          "style-src": `'self' 'unsafe-inline' fonts.googleapis.com fonts.gstatic.com`,
          "img-src": `'self' data: www.google-analytics.com api.daily.dev`,
          "font-src": `'self' data: fonts.gstatic.com`,
          "connect-src": "'self'",
          "frame-src": `'self' player.vimeo.com embed.ente.io`,
        },
      },
    },
    "gatsby-plugin-react-helmet",
    `gatsby-plugin-image`,
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /images/, // TODO See below to configure properly
        },
      },
    },
  ],
};
