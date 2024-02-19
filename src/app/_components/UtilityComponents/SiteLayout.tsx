import AlertBanner from "./AlertBanner";
import { Header } from "../Header_Components/Header";
import Footer from "../Footer_Components/Footer";
import fetchOpeningHours from "@/app/services/googleMaps";

export default async function SiteLayout({
  children,
  preview,
}: {
  children: React.ReactNode;
  preview?: boolean;
}) {
  const openingHours = await fetchOpeningHours("Parkbad Gütersloh");
  // const openingHours = await fetchOpeningHours("Scheunerei");

  return (
    <>
      <Header></Header>
      <AlertBanner preview={preview} />
      <main className="flex justify-center flex-col min-h-vh40 bg-brand-accent-2">
        {children}
      </main>
      <Footer openingHours={openingHours}></Footer>
    </>
  );
}
