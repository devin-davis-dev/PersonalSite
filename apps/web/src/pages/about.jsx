import { graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import { useRef, useState } from "react";
import { Box, Grid, Heading, Paragraph, Text } from "theme-ui";

import CallToAction from "../components/CallToAction";
import Seo from "../components/Seo/Seo";
import SkillsChart from "../components/SkillsChart/SkillsChart";
import { TechListing } from "../components/TechListing/TechListing";
import Layout from "../components/app/Layout";
import ProjectDialog from "../components/dialogs/ProjectDialog";
import PageContentWrapper from "../layouts/PageWrapper";

const AboutPage = ({ data }) => {
  const { t } = useTranslation("about");
  const dialog = useRef(null);
  const [selectedTechnology, setSelectedTechnology] = useState();

  const allProjects = data.allMdx.edges;

  const technologyMap = new Map();
  for (const { node } of allProjects) {
    const { title, technologies } = node.frontmatter;
    const { slug } = node.fields;

    for (const tech of technologies) {
      if (!technologyMap.has(tech.name)) {
        technologyMap.set(tech.name, {
          image: tech.image,
          category: tech.category,
          projects: [],
        });
      }
      technologyMap.get(tech.name).projects.push({ title, slug });
    }
  }

  const technologies = Array.from(technologyMap, ([name, data]) => ({
    name,
    image: data.image,
    category: data.category,
    projects: data.projects,
  }));

  return (
    <Layout>
      <Seo title="About" />
      <PageContentWrapper>
        <Heading as="h1" variant="hero">
          {t("page_title")}
        </Heading>
        <Text variant="large" sx={{ my: 3, display: "block" }}>
          {t("page_description")}
        </Text>
        <Grid
          sx={{ mb: 4 }}
          gap={3}
          columns={["1fr", "1fr", "1fr", "0.9fr 2fr"]}
        >
          <Box
            sx={{
              borderRadius: "10px",
              overflow: "hidden",
              display: ["none", "none", "none", "block"],
            }}
          >
            <StaticImage
              src="../images/devin_portrait_2.jpg"
              alt="dev portrait"
            />
          </Box>
          <Box>
            <Paragraph variant="regular">{t("bio_text_1")}</Paragraph>
            <Paragraph variant="regular">
              {t("bio_text_3a")}
              <Link
                to="/climbing"
                sx={{
                  color: "orange",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {t("bio_text_3_link")}
              </Link>
              {t("bio_text_3b")}
            </Paragraph>
            <Paragraph variant="regular">
              {t("bio_text_4")}
              <Link
                to="/contact"
                sx={{
                  color: "orange",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {t("please_reach_out")}
              </Link>
              {t("bio_text_2")}
            </Paragraph>
          </Box>
        </Grid>
        <Box
          sx={{
            px: [0, 3],
            my: 3,
            bg: "primary",
            color: "white",
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Heading variant="subheading1" sx={{ color: "white", mb: 2 }}>
            {t("projects_by_tech_title")}
          </Heading>
          <Paragraph sx={{ mb: 3 }}>{t("projects_by_tech_text")}</Paragraph>
          <SkillsChart technologies={technologies} />
        </Box>
        <Box
          sx={{
            px: [0, 3],
            my: 3,
            bg: "primary",
            color: "white",
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Heading variant="subheading1" sx={{ color: "white" }}>
              {t("tech_experience_title")}
            </Heading>
            <Paragraph sx={{ mb: 4 }}>
              {t("tech_experience_text")}
              <b>{t("tech_experience_click_hint")}</b>.
            </Paragraph>
          </Box>
          {["language", "framework", "cloud"].map((cat) => {
            const group = technologies.filter((t) => t.category === cat);
            if (!group.length) return null;
            return (
              <Box key={cat} sx={{ mb: 4 }}>
                <Heading
                  as="h3"
                  sx={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 0,
                    fontFamily: "heading",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    mb: 2,
                  }}
                >
                  {t(`category_${cat}`)}
                </Heading>
                <TechListing
                  technologies={group}
                  onClick={(technology) => {
                    dialog.current.showModal();
                    setSelectedTechnology(technology);
                  }}
                />
              </Box>
            );
          })}
        </Box>
        <CallToAction
          title={t("cta_title")}
          content={t("cta_content")}
          buttonText={t("cta_button")}
          pageLink={"/projects"}
        />
      </PageContentWrapper>
      <ProjectDialog
        ref={dialog}
        title={selectedTechnology?.name}
        projects={selectedTechnology?.projects}
      />
    </Layout>
  );
};

export const aboutPageQuery = graphql`
  query AboutPageQuery($language: String!) {
    allMdx(
      filter: {
        internal: { contentFilePath: { regex: "/content/projects/" } }
        frontmatter: { draft: { eq: false } }
      }
    ) {
      edges {
        node {
          frontmatter {
            technologies {
              name
              category
              image {
                childImageSharp {
                  gatsbyImageData
                }
              }
            }
            title
          }
          fields {
            slug
          }
        }
      }
    }

    locales: allLocale(
      filter: { ns: { in: ["common", "about"] }, language: { eq: $language } }
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

export default AboutPage;
