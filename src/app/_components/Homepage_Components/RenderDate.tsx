import { PostorEventItem } from "@/types/componentTypes";
import { isSameDay } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";

// ...

// ...

export default function renderDate(event: PostorEventItem) {
  const timeZone = "Europe/Berlin";
  if (event.eventStart && event.eventEnd) {
    const timeZone = "Europe/Berlin"; // replace with your desired timezone

    console.log("event", event);

    const start = utcToZonedTime(
      zonedTimeToUtc(event.eventStart, timeZone),
      timeZone
    );
    const end = utcToZonedTime(
      zonedTimeToUtc(event.eventEnd, timeZone),
      timeZone
    );

    // Determine if the start and end dates are the same day
    const isSameStartDateAndEndDate = isSameDay(start, end);

    let formattedStartDay = format(start, "dd.MM.yyyy");
    let formattedEndDay = format(end, "dd.MM.yyyy");
    let formattedEndTime = format(end, "HH.mm");
    let formattedStartTime = format(start, "HH.mm");
    return (
      <p className="xs:text-lg text-sm">
        {isSameStartDateAndEndDate
          ? [
              formattedStartDay,
              " ",
              <br className="" key="br1" />,
              formattedStartTime,
              " - ",
              formattedEndTime,
              " Uhr",
            ]
          : [
              formattedStartDay,
              " ",
              formattedStartTime,
              <br className="sm:hidden" key="br1" />,
              " - ",
              <br className="sm:hidden" key="br2" />,
              formattedEndDay,
              " ",
              formattedEndTime,
            ]}
      </p>
    );
  }
  if (event.date) {
    const date = utcToZonedTime(zonedTimeToUtc(event.date, timeZone), timeZone);
    let formattedDate = format(date, "dd.MM.yyyy");
    return <p className="">{formattedDate}</p>;
  }
}
