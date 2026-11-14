# Data Models & Content Pipeline

Content is managed primarily through MDX documents and structured JSON files in `apps/web/content/`, queried via Gatsby GraphQL and typed with TypeScript interfaces in `apps/web/src/types/index.ts`.

---

## 1. Core TypeScript Interfaces (`src/types/index.ts`)

```typescript
export interface Technology {
  name: string;
  image?: any;
  category?: string;
  projects?: Array<{ title: string; slug: string }>;
}

export interface Project {
  title: string;
  description: string;
  path: string;
  technologies?: Technology[];
  slug: string;
  image1?: any;
  image2?: any;
  image3?: any;
  image4?: any;
  image5?: any;
  githubURL?: string;
  demoURL?: string;
  category?: string;
}

export interface BlogPost {
  title: string;
  description: string;
  date: string;
  path: string;
  slug: string;
  tags?: string[];
  thumbnail?: any;
}

export interface Book {
  title: string;
  author: string;
  rating: number;
  date_finished: string;
  review?: string;
  cover_image?: any;
}

export interface Commit {
  sha: string;
  message: string;
  date: string;
  url: string;
}
```

---

## 2. Content Formats

### Projects (`content/projects/*.mdx`)
Frontmatter fields:
- `title`: Project title
- `description`: Short summary
- `path`: Slug path
- `category`: e.g., `"web"`, `"mobile"`, `"contracts"`
- `githubURL`: URL for GitHub commit log fetching
- `demoURL`: Optional live demo link
- `image1`, `image2`, `image3`: Relative image paths for gallery previews
- `technologies`: Array of `{ name, category, image }`

### Blog Posts (`content/blog/*.mdx`)
Frontmatter fields:
- `title`: Post title
- `description`: SEO & card snippet
- `date`: Publication date (`YYYY-MM-DD`)
- `tags`: Array of categories/tags
- `thumbnail`: Featured preview image

### Books (`content/books.json`)
JSON array with books reviewed:
- `title`, `author`, `rating` (number 1-5), `date_finished`, `review`, `cover_image`.

---

## 3. Gatsby Node Content Pipeline (`gatsby-node.ts`)

At build time, `gatsby-node.ts`:
1. Queries all MDX nodes across blog posts and projects.
2. Formats slugs using `@reach/router` / `slugify`.
3. If a project has a `githubURL`, invokes `fetchCommits(githubURL)` to query the GitHub Commits API for commit history.
4. Generates dynamic pages using `actions.createPage`:
   - `BlogPostPage.tsx` with context `{ id, slug }`
   - `ProjectPage.tsx` with context `{ id, slug, commits }`
   - `CategoryPage.tsx` with context `{ category, slug }`
