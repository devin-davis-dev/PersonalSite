import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";

// Components
import { Box, Button, Card, Flex, Heading, Text } from "theme-ui";
import { TechListing } from "../TechListing/TechListing";

const ProjectCard = ({ project, ...props }) => {
  const { t } = useTranslation("common");
  return (
    <Card
      variant="primary"
      sx={{
        color: "white",
        height: "max-content",
        position: "relative",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "primary",
        mb: 3,
      }}
      {...props}
    >
      {(project.status === "ongoing" || project.status === "complete") && (
        <Box
          sx={{
            position: "absolute",
            top: 2,
            right: 2,
            bg: project.status === "ongoing" ? "orange" : "#81B29A",
            color: "white",
            fontWeight: "bold",
            fontSize: 0,
            px: 2,
            py: 1,
            borderRadius: "20px",
            zIndex: 1,
          }}
        >
          {project.status === "ongoing"
            ? t("status_in_progress")
            : t("status_complete")}
        </Box>
      )}
      <Flex
        sx={{
          bg: "primary",
          width: "100%",
          p: 3,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: [
            "column-reverse",
            "column-reverse",
            "column-reverse",
            "row",
          ],
        }}
      >
        <Box
          sx={{
            height: "100%",
            padding: [1, 2, 3],
            width: "100%",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Heading
              as="h2"
              variant="subheading1"
              color="white"
              title={project.title}
              sx={{
                overflowWrap: "anywhere",
                mt: [3, 3, 3, 1.5],
                mb: [1.5],
                whiteSpace: ["wrap", "nowrap"],
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {project.title}
            </Heading>
            <Text variant="regular" sx={{ color: "white" }}>
              {project.startDate}
            </Text>
            {project.exerpt && (
              <Text variant="regular" sx={{ color: "white" }}>
                {project.exerpt}
              </Text>
            )}
          </Box>
          <TechListing
            technologies={project.technologies}
            descriptive={false}
          />
          <Box>
            <Link to={project.slug}>
              <Button
                variant="secondary"
                sx={{ mt: 3 }}
                className="secondary-btn"
              >
                View
              </Button>
            </Link>
          </Box>
        </Box>
        {project.image1 && (
          <Box
            sx={{
              maxWidth: "400px",
              maxHeight: "200px",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <GatsbyImage image={getImage(project.image1)} alt={"image 1"} />
          </Box>
        )}
      </Flex>
    </Card>
  );
};

export default ProjectCard;
