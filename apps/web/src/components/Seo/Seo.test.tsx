import { render, waitFor } from "@testing-library/react";
import mockMetaData from "../../../gatsby-config";
import Seo from "./Seo";

const mockSiteMetadata = (mockMetaData.siteMetadata ?? {}) as Record<
  string,
  any
>;

jest.mock("@reach/router");
jest.mock("gatsby", () => ({
  graphql: jest.fn(),
  useStaticQuery: jest.fn(() => ({
    site: {
      siteMetadata: {
        defaultLang: mockSiteMetadata.lang,
        siteUrl: mockSiteMetadata.siteUrl,
        defaultTitle: mockSiteMetadata.title,
        github: mockSiteMetadata.github,
        linkedin: mockSiteMetadata.linkedin,
        metaImage: mockSiteMetadata.image,
        defaultDescription: mockSiteMetadata.description,
        defaultKeywords: mockSiteMetadata.keywords,
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

      expect(title).toHaveTextContent(`${mockSiteMetadata.title}`);
      expect(description).toHaveAttribute(
        "content",
        mockSiteMetadata.description,
      );
      expect(github).toHaveAttribute("content", mockSiteMetadata.github);
      expect(linkedin).toHaveAttribute("content", mockSiteMetadata.linkedin);
      expect(ogTitle).toHaveAttribute("content", mockSiteMetadata.title);
      expect(ogDescription).toHaveAttribute(
        "content",
        mockSiteMetadata.description,
      );
      expect(ogImage).toHaveAttribute(
        "content",
        `${mockSiteMetadata.siteUrl}${mockSiteMetadata.image.src}`,
      );
      expect(ogImageWidth).toHaveAttribute(
        "content",
        mockSiteMetadata.image.width.toString(),
      );
      expect(ogImageHeight).toHaveAttribute(
        "content",
        mockSiteMetadata.image.height.toString(),
      );
      expect(twitterTitle).toHaveAttribute("content", mockSiteMetadata.title);
      expect(twitterDescription).toHaveAttribute(
        "content",
        mockSiteMetadata.description,
      );
      expect(twitterImage).toHaveAttribute(
        "content",
        `${mockSiteMetadata.siteUrl}${mockSiteMetadata.image.src}`,
      );
      expect(keywords).toHaveAttribute(
        "content",
        mockSiteMetadata.keywords.join(","),
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
        `${mockSiteMetadata.siteUrl}${customImage}`,
      );
      expect(twitterTitle).toHaveAttribute("content", customTitle);
      expect(twitterDescription).toHaveAttribute("content", customDescription);
      expect(twitterImage).toHaveAttribute(
        "content",
        `${mockSiteMetadata.siteUrl}${customImage}`,
      );
      expect(keywords).toHaveAttribute("content", customKeywords.join(","));
    });
  });
});
