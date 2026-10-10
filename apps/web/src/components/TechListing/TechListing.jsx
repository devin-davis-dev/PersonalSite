import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Button, Flex } from "theme-ui";

export function TechListing({ technologies, onClick, descriptive = true }) {
  return (
    <Flex sx={{ flexWrap: "wrap", gap: "10px" }}>
      {onClick
        ? technologies.map((x) => (
            <Button key={x.name} variant="secondary">
              <Flex
                sx={{
                  cursor: "pointer",
                  alignItems: "center",
                  gap: 2,
                }}
                onClick={() => onClick(x)}
              >
                <GatsbyImage
                  width="24px"
                  height="24px"
                  style={techImageStyle}
                  image={getImage(x.image)}
                  alt={x.name}
                />
                {descriptive && x.name}
              </Flex>
            </Button>
          ))
        : technologies.map((x) => (
            <Flex
              sx={{
                alignItems: "center",
                gap: 2,
              }}
              key={x.name}
            >
              <GatsbyImage
                style={techImageStyle}
                image={getImage(x.image)}
                alt={x.name}
              />
              {descriptive && x.name}
            </Flex>
          ))}
    </Flex>
  );
}

const techImageStyle = {
  width: "24px",
  mr: 1,
  mb: 2,
};
