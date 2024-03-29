import { PostorEventItem } from "@/types/componentTypes";
import { format, isSameDay } from "date-fns";

export default function renderTime(event: PostorEventItem) {
  if (event.eventStart && event.eventEnd) {
    console.log("eventstart", event.eventStart);
    console.log("eventend", event.eventEnd);

    const start = new Date(event.eventStart);

    console.log("start", start);
    const end = new Date(event.eventEnd);

    console.log("end", end);
    // Determine if the start and end dates are the same day
    const isSameStartDateAndEndDate = isSameDay(start, end);

    let formattedStartDay = format(start, "dd.MM.yyyy");
    let formattedEndDay = format(end, "dd.MM.yyyy");
    let formattedEndTime = format(end, "HH.mm");
    let formattedStartTime = format(start, "HH.mm");
    return (
      <p className="xs:text-xl text-xs">
        {isSameStartDateAndEndDate
          ? [formattedStartDay, " ", <br className="" key="br1" />]
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
    const date = new Date(event.date);
    let formattedDate = format(date, "dd.MM.yyyy");
    return "";
  }
}
