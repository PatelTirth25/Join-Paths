import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthWrapper from "@/Providers/NextAuth";
import ApolloWrapper from "@/Providers/Apollo";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Social Media",
  description: "Post,Follow,Like and Comment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-black text-white">
      <ApolloWrapper>
        <NextAuthWrapper>
          <body className={inter.className}>
            <Navbar />
            {children}
          </body>
        </NextAuthWrapper>
      </ApolloWrapper>
    </html>
  );
}
