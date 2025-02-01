import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { MainNav } from "@/components/navigation/main-nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MainNav />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
