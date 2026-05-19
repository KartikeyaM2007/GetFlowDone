import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";
import ThemeToggle from "./ThemeToggle";

export const metadata: Metadata = {
  title: "GetFlowDone | Intelligent Visual Agent Builder",
  description:
    "The ultimate platform to build, chain, and deploy intelligent AI agent workflows with infinite visual pipelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="app-theme antialiased">
          <ConvexClientProvider>
            <Provider>
              <div suppressHydrationWarning>{children}</div>{" "}
              <ThemeToggle />
              <Toaster/>
            </Provider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
