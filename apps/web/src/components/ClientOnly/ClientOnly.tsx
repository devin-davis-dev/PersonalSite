import type React from "react";
import type { ReactNode } from "react";
import { useIsMounted } from "../../hooks/use-is-mounted";

export interface ClientOnlyProps {
  /**
   * Content to render on the client once mounted.
   * Can be either standard React nodes or a render-prop function.
   * The render function prevents evaluation of browser-dependent code during SSR.
   */
  children: ReactNode | (() => ReactNode);
  /**
   * Optional fallback to display during SSR and before mounting.
   * Defaults to null.
   */
  fallback?: ReactNode;
}

/**
 * Universal SSR boundary component.
 * Renders fallback during Gatsby SSR builds and client hydration,
 * then safely renders children once mounted in the browser.
 */
export const ClientOnly: React.FC<ClientOnlyProps> = ({
  children,
  fallback = null,
}) => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{typeof children === "function" ? children() : children}</>;
};

export default ClientOnly;
