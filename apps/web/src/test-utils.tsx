import {
  type RenderOptions,
  render as rtlRender,
} from "@testing-library/react";
import type React from "react";
import { ThemeUIProvider } from "theme-ui";
import theme from "./theme/theme";

interface WrapperProps {
  children: React.ReactNode;
}

/**
 * Universal wrapper providing Theme UI context for component tests.
 */
export const TestWrapper = ({ children }: WrapperProps) => {
  return <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>;
};

/**
 * Custom render that wraps the target UI in the universal TestWrapper.
 */
export const renderWithTheme = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => rtlRender(ui, { wrapper: TestWrapper, ...options });

export * from "@testing-library/react";
export { renderWithTheme as render };
