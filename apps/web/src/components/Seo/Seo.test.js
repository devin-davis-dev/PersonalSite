import { render, waitFor } from "@testing-library/react";
import mockMetaData from "../../../gatsby-config.js";
import Seo from "./Seo.jsx";

jest.mock("@reach/router");
jest.mock("gatsby", () => ({
  graphql: jest.fn(),
  useStaticQuery: jest.fn(() => ({
    site: {
      siteMetadata: {
        defaultLang: mockMetaData.siteMetadata.lang,
        siteUrl: mockMetaData.siteMetadata.siteUrl,
        defaultTitle: mockMetaData.siteMetadata.title,
        github: mockMetaData.siteMetadata.github,
        linkedin: mockMetaData.siteMetadata.linkedin,
        metaImage: mockMetaData.siteMetadata.image,
        defaultDescription: mockMetaData.siteMetadata.description,
        defaultKeywords: mockMetaData.siteMetadata.keywords,
      },
    },
  })),
}));

describe("SEO", () => {
  it("renders the SEO component with the correct default values", async () => {
    render(<Seo />);
    await waitFor(() => {
      const title = document.querySelector("title");
      const description = document.querySelector('meta[name="description"]');
      const ogTitle = document.querySelector('meta[name="og:title"]');
      const ogDescription = document.querySelector(
        'meta[name="og:description"]',
      );
      const github = document.querySelector('meta[name="github"]');
      const linkedin = document.querySelector('meta[name="linkedin"]');
      const ogImage = document.querySelector('meta[name="og:image"]');
      const ogImageWidth = document.querySelector(
        'meta[name="og:image:width"]',
      );
      const ogImageHeight = document.querySelector(
        'meta[name="og:image:height"]',
      );
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector(
        'meta[name="twitter:description"]',
      );
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      const keywords = document.querySelector('meta[name="keywords"]');

      expect(title).toHaveTextContent(`${mockMetaData.siteMetadata.title}`);
      expect(description).toHaveAttribute(
        "content",
        mockMetaData.siteMetadata.description,
      );
      expect(github).toHaveAttribute(
        "content",
        mockMetaData.siteMetadata.github,
      );
      expect(linkedin).toHaveAttribute(
        "content",
        mockMetaData.siteMetadata.linkedin,
      );
      expect(ogTitle).toHaveAttribute(
        "content",
        mockMetaData.siteMetadata.title,
      );
      expect(ogDescription).toHaveAttribute(
        "content",
        mockMetaData.siteMetadata.description,
      );
      expect(ogImage).toHaveAttribute(
        "content",
        `${mockMetaData.siteMetadata.siteUrl}${mockMetaData.siteMetadata.image.src}`,
      );
      expect(ogImageWidth).toHaveAttribute(
        "content",
        mockMetaData.siteMetadata.image.width.toString(),
      );
      expect(ogImageHeight).toHaveAttribute(
        "content",
        mockMetaData.siteMetadata.image.height.toString(),
      );
      expect(twitterTitle).toHaveAttribute(
        "content",
        mockMetaData.siteMetadata.title,
      );
      expect(twitterDescription).toHaveAttribute(
        "content",
        mockMetaData.siteMetadata.description,
      );
      expect(twitterImage).toHaveAttribute(
        "content",
        `${mockMetaData.siteMetadata.siteUrl}${mockMetaData.siteMetadata.image.src}`,
      );
      expect(keywords).toHaveAttribute(
        "content",
        mockMetaData.siteMetadata.keywords.join(","),
      );
    });
  });

  it("renders the SEO component with custom values", async () => {
    const customTitle = "Custom Title";
    const customDescription = "Custom Description";
    const customImage = "/custom-image.jpg";
    const customKeywords = ["custom", "keywords"];

    render(
      <Seo
        title={customTitle}
        description={customDescription}
        image={customImage}
        keywords={customKeywords}
      />,
    );

    await waitFor(() => {
      const title = document.querySelector("title");
      const description = document.querySelector('meta[name="description"]');
      const ogTitle = document.querySelector('meta[name="og:title"]');
      const ogDescription = document.querySelector(
        'meta[name="og:description"]',
      );
      const ogImage = document.querySelector('meta[name="og:image"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector(
        'meta[name="twitter:description"]',
      );
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      const keywords = document.querySelector('meta[name="keywords"]');

      expect(title).toHaveTextContent(customTitle);
      expect(description).toHaveAttribute("content", customDescription);
      expect(ogTitle).toHaveAttribute("content", customTitle);
      expect(ogDescription).toHaveAttribute("content", customDescription);
      expect(ogImage).toHaveAttribute(
        "content",
        `${mockMetaData.siteMetadata.siteUrl}${customImage}`,
      );
      expect(twitterTitle).toHaveAttribute("content", customTitle);
      expect(twitterDescription).toHaveAttribute("content", customDescription);
      expect(twitterImage).toHaveAttribute(
        "content",
        `${mockMetaData.siteMetadata.siteUrl}${customImage}`,
      );
      expect(keywords).toHaveAttribute("content", customKeywords.join(","));
    });
  });
});
