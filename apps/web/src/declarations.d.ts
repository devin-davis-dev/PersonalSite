import type { GatsbyLinkProps } from "gatsby";
import type React from "react";

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const content: any;
  export default content;
}

declare module "@theme-ui/prism" {
  const Prism: any;
  export default Prism;
}

declare module "@theme-ui/prism/presets/*.json" {
  const content: any;
  export default content;
}

declare module "react-helmet" {
  export interface HelmetProps {
    children?: React.ReactNode;
    defaultTitle?: string;
    titleTemplate?: string;
    onChangeClientState?: (
      newState: any,
      addedTags: any,
      removedTags: any,
    ) => void;
    [key: string]: any;
  }
  export class Helmet extends React.Component<HelmetProps, any> {}
}

declare module "gatsby-plugin-react-i18next" {
  export * from "node_modules/.pnpm/gatsby-plugin-react-i18next@3.0.1_gatsby@5.16.1_babel-eslint@10.1.0_eslint@7.32.0_suppo_f2e2e7391976d9302bdfe6a0ad11441e/node_modules/gatsby-plugin-react-i18next/dist";
  export interface I18nLinkProps extends Partial<GatsbyLinkProps<any>> {
    to: string;
    language?: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    sx?: any;
    target?: string;
    rel?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    [key: string]: any;
  }
  export const Link: React.ForwardRefExoticComponent<
    I18nLinkProps & React.RefAttributes<HTMLAnchorElement>
  >;
}
