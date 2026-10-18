import { graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import { Box, Button, Flex, Grid, Heading, Text } from "theme-ui";

import type { PageProps } from "gatsby";
import booksData from "../../content/books.json";
import BookCard from "../components/BookCard/BookCard";
import CallToAction from "../components/CallToAction";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard/PostCard";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Seo from "../components/Seo/Seo";
import Tooltip from "../components/Tooltip/Tooltip";
import Layout from "../components/app/Layout";
import type { BlogPost, Book, Project } from "../types";
import { getYearsOfExperience } from "../utils/experience";

const IndexPage = ({ data }: PageProps<any>) => {
  const { t } = useTranslation("index");

  const posts: BlogPost[] = data.blogPosts.edges
    .filter((_: any, index: number) => index < 4)
    .map(({ node }: any) => ({
      ...node.frontmatter,
      ...node.fields,
      excerpt: node.excerpt,
    }));

  const bookCoverMap: Record<string, any> = {};
  for (const cover of data.bookCovers?.nodes ?? []) {
    bookCoverMap[cover.name] = cover.childImageSharp;
  }

  const books: Book[] = booksData.map((book: any) => {
    let coverImage = null;
    if (book.cover_image) {
      const coverName = book.cover_image.replace(/\.[^/.]+$/, "");
      coverImage = bookCoverMap[coverName] || null;
    }
    return {
      ...book,
      image: coverImage,
    };
  });

  const projects: Project[] = data.projects.edges.map(({ node }: any) => ({
    ...node.frontmatter,
    ...node.fields,
  }));

  return (
    <Layout>
      <Seo />
      <Box
        data-testid="hero"
        sx={{
          bg: "primary",
          pt: 5,
          pb: 5,
          width: "100%",
          textTransform: "uppercase",
          position: "relative",
        }}
      >
        <Flex
          sx={{
            flexWrap: ["wrap", "wrap", "nowrap"],
            alignItems: "center",
            justifyContent: ["center", "center", "space-between"],
            width: ["90%", "80%", "70%"],
            margin: "0 auto",
            textAlign: ["center", "center", "left"],
            gap: "30px",
          }}
        >
          <Box>
            <Heading as="h1" variant="hero" color="white">
              {t("hero_title")}
            </Heading>
            <Text variant="regular" color="white ">
              {t("hero_subtitle")}
            </Text>
          </Box>
          <Box
            sx={{
              width: ["100%", "100%", "30%"],
            }}
          >
            <Flex sx={{ justifyContent: "center" }}>
              <Box
                sx={{
                  width: "200px",
                  height: "200px",
                  position: "relative",
                }}
              >
                <Flex
                  sx={{
                    gap: 1,
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    top: "0px",
                  }}
                >
                  <Link to="/contact">
                    <Button variant="primary">{t("lets_chat")}</Button>
                  </Link>
                </Flex>
                <Loader />
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Box
          sx={{
            position: "absolute",
            bottom: 2,
            right: 3,
            textTransform: "none",
          }}
        >
          <Tooltip variant="light" text={t("tooltip_static_site")} />
        </Box>
      </Box>
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
        }}
      >
        <Box
          as="article"
          sx={{
            py: [4],
          }}
        >
          <Grid gap={[1]} columns={[1, 1, 1, 1, "1fr 3fr", "1fr 3fr"]}>
            <Box
              sx={{
                overflow: "hidden",
                borderRadius: "10px",
                height: "min-content",
                width: ["100%", "50%", "50%", "50%", "100%"],
              }}
            >
              <StaticImage
                style={{ height: "300px" }}
                src="../images/devin_portrait.jpg"
                alt={t("portrait_alt")}
              />
            </Box>
            <Box
              sx={{
                px: [0, 0, 0, 0, 4],
                pt: [3, 3, 3, 3, 0],
              }}
            >
              <Box
                sx={{
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Heading as="h2" variant="subheading1">
                  {t("hey_there")}
                </Heading>
                <Text variant="regular">
                  {t("intro_text_1")}
                  {t("intro_text_years", { years: getYearsOfExperience() })}
                  {t("intro_text_2")}
                  <Link
                    to="/about"
                    sx={{
                      color: "blue",
                      fontWeight: "bold",
                      textDecoration: "underline",
                      "&:hover": {
                        color: "#E07A5F",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {t("learn_more")}
                  </Link>
                  {t("intro_text_3")}
                  <Link
                    to="/contact"
                    sx={{
                      color: "blue",
                      fontWeight: "bold",
                      textDecoration: "underline",
                      "&:hover": {
                        color: "#E07A5F",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {t("reach_out")}
                  </Link>
                </Text>
              </Box>
            </Box>
          </Grid>
        </Box>
        <Box as="section" sx={{ mt: 3 }}>
          <Heading as="h3" variant="subheading1">
            {t("recent_projects")}
          </Heading>
          <Grid
            sx={{
              mb: 4,
              width: "100%",
            }}
            gap={3}
            columns={[1]}
          >
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </Grid>
        </Box>

        <Box as="section" sx={{ mb: 4 }}>
          <Heading as="h3" variant="subheading1" sx={{ mb: 3 }}>
            {t("reading_list")}
          </Heading>
          <Flex
            sx={{
              gap: 3,
              overflowX: "auto",
              overflowY: "hidden",
              width: "100%",
              pb: 2,
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "muted",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "primary",
                borderRadius: "4px",
                "&:hover": {
                  background: "text",
                },
              },
            }}
          >
            {books.map((book) => (
              <BookCard key={book.title} book={book} />
            ))}
          </Flex>
        </Box>

        <Box as="section" sx={{ mt: 3 }}>
          <Heading as="h3" variant="subheading1">
            {t("recent_posts")}
          </Heading>
          <Grid
            sx={{
              mb: 4,
              width: "100%",
            }}
            gap={3}
            columns={[1]}
          >
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                postContent={post.excerpt}
              />
            ))}
          </Grid>
        </Box>
        <Box sx={{ mb: 4 }} as="section">
          <CallToAction
            title={t("cta_title")}
            content={t("cta_content")}
            buttonText={t("cta_button")}
            pageLink={"/about"}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export const landingPageQuery = graphql`
  query LandingPageQuery($language: String!) {
    blogPosts: allMdx(
      filter: {
        frontmatter: { draft: { eq: false } }
        internal: { contentFilePath: { regex: "/content/blog/" } }
      }
      sort: { frontmatter: { date: DESC } }
      limit: 3
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM do, YYYY")
            category
          }
          excerpt(pruneLength: 100)
        }
      }
    }

    projects: allMdx(
      sort: { frontmatter: { startDate: DESC } }
      filter: {
        internal: { contentFilePath: { regex: "/content/projects/" } }
        frontmatter: { draft: { eq: false } }
      }
      limit: 3
    ) {
      edges {
        node {
          fields {
            slug
          }
          excerpt(pruneLength: 100)
          frontmatter {
            title
            startDate(formatString: "MMMM, YYYY")
            image1 {
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
        }
      }
    }

    bookCovers: allFile(filter: { sourceInstanceName: { eq: "images" }, relativeDirectory: { eq: "book-covers" } }) {
      nodes {
        relativePath
        name
        childImageSharp {
          gatsbyImageData(width: 150, height: 225, placeholder: BLURRED)
        }
      }
    }

    locales: allLocale(
      filter: { ns: { in: ["common", "index"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

export default IndexPage;
