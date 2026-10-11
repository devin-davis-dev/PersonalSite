export const StaticImage = (props: any) => {
  return <img {...props} alt={props.alt || "mocked static image"} />;
};

export const GatsbyImage = (props: any) => {
  return <img {...props} alt={props.alt || "mocked gatsby image"} />;
};

export const getImage: any = jest.fn();
export const withArtDirection: any = jest.fn();
