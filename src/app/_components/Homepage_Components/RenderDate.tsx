import { PostorEventItem } from "@/types/componentTypes";
import { isSameDay, addDays, isEqual } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import { de } from "date-fns/locale";

function findDateRanges(days: { date: string }[]) {
  const ranges: { start: Date; end: Date }[] = [];
  if (!days.length) return ranges;

  let rangeStart = new Date(days[0].date);
  let prevDate = new Date(days[0].date);

  for (let i = 1; i <= days.length; i++) {
    const currentDate = i < days.length ? new Date(days[i].date) : null;

    if (!currentDate || !isEqual(addDays(prevDate, 1), currentDate)) {
      ranges.push({
        start: rangeStart,
        end: prevDate,
      });
      if (currentDate) {
        rangeStart = currentDate;
      }
    }
    if (currentDate) {
      prevDate = currentDate;
    }
  }

  return ranges;
}

export default function renderDate(event: PostorEventItem) {
  const timeZone = "Europe/Berlin";

  // Handle new multi-day events
  if (event.eventDays && event.eventDays.length > 0) {
    const days = event.eventDays;

    // Group days by time
    const timeGroups: { [key: string]: { date: string }[] } = {};

    days.forEach((day) => {
      const timeKey = `${day.startTime}-${day.endTime}`;
      if (!timeGroups[timeKey]) {
        timeGroups[timeKey] = [];
      }
      timeGroups[timeKey].push(day);
    });

    // If only one time group, use the range display
    if (Object.keys(timeGroups).length === 1) {
      const dateRanges = findDateRanges(days);
      return (
        <p className="xs:text-lg text-sm">
          {dateRanges.map((range, index) => (
            <span key={index}>
              {format(range.start, "dd.MM.yyyy", { locale: de })}
              {!isEqual(range.start, range.end) &&
                ` - ${format(range.end, "dd.MM.yyyy", { locale: de })}`}
              {index < dateRanges.length - 1 && <br />}
            </span>
          ))}
          <br />
          {`${days[0].startTime} - ${days[0].endTime} Uhr`}
        </p>
      );
    }

    // For multiple time groups, display by group
    return (
      <p className="xs:text-lg text-sm">
        {Object.entries(timeGroups).map(([timeKey, daysInGroup], groupIndex) => {
          const [startTime, endTime] = timeKey.split("-");
          const dateRanges = findDateRanges(daysInGroup);

          return (
            <span key={groupIndex}>
              {dateRanges.map((range, rangeIndex) => (
                <span key={`${groupIndex}-${rangeIndex}`}>
                  {format(range.start, "dd.MM.yyyy", { locale: de })}
                  {!isEqual(range.start, range.end) &&
                    ` - ${format(range.end, "dd.MM.yyyy", { locale: de })}`}
                  <br />
                </span>
              ))}
              {`${startTime} - ${endTime} Uhr`}
              {groupIndex < Object.keys(timeGroups).length - 1 && <br />}
            </span>
          );
        })}
      </p>
    );
  }

  // Reference to legacy event handling
  if (event.eventStart && event.eventEnd) {
    // Legacy event code remains unchanged
    return renderLegacyEvent(event, timeZone);
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

function renderLegacyEvent(event: PostorEventItem, timeZone: string) {
  const start = utcToZonedTime(
    zonedTimeToUtc(event.eventStart!, timeZone),
    timeZone
  );
  const end = utcToZonedTime(
    zonedTimeToUtc(event.eventEnd!, timeZone),
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
