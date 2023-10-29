import AlertBanner from "./AlertBanner";
import { Header } from "./Header_Components/Header";
import Footer from "./Footer_Components/Footer";

export default function SiteLayout({
  children,
  preview,
}: {
  children: React.ReactNode;
  preview: boolean;
}) {
  return (
    <>
      <div className="min-h-screen">
        <Header></Header>
        <AlertBanner preview={preview} />
        <main>{children}</main>
        <Footer></Footer>
      </div>
    </>
  );
}
