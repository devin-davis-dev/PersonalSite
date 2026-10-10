import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Box, Grid } from "theme-ui";

const sectionWrapperStyle = {
  width: ["100%"],
  mx: "auto",
  mb: 5,
  textAlign: ["center", "left"],
};

export function ProjectSection({
  children,
  image,
  imageAlt,
  alignment = "left",
  caption,
}) {
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
