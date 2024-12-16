import { PostorEventItem } from "@/types/componentTypes";
import { isSameDay } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import { de } from "date-fns/locale";

export default function renderDate(event: PostorEventItem) {
  const timeZone = "Europe/Berlin";

  // Handle new multi-day events
  if (event.eventDays && event.eventDays.length > 0) {
    const days = event.eventDays;

    if (days.length === 1) {
      // Single day event
      const day = days[0];
      const date = new Date(day.date);
      return (
        <p className="xs:text-lg text-sm">
          {format(date, "dd.MM.yyyy", { locale: de })}
          <br />
          {day.startTime} - {day.endTime} Uhr
        </p>
      );
    } else {
      // Multi-day event
      const firstDay = new Date(days[0].date);
      const lastDay = new Date(days[days.length - 1].date);

      // Check if all days have the same times
      const allSameTime = days.every(
        (day) =>
          day.startTime === days[0].startTime && day.endTime === days[0].endTime
      );

      return (
        <p className="xs:text-lg text-sm">
          {format(firstDay, "dd.MM.yyyy", { locale: de })} -{" "}
          {format(lastDay, "dd.MM.yyyy", { locale: de })}
          <br />
          {allSameTime && `${days[0].startTime} - ${days[0].endTime} Uhr`}
        </p>
      );
    }
  }

  // Handle legacy events
  if (event.eventStart && event.eventEnd) {
    const start = utcToZonedTime(
      zonedTimeToUtc(event.eventStart, timeZone),
      timeZone
    );
    const end = utcToZonedTime(
      zonedTimeToUtc(event.eventEnd, timeZone),
      timeZone
    );

    const isSameStartDateAndEndDate = isSameDay(start, end);
    let formattedStartDay = format(start, "dd.MM.yyyy", { locale: de });
    let formattedEndDay = format(end, "dd.MM.yyyy", { locale: de });
    let formattedEndTime = format(end, "HH:mm");
    let formattedStartTime = format(start, "HH:mm");

    return (
      <p className="xs:text-lg text-sm">
        {isSameStartDateAndEndDate ? (
          <>
            {formattedStartDay}
            <br />
            {formattedStartTime} - {formattedEndTime} Uhr
          </>
        ) : (
          <>
            {formattedStartDay} - {formattedEndDay}
            <br />
            {formattedStartTime} - {formattedEndTime} Uhr
          </>
        )}
      </p>
    );
  }

  // Handle regular posts with date
  if (event.date) {
    const date = utcToZonedTime(zonedTimeToUtc(event.date, timeZone), timeZone);
    return (
      <p className="xs:text-lg text-sm">
        {format(date, "dd.MM.yyyy", { locale: de })}
      </p>
    );
  }

  return null;
}
