import { GroupedOpeningHour, OpeningHour } from "@/types/componentTypes";

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

  function convertTo24Hour(time: any, modifier = "") {
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours, 10); // Ensure 'hours' is treated as a number initially for logic checks

    if (!modifier && hours < 12) {
      modifier = "AM"; // Default to PM if no modifier is provided and hours < 12
    }

    if (hours === 12 && modifier === "AM") {
      hours = 0; // Midnight is 00 in 24-hour time
    } else if (modifier === "PM" && hours < 12) {
      hours += 12; // Convert PM hours to 24-hour format
    }

    // Ensure 'hours' is converted back to a string with 'padStart' applied
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  function translateHours(hoursString: string) {
    if (hoursString.toLowerCase() === "closed") {
      return "geschlossen";
    } else {
      // Detect if the string includes AM or PM and capture the period for conversion
      const periodMatch = hoursString.match(/\b(AM|PM)\b/i);
      const period = periodMatch ? periodMatch[0] : "";

      let [start, end] = hoursString
        .split(" – ")
        .map((s) => s.replace(/\b(AM|PM)\b/i, "").trim());

      // Convert start and end times to 24-hour format
      const startTime = convertTo24Hour(start, period);
      const endTime = convertTo24Hour(end, period);

      // Directly return the converted times without appending AM/PM
      return `${startTime} – ${endTime}`;
    }
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
      <div className="text-md mt-pz5 mb-pz2  font-semibold leading-6 text-white sm:mt-0 sm:w-full sm:text-start">
        <p className="my-2 md:text-2xl">Unsere Öffnungszeiten:</p>
        <span className="text-md">Derzeit geschlossen</span>
      </div>
    );
  }

  return (
    <div className=" text-start mt-pz5  text-white sm:mt-0 sm:w-pz50 mb-4">
      <h4 className="text-lg md:text-2xl font-semibold">
        Unsere Öffnungszeiten:
      </h4>
      <div className="text-md my-pz2">
        {formattedOpeningHours.map((hours, index) => (
          <p className="py-1" key={index}>
            {hours}
          </p>
        ))}
      </div>
    </div>
  );
}
