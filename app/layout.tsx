// app/layout.tsx
import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "./context/ThemeContext";
import Web3Provider from "./Web3Provider";
import Footer from "../src/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <ThemeProvider>
            <Web3Provider> {/* From @web3-react/core */}
             <main>{children}</main>
             </Web3Provider>
          </ThemeProvider>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}