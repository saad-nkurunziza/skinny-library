import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { CurrentPage } from "@/components/layout/current-page";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
// import { after } from "next/server";
// import { markOverdueAll } from "@/server/lending";
import RefreshButton from "@/components/refresh-button";
import { BackgroundTaskTrigger } from "@/components/background-task-trigger";
import ThemeToggler from "@/components/theme-toggler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Library",
  description: "Simple portable library system",
};

export const dynamic = "force-static";
export const revalidate = 3600;
export const fetchCache = "force-cache";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // after(async () => {
  //   try {
  //     await markOverdueAll();
  //   } catch (error) {
  //     console.error("Background database update failed:", error);
  //   }
  // });

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 justify-between items-center gap-2 px-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                  />
                  <CurrentPage />
                </div>
                <div className="flex gap-2">
                  <RefreshButton />
                  <ThemeToggler />
                </div>
              </header>
              <main className="my-6 px-4">
                <BackgroundTaskTrigger />
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
