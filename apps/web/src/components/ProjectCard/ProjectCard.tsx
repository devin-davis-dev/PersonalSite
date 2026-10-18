import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  type ThemeUIStyleObject,
} from "theme-ui";
import type { Project } from "../../types";
import { TechListing } from "../TechListing/TechListing";

export interface ProjectCardProps {
  project: Project;
  stacked?: boolean;
  layout?: "horizontal" | "stacked";
  sx?: ThemeUIStyleObject;
  [key: string]: any;
}

const ProjectCard = ({
  project,
  stacked = false,
  layout,
  sx,
  ...props
}: ProjectCardProps) => {
  const { t } = useTranslation("common");
  const cardImage = project.image1 ? getImage(project.image1) : null;
  const isStacked = Boolean(
    stacked || layout === "stacked" || props.variant === "stacked",
  );

  return (
    <Card
      variant="primary"
      sx={{
        color: "white",
        height: isStacked ? "100%" : "max-content",
        display: isStacked ? "flex" : undefined,
        flexDirection: isStacked ? "column" : undefined,
        position: "relative",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "primary",
        mb: 3,
        ...sx,
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
          height: isStacked ? "100%" : undefined,
          flex: isStacked ? 1 : undefined,
          p: 3,
          justifyContent: "space-between",
          alignItems: isStacked ? "stretch" : "center",
          flexDirection: isStacked
            ? "column-reverse"
            : ["column-reverse", "column-reverse", "column-reverse", "row"],
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: isStacked ? "flex" : undefined,
            flexDirection: isStacked ? "column" : undefined,
            flex: isStacked ? 1 : undefined,
            padding: isStacked ? [1, 2, 2] : [1, 2, 3],
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
                mt: isStacked ? 2 : [3, 3, 3, 1.5],
                mb: [1.5],
                whiteSpace: isStacked ? "normal" : ["wrap", "nowrap"],
                textOverflow: isStacked ? "clip" : "ellipsis",
                overflow: "hidden",
              }}
            >
              {project.title}
            </Heading>
            <Text variant="regular" sx={{ color: "white" }}>
              {project.startDate}
            </Text>
            {(project.exerpt || project.excerpt) && (
              <Text variant="regular" sx={{ color: "white" }}>
                {project.exerpt || project.excerpt}
              </Text>
            )}
          </Box>
          <TechListing
            technologies={project.technologies}
            descriptive={false}
          />
          <Box
            sx={{ mt: isStacked ? "auto" : undefined, pt: isStacked ? 3 : 0 }}
          >
            <Link to={project.slug}>
              <Button
                variant="secondary"
                sx={{ mt: isStacked ? 0 : 3 }}
                className="secondary-btn"
              >
                View
              </Button>
            </Link>
          </Box>
        </Box>
        {cardImage && (
          <Box
            sx={{
              maxWidth: isStacked ? "100%" : "400px",
              height: isStacked ? "180px" : undefined,
              maxHeight: "200px",
              width: isStacked ? "100%" : "auto",
              borderRadius: 10,
              overflow: "hidden",
              flexShrink: 0,
              display: isStacked ? "flex" : undefined,
              justifyContent: isStacked ? "center" : undefined,
            }}
          >
            <GatsbyImage
              image={cardImage}
              alt={"image 1"}
              style={
                isStacked
                  ? { width: "100%", height: "100%", objectFit: "cover" }
                  : undefined
              }
            />
          </Box>
        )}
      </Flex>
    </Card>
  );
};

export default ProjectCard;
