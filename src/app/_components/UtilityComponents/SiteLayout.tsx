import AlertBanner from "./AlertBanner";
import { Header } from "../Header_Components/Header";
import Footer from "../Footer_Components/Footer";

export default function SiteLayout({
  children,
  preview,
}: {
  children: React.ReactNode;
  preview?: boolean;
}) {
  return (
    <>
      <Header></Header>
      <AlertBanner preview={preview} />
      <main className="flex justify-center flex-col min-h-vh40 bg-brand-accent-2">
        {children}
      </main>
      <Footer></Footer>
    </>
  );
}
