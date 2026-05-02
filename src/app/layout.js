import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "UCER PYQ Portal — Previous Year Questions",
  description: "Browse and find Previous Year Questions, Sessional and Class Test papers for all branches and semesters at UCER.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
