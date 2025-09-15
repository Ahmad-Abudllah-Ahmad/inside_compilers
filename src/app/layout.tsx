import type { Metadata } from "next";
import "./globals.css";
import { MotionProvider } from "@/components/providers/motion-provider";
import { Header } from '@/components/nav/header';
import ChatBot from '@/components/ChatBot';
import { CursorSpotlight } from "@/components/ui/cursor-spotlight";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export const metadata: Metadata = {
  title: "Inside Compilers — Web Development & Automation Agency",
  description: "Full-stack development, automation, and digital solutions with cutting-edge technology. Specializing in Next.js, AI integrations, and custom web applications.",
  keywords: ["web development", "automation", "Next.js", "AI integration", "digital agency"],
  authors: [{ name: "Inside Compilers" }],
  openGraph: {
    title: "Inside Compilers — Web Development & Automation Agency",
    description: "Full-stack development, automation, and digital solutions with cutting-edge technology.",
    type: "website",
    siteName: "Inside Compilers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inside Compilers — Web Development & Automation Agency",
    description: "Full-stack development, automation, and digital solutions with cutting-edge technology.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark" style={{ background: '#0a0a0a' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;300;400;500;600;700;800;900&family=Comfortaa:wght@300;400;500;600;700&family=Kalam:wght@300;400;700&family=Astloch:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body 
        className="font-body text-text bg-background min-h-screen overflow-x-hidden dark"
        style={{ background: '#0a0a0a', color: '#E6E7EB' }}
        data-barba="wrapper"
      >
        <MotionProvider>
          <ScrollProgress />
          <CursorSpotlight />
          <Header />
          
          <main 
            className="relative z-10"
            data-barba="container"
            data-barba-namespace="page"
          >
            {children}
          </main>
          <ChatBot />
        </MotionProvider>
      </body>
    </html>
  );
}
