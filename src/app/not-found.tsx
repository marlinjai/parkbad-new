import type { Metadata } from "next";
import Link from "next/link";
import SiteLayout from "./_components/UtilityComponents/SiteLayout";
import SectionBackground from "./_components/UtilityComponents/SectionBackground";

// Shown with status 404 for any address that does not exist, including a
// removed or mistyped post or event under /[slug]. It keeps the site's header
// and footer and offers the two ways on that visitors most likely want: the
// start page, and the current posts and events (where old event links lead).
export const metadata: Metadata = {
  title: "Seite nicht gefunden | Parkbad Gütersloh",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteLayout>
      <SectionBackground className="min-h-[60svh] flex items-center">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="font-carlson text-2sc text-brand-accent-4">404</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-brand-colour-light sm:text-4xl">
            Diese Seite gibt es nicht (mehr)
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Vielleicht ist die Veranstaltung schon vorbei oder der Link hat sich
            geändert. Hier geht es weiter:
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-primary-buton-color px-6 py-3 font-semibold text-brand-text-button transition-colors hover:bg-primary-buton-color-hover hover:text-brand-text-button-hover"
            >
              Zur Startseite
            </Link>
            <Link
              href="/Neuigkeiten&Events"
              className="rounded-full border border-brand-colour-light px-6 py-3 font-semibold text-brand-colour-light transition-colors hover:border-brand-accent-4 hover:text-brand-accent-4"
            >
              Neuigkeiten &amp; Events
            </Link>
          </div>
        </div>
      </SectionBackground>
    </SiteLayout>
  );
}
