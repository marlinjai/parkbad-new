import useSWR from "swr";

// Define a fetcher function using the built-in Fetch API
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BusinessHours: React.FC = () => {
  // Using SWR to fetch the opening hours from our API route
  const { data: openingHours, error } = useSWR(
    `/api/googleMaps?businessName=${encodeURIComponent("Parkbad Gütersloh")}`,
    fetcher
  );

  if (error)
    return (
      <div className="text-md mt-pz5 font-semibold leading-6 text-white sm:mt-0 sm:w-full sm:text-start">
        Unsere Öffnungszeiten: <br />
        <span className="text-sm">Derzeit geschlossen</span>
      </div>
    );
  if (!openingHours || !Array.isArray(openingHours)) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="text-md mt-pz5 font-semibold leading-6 text-white sm:mt-0 sm:w-pz50 sm:text-end">
      Unsere Öffnungszeiten: <br />
      <span className="text-sm">
        {openingHours.map((hour: string, index: number) => (
          <p key={index}>{hour}</p>
        ))}
      </span>
    </div>
  );
};

export default BusinessHours;
