import { useLocation } from "@reach/router";
import { graphql, useStaticQuery } from "gatsby";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

// SEO Component Resource: https://www.gatsbyjs.com/docs/add-seo-component/

const Seo = ({ title, description, image, lang, keywords, children }) => {
  const { pathname = "/" } = useLocation() || {};
  const { site } = useStaticQuery(query);
  const {
    defaultTitle,
    defaultDescription,
    defaultKeywords,
    defaultLang,
    metaImage,
    siteUrl,
    github,
    linkedin,
  } = site.siteMetadata;

  const seo = {
    title: title ? title : defaultTitle,
    description: description || defaultDescription,
    image: {
      ...metaImage,
      src: `${siteUrl}${image || metaImage.src}`,
    },
    url: `${siteUrl}${pathname} `,
    keywords: keywords || defaultKeywords,
    lang: lang || defaultLang,
  };

  return (
    <Helmet>
      {children}
      <html lang={seo.lang} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="github" content={github} />
      <meta name="linkedin" content={linkedin} />
      <meta name="og:title" content={seo.title} />
      <meta name="og:description" content={seo.description} />
      <meta name="og:image" content={seo.image.src} />
      <meta name="og:image:width" content={seo.image.width} />
      <meta name="og:image:height" content={seo.image.height} />
      <meta name="og:type" content="website" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image.src} />
      <meta name="keywords" content={seo.keywords.join(",")} />
    </Helmet>
  );
};

export default Seo;

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  article: PropTypes.bool,
  image: PropTypes.string,
};

Seo.defaultProps = {
  title: null,
  description: null,
  image: null,
  article: false,
};

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        defaultTitle: title
        defaultDescription: description
        defaultLang: lang
        defaultKeywords: keywords
        github
        linkedin
        siteUrl
        metaImage: image {
          height
          src
          width
        }
      }
    }
  }
`;
