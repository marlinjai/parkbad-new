import { OpeningHour, GroupedOpeningHour } from "@/types/componentTypes";

export default function BusinessHours({
  openingHours: openingHours,
}: {
  openingHours: OpeningHour[];
}) {
  function groupOpeningHours(openingHours: OpeningHour[]): string[] {
    const groupedHours: GroupedOpeningHour[] = [];
    let currentGroup: GroupedOpeningHour | null = null;

    openingHours.forEach((hour, index) => {
      if (!currentGroup || hour.hours !== currentGroup.hours) {
        if (currentGroup) {
          groupedHours.push(currentGroup);
        }
        currentGroup = { days: [hour.dayName], hours: hour.hours };
      } else {
        currentGroup.days.push(hour.dayName);
      }

      if (index === openingHours.length - 1 && currentGroup) {
        groupedHours.push(currentGroup);
      }
    });

    return groupedHours.map((group) => {
      let daysFormatted = "";
      if (group.days.length > 2) {
        // For more than two days, use "Monday - Friday" format
        daysFormatted = `${group.days[0]} - ${
          group.days[group.days.length - 1]
        }`;
      } else {
        // For two or less, use "Monday & Tuesday" format
        daysFormatted = group.days.join(" & ");
      }
      return `${daysFormatted}: ${group.hours}`;
    });
  }

  const formattedOpeningHours = groupOpeningHours(openingHours);

  if (!openingHours || !Array.isArray(openingHours)) {
    return <div className="text-white">Loading...</div>;
  }

  if (openingHours.length === 0) {
    return (
      <div className="text-md mt-pz5 mb-pz2 font-semibold leading-6 text-white sm:mt-0 sm:w-full sm:text-start">
        Unsere Öffnungszeiten: <br />
        <span className="text-sm">Derzeit geschlossen</span>
      </div>
    );
  }

  return (
    <div className="text-lg text-start mt-pz5 font-semibold leading-6 text-white sm:mt-0 sm:w-pz50">
      Unsere Öffnungszeiten: <br />
      <div className="text-sm mt-pz2">
        {formattedOpeningHours.map((hours, index) => (
          <p className=" p-1" key={index}>
            {hours}
          </p>
        ))}
      </div>
    </div>
  );
}
