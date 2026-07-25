import React from "react";
import { ThemeProvider } from "next-themes";

export default function ProviderTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      {children}
    </ThemeProvider>
  );
}
