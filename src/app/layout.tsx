import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ABC Pay | 跨境支付与风控平台",
  description: "服务出海电商、游戏、数字服务商户的一体化支付与风控平台。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
