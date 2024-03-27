import { PostorEventItem } from "@/types/componentTypes";
import { format, isSameDay, parseISO } from "date-fns";

export default function renderDate(event: PostorEventItem) {
  if (event.eventStart && event.eventEnd) {
    const start = parseISO(event.eventStart);
    const end = parseISO(event.eventEnd);

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
    const date = parseISO(event.date);
    let formattedDate = format(date, "dd.MM.yyyy");
    return <p className="">{formattedDate}</p>;
  }
}
