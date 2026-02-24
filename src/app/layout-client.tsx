"use client";

import { Providers } from "./providers";
import { Toaster } from "@/components/ui/ToasterUI";
import { notoSansSC } from "@/lib/fonts";

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="so">
      <body className={`${notoSansSC.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
