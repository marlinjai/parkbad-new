import { PostorEventItem } from "@/types/componentTypes";
import { isSameDay } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import { de } from "date-fns/locale";
import { normalizeEventDays } from '@/lib/events/eventDays';

export default function renderDate(event: PostorEventItem) {
  const timeZone = "Europe/Berlin";

  // Handle new multi-day events
  if (event.eventDays && event.eventDays.length > 0) {
    const normalized = normalizeEventDays(event.eventDays);
    return (
      <div className="xs:text-lg text-sm">
        {normalized.map((day, dayIndex) => {
          const dateStr = format(new Date(day.date), 'dd.MM.yyyy', { locale: de });
          if (!day.isMultiSlot) {
            const slot = day.slots[0];
            return (
              <p key={dayIndex} className="m-0">
                {dateStr}
                {slot ? <><br />{`${slot.startTime} - ${slot.endTime} Uhr`}</> : null}
                {dayIndex < normalized.length - 1 && <br />}
              </p>
            );
          }
          return (
            <div key={dayIndex} className="m-0 mb-2">
              <div className="font-semibold">{dateStr}</div>
              <ul className="list-none m-0 pl-3">
                {day.slots.map((slot, slotIndex) => (
                  <li key={slotIndex} className="m-0">
                    {`${slot.startTime} - ${slot.endTime} Uhr`}
                    {slot.label ? ` · ${slot.label}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
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
