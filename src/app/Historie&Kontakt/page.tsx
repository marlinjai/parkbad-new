import ImageFader from "@/app/_components/SwiperComponents/ImageFaderSwiper";
import Image from "next/image";
import SiteLayout from "../_components/UtilityComponents/SiteLayout";
import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import { Gallery, GalleryImage } from "@/types/sanityTypes";
import {
  galleryHeaderQuery,
  historyFaderQuery,
} from "@/sanity/lib/sanity.queries";
import { urlForImage } from "@/sanity/lib/sanity.image";
import { client } from "@/sanity/lib/sanity.client";
import Kontakt from "../_components/UtilityComponents/Kontakt";

const stats = [
  { label: "Parkbad ist Tradition", value: "seit 95 Jahren" },
  {
    label: "Ein Ort um die Seele baumeln zu lassen",
    value: "Naherholung in Gütersloh",
  },
];
const values = [
  {
    name: "Jeder ist willkommen",
    description:
      "Wir fördern aktiv eine Kultur der Inklusivität und Vielfalt, indem wir Mitarbeiter und Kunden unabhängig von Herkunft, Geschlecht oder Überzeugung wertschätzen.",
  },
  {
    name: "Qualität in Gastro und Service",
    description:
      "Unsere handverlesenen Zutaten und engagierten Mitarbeiter sorgen dafür, dass unser gastronomisches Angebot und unser Service stets höchsten Standards entsprechen.",
  },
  {
    name: "Unterstütze Andere",
    description:
      "Jeder Einzelne ist eine wertvolle Ressource. Durch Mentoring, Teambuilding und gemeinsame Projekte schaffen wir eine Kultur der gegenseitigen Unterstützung.",
  },
  {
    name: "Direkte Kommunikation",
    description:
      "Durch offene Dialoge und transparente Entscheidungsprozesse schaffen wir eine Arbeitsatmosphäre, die sowohl die Teamarbeit als auch die Kundenzufriedenheit fördert.",
  },
];

const builder = urlForImage(client);

export default async function Historie() {
  const historyImages = await sanityFetch<Gallery[]>({
    query: galleryHeaderQuery,
  });

  const faderImages = await sanityFetch<Gallery[]>({
    query: historyFaderQuery,
  });

  const Faderformatted = faderImages[0].images.map((image) => ({
    src: builder.image(image).url(),
    alt: image.alt,
  }));

  return (
    <>
      <SiteLayout>
        {/* Hero section */}
        <div className="relative isolate -z-10">
          <svg
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
            />
          </svg>
          <div
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
            aria-hidden="true"
          >
            <div
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-brand-accent-4 to-brand-colour-dark opacity-30"
              style={{
                clipPath:
                  "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
              }}
            />
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tight text-brand-colour-light sm:text-6xl">
                    Historie und Geschichte sind uns wichtig, und das schon seit
                    95 Jahren!
                  </h1>
                  <p className="relative mt-6 text-lg leading-8 text-brand-colour-light sm:max-w-md lg:max-w-none">
                    Mit 95 Jahren Geschichte sind wir fest in der Gemeinschaft
                    von Gütersloh verwurzelt und stolz darauf, Generationen von
                    Gästen begleitet zu haben. Wir vereinen Tradition mit
                    Innovation, um ein vielseitiges Angebot zu schaffen, das von
                    Gastronomie über Sport bis hin zu Veranstaltungen und Kultur
                    reicht.
                  </p>
                </div>
                <div className="mt-14 flex justify-end gap-4 sm:-mt-44 sm:justify-start sm:gap-8 sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <Image
                        src={
                          historyImages[0].images
                            ? builder.image(historyImages[0].images[0]).url()
                            : ""
                        }
                        alt={historyImages[0].images[0].alt}
                        width={250}
                        height={600}
                        className=" w-full rounded-xl bg-gray-900/5 object-cover object-top shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <Image
                        src={
                          historyImages[0].images
                            ? builder.image(historyImages[0].images[1]).url()
                            : ""
                        }
                        alt={historyImages[0].images[1].alt}
                        width={200}
                        height={600}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <Image
                        src={
                          historyImages[0].images
                            ? builder.image(historyImages[0].images[2]).url()
                            : ""
                        }
                        alt={historyImages[0].images[2].alt}
                        width={200}
                        height={600}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover  shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <Image
                        src={
                          historyImages[0].images
                            ? builder.image(historyImages[0].images[3]).url()
                            : ""
                        }
                        alt={historyImages[0].images[3].alt}
                        width={200}
                        height={600}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <Image
                        src={
                          historyImages[0].images
                            ? builder.image(historyImages[0].images[4]).url()
                            : ""
                        }
                        alt={historyImages[0].images[4].alt}
                        width={200}
                        height={600}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="mx-auto -mt-12 max-w-5xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-brand-colour-light sm:text-4xl">
              Unsere Mission
            </h2>
            <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
              <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                <p className="text-xl leading-8 text-brand-colour-light/50">
                  Seit fast einem Jahrhundert ist das Parkbad mehr als nur ein
                  Schwimmbad – es ist ein lebendiges Kulturgut, ein Ort der
                  Begegnung und ein Zufluchtsort in der Hektik des Alltags.
                </p>
                <div className="mt-10 max-w-xl text-base leading-7 text-brand-colour-light/50">
                  <p>
                    Unser Ziel ist es, eine Oase der Erholung und des
                    Wohlbefindens für alle Altersgruppen und Lebenslagen zu
                    bieten. Ob Sie ein Kinderbecken für den ersten
                    Schwimmunterricht suchen, eine idyllische Umgebung für Ihre
                    Freizeitgestaltung wünschen oder kulinarische und kulturelle
                    Veranstaltungen genießen wollen – das Parkbad ist Ihr Ort.
                  </p>
                </div>
              </div>
              <div className="lg:flex lg:flex-auto lg:justify-center">
                <dl className="w-64 space-y-8 xl:w-80">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col-reverse gap-y-4"
                    >
                      <dt className="text-base leading-7 text-brand-colour-light/50">
                        {stat.label}
                      </dt>
                      <dd className="text-5xl font-semibold tracking-tight text-brand-colour-light">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>

        <ImageFader images={Faderformatted}></ImageFader>

        {/* Values section */}
        <div className="mx-auto p-20 max-w-5xl px-10 sm:-mt-4 sm:mb-24 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-brand-colour-light sm:text-4xl">
              Unsere Werte
            </h2>
            <p className="mt-6 text-lg leading-8 text-brand-colour-light/50">
              Das Fundament unserer Kultur: Wofür wir stehen
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-xl grid-cols-1 gap-x-36 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none">
            {values.map((value) => (
              <div key={value.name}>
                <dt className="font-semibold text-brand-colour-light">
                  {value.name}
                </dt>
                <dd className="mt-1 text-brand-colour-light/50">
                  {value.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {/* <Kontakt></Kontakt> */}
      </SiteLayout>
    </>
  );
}
