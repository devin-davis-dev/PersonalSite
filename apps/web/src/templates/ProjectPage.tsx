import { MDXProvider } from "@mdx-js/react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { DateTime } from "luxon";
import { useMemo } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  type ThemeUIStyleObject,
} from "theme-ui";
import CallToAction from "../components/CallToAction";
import CommitLog from "../components/CommitLog/CommitLog";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import { ProjectSection } from "../components/ProjectSection/ProjectSection";
import Seo from "../components/Seo/Seo";
import { TechListing } from "../components/TechListing/TechListing";
import Layout from "../components/app/Layout";
import PageContentWrapper from "../layouts/PageWrapper";
import globalCodes from "../short-codes";

import type React from "react";
import type { Commit } from "../types";

const shortCodes = { ...globalCodes, ProjectSection, TechListing };

/**
 * Deterministically samples a subset of items from an array based on a string seed.
 * Produces consistent selections between SSR and client-side hydration.
 */
function sampleBySeed<T>(array: T[], limit = 3, seed?: string): T[] {
  if (!array || array.length <= limit) return array || [];
  let hash = 0;
  if (seed) {
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
  }
  const startIndex = Math.abs(hash) % array.length;
  const rotated = [...array.slice(startIndex), ...array.slice(0, startIndex)];
  return rotated.slice(0, limit);
}

interface ProjectPageProps {
  data: any;
  children: React.ReactNode;
  pageContext: {
    frontmatter?: any;
    title?: string;
    slug?: string;
    commits?: Commit[];
  };
}

function ProjectPage({ data, children, pageContext }: ProjectPageProps) {
  const { t } = useTranslation(["common", "projects"]);
  const { mdx: project, otherProjects: projects } = data;
  const { commits } = pageContext;

  const recommendedProjects = useMemo(() => {
    return sampleBySeed(
      projects?.edges || [],
      3,
      pageContext.slug || project?.frontmatter?.title,
    );
  }, [projects?.edges, pageContext.slug, project?.frontmatter?.title]);

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
                    {t("view")}
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
                    {t("github_repo")}
                  </Button>
                </a>
              ) : (
                <Button
                  mt={3}
                  variant="primary"
                  disabled
                  title={t("source_code_unavailable")}
                >
                  {t("github_repo")}
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
          title={t("projects:detail_cta_title")}
          content={t("projects:detail_cta_content")}
          buttonText={t("projects:detail_cta_button")}
          pageLink="/projects"
        />
        <Box as="section" sx={{ mt: 4 }}>
          <Heading as="h2" variant="subheading1">
            {t("projects:other_projects")}
          </Heading>
          <Grid
            gap={3}
            columns={[1, 1, 2, 2, 3]}
            sx={{ mt: 2, alignItems: "stretch" }}
          >
            {recommendedProjects.map(({ node }: any) => (
              <ProjectCard
                key={node.frontmatter.title}
                stacked
                sx={{ mb: 0 }}
                project={{ ...node.frontmatter, slug: node.fields.slug }}
              />
            ))}
          </Grid>
        </Box>
      </PageContentWrapper>
    </Layout>
  );
}

const pageWrapper: ThemeUIStyleObject = {
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
  locales: allLocale(filter: {ns: {in: ["common", "projects"]}, language: {eq: $language}}) {
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
