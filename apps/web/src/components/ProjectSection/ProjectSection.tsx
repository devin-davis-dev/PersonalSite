import { GatsbyImage, getImage } from "gatsby-plugin-image";
import type React from "react";
import { Box, Grid, type ThemeUIStyleObject } from "theme-ui";

const sectionWrapperStyle: ThemeUIStyleObject = {
  width: ["100%"],
  mx: "auto",
  mb: 5,
  textAlign: ["center", "left"],
};

interface ProjectSectionProps {
  children: React.ReactNode;
  image?: any;
  imageAlt?: string;
  alignment?: "left" | "right";
  caption?: string;
}

export function ProjectSection({
  children,
  image,
  imageAlt = "",
  alignment = "left",
  caption,
}: ProjectSectionProps) {
  const isLeftAligned = alignment === "left";

  const hasImage = image && getImage(image);

  return (
    <Box
      as="section"
      aria-label="Project Section"
      sx={{ ...sectionWrapperStyle }}
    >
      {hasImage ? (
        <Grid columns={[1, 2]} sx={{ alignItems: "center", gap: 5 }}>
          <Box
            sx={{
              order: [2, isLeftAligned ? 1 : 2],
            }}
          >
            {children}
          </Box>
          <Box
            sx={{
              order: [1, isLeftAligned ? 2 : 1],
            }}
          >
            <figure>
              <GatsbyImage image={hasImage} alt={imageAlt} />
              <figcaption>{caption}</figcaption>
            </figure>
          </Box>
        </Grid>
      ) : (
        <Box>{children}</Box>
      )}
    </Box>
  );
}
