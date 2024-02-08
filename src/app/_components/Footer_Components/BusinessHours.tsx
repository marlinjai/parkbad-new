import { OpeningHour, GroupedOpeningHour } from "@/types/componentTypes";

// Mapping English days to German
const dayTranslation: { [key: string]: string } = {
  Monday: "Montag",
  Tuesday: "Dienstag",
  Wednesday: "Mittwoch",
  Thursday: "Donnerstag",
  Friday: "Freitag",
  Saturday: "Samstag",
  Sunday: "Sonntag",
};

export default function BusinessHours({
  openingHours,
}: {
  openingHours: OpeningHour[];
}) {
  function translateDay(day: string): string {
    return dayTranslation[day] || day;
  }

  function translateHours(hours: string): string {
    return hours === "Closed" ? "geschlossen" : hours; // Adjust the string 'Closed' as per your actual data
  }

  function groupOpeningHours(openingHours: OpeningHour[]): string[] {
    const groupedHours: GroupedOpeningHour[] = [];
    let currentGroup: GroupedOpeningHour | null = null;

    openingHours.forEach((hour, index) => {
      const translatedDay = translateDay(hour.dayName);
      const translatedHours = translateHours(hour.hours);

      if (!currentGroup || translatedHours !== currentGroup.hours) {
        if (currentGroup) {
          groupedHours.push(currentGroup);
        }
        currentGroup = { days: [translatedDay], hours: translatedHours };
      } else {
        currentGroup.days.push(translatedDay);
      }

      if (index === openingHours.length - 1 && currentGroup) {
        groupedHours.push(currentGroup);
      }
    });

    return groupedHours.map((group) => {
      let daysFormatted = "";
      if (group.days.length > 2) {
        daysFormatted = `${group.days[0]} - ${
          group.days[group.days.length - 1]
        }`;
      } else {
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
          <p className="p-1" key={index}>
            {hours}
          </p>
        ))}
      </div>
    </div>
  );
}
