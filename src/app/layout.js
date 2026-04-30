import "./globals.css";
import Navbar from "@/components/Navbar";

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
        <footer style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          borderTop: '1px solid var(--border)',
          marginTop: '4rem'
        }}>
          &copy; {new Date().getFullYear()} UCER PYQ Portal &mdash; Built with ❤️ for students.
        </footer>
      </body>
    </html>
  );
}
