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
