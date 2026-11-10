import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Button, Flex } from "theme-ui";
import type { Technology } from "../../types";

interface TechListingProps {
  technologies?: Technology[];
  onClick?: (tech: Technology) => void;
  descriptive?: boolean;
}

export function TechListing({
  technologies = [],
  onClick,
  descriptive = true,
}: TechListingProps) {
  return (
    <Flex sx={{ flexWrap: "wrap", gap: "10px" }}>
      {onClick
        ? technologies.map((x) => {
            const techImage = x.image ? getImage(x.image) : null;
            return (
              <Button key={x.name} variant="secondary">
                <Flex
                  sx={{
                    cursor: "pointer",
                    alignItems: "center",
                    gap: 2,
                  }}
                  onClick={() => onClick(x)}
                >
                  {techImage && (
                    <GatsbyImage
                      style={techImageStyle}
                      image={techImage}
                      alt={x.name}
                    />
                  )}
                  {descriptive && x.name}
                </Flex>
              </Button>
            );
          })
        : technologies.map((x) => {
            const techImage = x.image ? getImage(x.image) : null;
            return (
              <Flex
                sx={{
                  alignItems: "center",
                  gap: 2,
                }}
                key={x.name}
              >
                {techImage && (
                  <GatsbyImage
                    style={techImageStyle}
                    image={techImage}
                    alt={x.name}
                  />
                )}
                {descriptive && x.name}
              </Flex>
            );
          })}
    </Flex>
  );
}

const techImageStyle = {
  width: "24px",
  mr: 1,
  mb: 2,
};
