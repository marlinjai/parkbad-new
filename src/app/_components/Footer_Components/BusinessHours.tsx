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
  // Debug logging
  console.log("🕐 BusinessHours received data:", openingHours);
  function translateDay(day: string): string {
    return dayTranslation[day] || day;
  }

  // Convert 12-hour format time to 24-hour format
  function convertTo24Hour(timeString: string): string {
    // Remove any extra spaces and extract time and period
    const cleanTime = timeString.trim();
    
    // Check if time already has AM/PM
    const periodMatch = cleanTime.match(/\b(AM|PM)\b/i);
    
    if (periodMatch) {
      // Time has AM/PM - convert to 24-hour format
      const period = periodMatch[0].toUpperCase();
      const timeWithoutPeriod = cleanTime.replace(/\b(AM|PM)\b/i, "").trim();
      let [hours, minutes] = timeWithoutPeriod.split(":").map(part => parseInt(part, 10));
      
      if (period === "PM" && hours !== 12) {
        hours += 12; // Add 12 hours for PM times (except 12 PM)
      } else if (period === "AM" && hours === 12) {
        hours = 0; // 12 AM becomes 00:00
      }
      
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    } else {
      // Time is already in 24-hour format or doesn't have AM/PM
      // Just ensure proper formatting
      const [hours, minutes] = cleanTime.split(":").map(part => parseInt(part, 10));
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }
  }

  function translateHours(hoursString: string) {
    console.log("🕐 Translating hours:", hoursString);
    
    if (hoursString.toLowerCase() === "closed") {
      return "geschlossen";
    } else {
      // Split the hours string into start and end times
      const timeRange = hoursString.split("–").map(time => time.trim());
      
      console.log("🕐 Time range split:", timeRange);
      
      if (timeRange.length !== 2) {
        // If we can't parse the format, return as-is
        console.log("🕐 Could not parse time range, returning as-is");
        return hoursString;
      }
      
      let [startTime, endTime] = timeRange;
      
      // Handle Google's format where start time might be missing AM/PM
      // If end time has PM and start time doesn't have AM/PM, default to PM unless it's clearly AM
      if (endTime.includes("PM") && !startTime.includes("AM") && !startTime.includes("PM")) {
        // Simple rule: if closing time is PM, opening time is also PM unless it has AM explicitly
        // This matches your observation about the Google API behavior
        startTime = startTime + " PM";
      }
      // Similar logic for AM
      else if (endTime.includes("AM") && !startTime.includes("AM") && !startTime.includes("PM")) {
        startTime = startTime + " AM";
      }
      
      // Convert both times to 24-hour format
      const startTime24 = convertTo24Hour(startTime);
      const endTime24 = convertTo24Hour(endTime);
      
      console.log("🕐 Converted times:", startTime, "->", startTime24, "|", endTime, "->", endTime24);
      
      return `${startTime24} – ${endTime24}`;
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
