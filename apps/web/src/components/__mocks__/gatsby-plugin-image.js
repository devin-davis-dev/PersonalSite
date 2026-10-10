export const StaticImage = (props) => {
  return <img {...props} alt={props.alt || "mocked static image"} />;
};

export const GatsbyImage = (props) => {
  return <img {...props} alt={props.alt || "mocked gatsby image"} />;
};

export const getImage = jest.fn();
export const withArtDirection = jest.fn();
