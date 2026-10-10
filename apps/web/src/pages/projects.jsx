import { graphql } from "gatsby";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import { useState } from "react";
import { Box, Heading, Paragraph } from "theme-ui";

import CallToAction from "../components/CallToAction";
import FilterBar from "../components/FilterBar";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Seo from "../components/Seo/Seo";
import Layout from "../components/app/Layout";

const keywords = [
  "Devin Davis",
  "full-stack developer portfolio",
  "web development projects",
  "innovative web solutions",
  "creative web design",
  "frontend development",
  "backend development",
  "JavaScript frameworks",
  "React projects",
  "Angular projects",
  "Vue.js projects",
  "full-stack development",
  "web application development",
  "developer portfolio",
  "software development",
  "collaboration opportunities",
];

const ProjectsPage = ({ data }) => {
  const { t } = useTranslation(["projects", "common"]);
  const [statusFilter, setStatusFilter] = useState("all");
  const allProjects = data.allMdx.edges.map(
    ({ node: { fields, frontmatter, excerpt } }) => ({
      ...fields,
      ...frontmatter,
      excerpt,
    }),
  );

  const projects = allProjects.filter((project) => {
    if (statusFilter === "ongoing") return project.status === "ongoing";
    if (statusFilter === "complete") return project.status === "complete";
    return true;
  });

  return (
    <Layout>
      <Seo
        title="Projects"
        description={`Explore the portfolio of Devin Davis, a results-oriented full-stack developer showcasing web solutions and creative designs. Let's connect to collaborate or discuss new opportunities.`}
        keywords={keywords}
      />
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          my: 5,
        }}
      >
        <Box as="section" sx={{ mb: 5 }}>
          <Heading as="h1" variant="hero">
            {t("page_title")}
          </Heading>
          <Paragraph variant="large">
            {t("page_description_1")}
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
              {t("page_description_link")}
            </Link>
            .
          </Paragraph>
        </Box>
        <FilterBar
          options={[
            { value: "all", label: t("common:filter_all") },
            { value: "ongoing", label: t("common:status_in_progress") },
            { value: "complete", label: t("common:status_complete") },
          ]}
          active={statusFilter}
          onChange={setStatusFilter}
        />
        <Box
          as="section"
          sx={{
            mb: 3,
            mt: 3,
          }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Box>
        <CallToAction
          title={t("cta_title")}
          content={t("cta_content")}
          buttonText={t("cta_button")}
          pageLink={"/contact"}
        />
      </Box>
    </Layout>
  );
};

export const projectsQuery = graphql`
  query ProjectsPageQuery($language: String!) {
    allMdx(
      sort: { frontmatter: { startDate: DESC } }
      filter: {
        internal: { contentFilePath: { regex: "/content/projects/" } }
        frontmatter: { draft: { eq: false } }
      }
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
            status
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

    locales: allLocale(
      filter: { ns: { in: ["common", "projects"] }, language: { eq: $language } }
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

export default ProjectsPage;
