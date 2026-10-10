import { MDXProvider } from "@mdx-js/react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { DateTime } from "luxon";
import { Box, Button, Flex, Heading, Text } from "theme-ui";
import CallToAction from "../components/CallToAction";
import CommitLog from "../components/CommitLog/CommitLog";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import { ProjectSection } from "../components/ProjectSection/ProjectSection";
import Seo from "../components/Seo/Seo";
import { TechListing } from "../components/TechListing/TechListing";
import Layout from "../components/app/Layout";
import PageContentWrapper from "../layouts/PageWrapper";
import globalCodes from "../short-codes";

const shortCodes = { ...globalCodes, ProjectSection, TechListing };

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function ProjectPage({ data, children, pageContext }) {
  const { t } = useTranslation("common");
  const { mdx: project, otherProjects: projects } = data;
  const { commits } = pageContext;
  const techLimit = 3;

  const randomProjects = shuffleArray(projects.edges)
    .slice(0, 3)
    .map((project) => {
      console.log(project);
      project.node.frontmatter.technologies.slice(0, techLimit);
      return project;
    });

  return (
    <Layout>
      <Seo
        title={project.frontmatter.title}
        keywords={project.frontmatter.keywords.split(",")}
        image={project.frontmatter.image1?.childImageSharp?.original?.src}
      />
      <Box sx={pageWrapper}>
        <Flex
          sx={{
            width: ["90%", "85%", "80%"],
            mx: "auto",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: [4, 4, 5],
          }}
        >
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Heading as="h1" variant="hero" color="white">
              {project.frontmatter.title}
            </Heading>
            <Text
              sx={{
                my: 2,
                fontSize: 3,
                display: "block",
              }}
            >
              {DateTime.fromISO(project.frontmatter.startDate).toFormat(
                "MMM d, yyyy",
              )}
            </Text>
            {(project.frontmatter.status === "ongoing" ||
              project.frontmatter.status === "complete") && (
              <Box
                sx={{
                  bg:
                    project.frontmatter.status === "ongoing"
                      ? "orange"
                      : "#81B29A",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 1,
                  px: 3,
                  py: 1,
                  borderRadius: "20px",
                  mt: 1,
                  display: "inline-block",
                }}
              >
                {project.frontmatter.status === "ongoing"
                  ? t("status_in_progress")
                  : t("status_complete")}
              </Box>
            )}
            <Box>
              {" "}
              {project.frontmatter.URL && (
                <a target="_blanc" href={project.frontmatter.URL}>
                  <Button mt={3} variant="primary" mr={2}>
                    View
                  </Button>
                </a>
              )}{" "}
              {project.frontmatter.githubURL ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={project.frontmatter.githubURL}
                >
                  <Button mt={3} variant="primary">
                    GitHub Repo
                  </Button>
                </a>
              ) : (
                <Button
                  mt={3}
                  variant="primary"
                  disabled
                  title="Source code is not publicly available"
                >
                  GitHub Repo
                </Button>
              )}
            </Box>
          </Box>
          {commits && commits.length > 0 && <CommitLog commits={commits} />}
        </Flex>
      </Box>
      <PageContentWrapper>
        <MDXProvider components={shortCodes}>{children}</MDXProvider>
        <CallToAction
          sx={{ mt: 5 }}
          title="Thanks for checking out my project!"
          content="Explore some of my other projects and see what I've been working on."
          buttonText="Explore Other Projects"
          pageLink="/projects"
        />
        <Box as="section" sx={{ mt: 4 }}>
          <Heading as="h2" variant="subheading1">
            Other Projects
          </Heading>
          <Flex sx={{ gap: "10px", mt: 2, flexWrap: "wrap" }}>
            {randomProjects.map(({ node }) => (
              <ProjectCard
                key={node.frontmatter.title}
                sx={{
                  flex: 1,
                  minWidth: [
                    "100%",
                    "100%",
                    "calc(50% - 10px)",
                    "calc(33.33% - 10px)",
                  ],
                  maxWidth: [
                    "100%",
                    "100%",
                    "calc(50% - 10px)",
                    "calc(33.33% - 10px)",
                  ],
                }}
                project={{ ...node.frontmatter, slug: node.fields.slug }}
              />
            ))}
          </Flex>
        </Box>
      </PageContentWrapper>
    </Layout>
  );
}

const pageWrapper = {
  width: ["100%"],
  m: "0 auto !important",
  pt: "100px",
  pb: 5,
  minHeight: "300px",
  bg: "primary",
  color: "white",
};

export const pageQuery = graphql`
query ProjectBySlug($slug: String!, $language: String!) {
  otherProjects: allMdx(
    filter: {fields: {slug: {ne: $slug}}, frontmatter: {draft: {eq: false}}, internal: {contentFilePath: {regex: "/content/projects/"}}}
  ) {
    edges {
      node {
        fields {
          slug
        }
        frontmatter {
          title
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
          image1 {
            childImageSharp {
              original {
                src
              }
            }
          }
        }
      }
    }
  }
  mdx(fields: {slug: {eq: $slug}}) {
    frontmatter {
      title
      startDate
      endDate
      URL
      githubURL
      status
      keywords
      image1 {
        childImageSharp {
          original {
            src
          }
        }
      }
    }
  }
  locales: allLocale(filter: {ns: {in: ["common"]}, language: {eq: $language}}) {
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

export default ProjectPage;
