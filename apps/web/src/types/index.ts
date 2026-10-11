import type { IGatsbyImageData } from "gatsby-plugin-image";

export interface Technology {
  name: string;
  image?: any;
  category?: string;
  projects?: Array<{ title: string; slug: string }>;
}

export interface Project {
  title: string;
  startDate?: string;
  exerpt?: string;
  excerpt?: string;
  status?: "ongoing" | "complete" | string;
  technologies?: Technology[];
  slug: string;
  image1?: any;
  image2?: any;
  image3?: any;
  image4?: any;
  image5?: any;
  githubURL?: string;
  draft?: boolean;
}

export interface BlogPost {
  title: string;
  date: string;
  category?: string;
  slug: string;
  thumbnail?: {
    childImageSharp?: {
      original?: {
        src: string;
      };
      gatsbyImageData?: IGatsbyImageData;
    };
  };
  excerpt?: string;
  keywords?: string;
  draft?: boolean;
}

export interface Book {
  title: string;
  author: string;
  cover_image?: string;
  image?: any;
  status?: string;
}

export interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}
