import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Nav from '../components/nav';
import styles from '../styles/layout.module.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Yae Publishing House',
  description: 'Matthew Guo Portfolio Page',
};

export default function RootLayout({ children }) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <Nav />
        {children}
        <footer className={styles.footer}>
          <span>
            © Matthew Guo
            <br />
            {currentYear}
          </span>
          <span className={styles.powered}>
            · powered by vibe coding and some free AWS credits on a wrapper
            service
          </span>
        </footer>
      </body>
    </html>
  );
}
