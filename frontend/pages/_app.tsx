import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from 'next-i18next';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
// Import i18n configuration
import '../i18n';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

// Export with translation wrapper
export default appWithTranslation(MyApp);
