"use client";

import { urlForImage } from "../../../sanity/lib/sanity.image";
import { client } from "../../../sanity/lib/sanity.client";
import { PostType, CustomEvent } from "@/types/sanityTypes";
import { useEffect, useState, useMemo } from "react";
import { parseISO, compareAsc, compareDesc, format } from "date-fns";
import Image from "next/image";
import Button from "../UtilityComponents/Button";
import renderDate from "../Homepage_Components/RenderDate";
import { PostorEventItem, EventDay } from "@/types/componentTypes";
import { de } from "date-fns/locale";

const builder = urlForImage(client);

export default function Archive({
  posts = [],
  events = [],
}: {
  posts: PostType[];
  events: CustomEvent[];
}) {
  const combinedData = useMemo(
    () => [
      ...events.map((event) => ({
        ...event,
        type: "event",
        title: event.eventTitle,
        startDate: event.eventStart,
        endDate: event.eventEnd,
        coverImage: event.eventImage,
        slug: event.slug,
      })),
      ...posts.map((post) => ({
        ...post,
        type: "post",
        startDate: post.date,
        endDate: post.date,
        title: post.title,
        slug: post.slug,
      })),
    ],
    [events, posts]
  );

  const [data, setData] = useState(combinedData);
  const [filterType, setFilterType] = useState("all"); // default to show all
  const [sortKey, setSortKey] = useState("dateDsc"); // default to newest first

  useEffect(() => {
    console.log("Effect triggered");

    let filteredData = [...combinedData]; // Create a new array instead of mutating state directly

    // Filter by type
    if (filterType !== "all") {
      filteredData = filteredData.filter((item) => item.type === filterType);
    }

    // Sort
    filteredData.sort((a, b) => {
      try {
        // For newest first (descending)
        if (sortKey === "dateDsc") {
          // Handle both eventDays and startDate
          const dateA = (a as any).eventDays?.[0]?.date || a.startDate;
          const dateB = (b as any).eventDays?.[0]?.date || b.startDate;
          return compareDesc(new Date(dateA), new Date(dateB));
        } 
        // For oldest first (ascending)
        else if (sortKey === "dateAsc") {
          // Handle both eventDays and startDate
          const dateA = (a as any).eventDays?.[0]?.date || a.startDate;
          const dateB = (b as any).eventDays?.[0]?.date || b.startDate;
          return compareAsc(new Date(dateA), new Date(dateB));
        }
        else if (sortKey === "titleAsc") {
          return a.title.localeCompare(b.title);
        } 
        else if (sortKey === "titleDsc") {
          return b.title.localeCompare(a.title);
        }
      } catch (error) {
        console.error("Error sorting items:", error);
      }
      return 0;
    });

    console.log("Filtered and sorted data:", filteredData);
    setData(filteredData);
  }, [sortKey, filterType, combinedData]);

  // Function to truncate title to a specific length
  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (!title) return "";
    if (title.length <= maxLength) return title;
    return `${title.substring(0, maxLength)}...`;
  };

  // Function to get a compact date format for the archive view
  const getCompactDateDisplay = (item: any) => {
    // For events with multiple days, show just the date range
    if (item.eventDays && item.eventDays.length > 0) {
      const days = item.eventDays;
      const firstDay = new Date(days[0].date);
      const lastDay = new Date(days[days.length - 1].date);
      
      // Format dates in compact form
      const firstDate = format(firstDay, "dd.MM.yyyy", { locale: de });
      const lastDate = format(lastDay, "dd.MM.yyyy", { locale: de });
      
      if (firstDate === lastDate) {
        return <p className="text-white text-base">{firstDate}</p>;
      }
      
      return <p className="text-white text-base">{firstDate} - {lastDate}</p>;
    }
    
    // For legacy events
    if (item.eventStart && item.eventEnd) {
      const start = new Date(item.eventStart);
      const end = new Date(item.eventEnd);
      
      const startDate = format(start, "dd.MM.yyyy");
      const endDate = format(end, "dd.MM.yyyy");
      
      if (startDate === endDate) {
        return <p className="text-white text-base">{startDate}</p>;
      }
      
      return <p className="text-white text-base">{startDate} - {endDate}</p>;
    }
    
    // For regular posts
    if (item.date) {
      return <p className="text-white text-base">{format(new Date(item.date), "dd.MM.yyyy")}</p>;
    }
    
    return null;
  };

  function getGridClasses(length: number) {
    if (length === 2) {
      return "md:grid-cols-2";
    } else if (length === 3) {
      return "lg:grid-cols-3";
    } else if (length >= 4) {
      return "xl:grid-cols-4";
    } else {
      return "grid-cols-1";
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl m-10 text-brand-colour-light">
          Alle Veranstaltungen & Beiträge
        </h1>
        <div className="">
          <select
            onChange={(e) => setFilterType(e.target.value)}
            className="border p-2 mr-4 rounded-sm"
          >
            <option value="all">All</option>
            <option value="post">Posts</option>
            <option value="event">Events</option>
          </select>
          <select
            onChange={(e) => setSortKey(e.target.value)}
            className="border p-2 rounded-sm"
          >
            <option value="dateDsc">Neuste zuerst</option>
            <option value="dateAsc">Älteste zuerst</option>
            <option value="titleAsc">A - Z</option>
            <option value="titleDsc">Z - A</option>
            {/* Add other sort options as needed */}
          </select>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 ${
          data.length == 2
            ? "md:grid-cols-2"
            : data.length == 3
            ? "lg:grid-cols-3 md:grid-cols-2"
            : data.length >= 4
            ? "xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2"
            : null
        } p-10 gap-6`}
      >
        {data.map((item) => (
          <div key={item._id} className="flex flex-col bg-gray-800 rounded-lg shadow-lg h-full">
            <a href={`/${item.slug}`} className="block overflow-hidden rounded-t-lg">
              <div className="relative h-48 w-full">
                <Image
                  src={builder.image(item.coverImage).url()}
                  alt={item.title}
                  fill={true}
                  sizes={"(min-width: 640px) 50vw, 100vw"}
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </a>
            <div className="p-4 flex flex-col flex-grow">
              <div className="mb-3">
                <h2 className="text-xl text-white font-semibold truncate" title={item.title}>
                  {truncateTitle(item.title)}
                </h2>
              </div>
              
              <div className="mt-auto">
                <div className="mb-4">
                  {getCompactDateDisplay(item)}
                  <p className="text-gray-300 text-sm mt-1">
                    {item.type === "event" ? "Veranstaltung" : "Beitrag"}
                  </p>
                </div>
                
                <Button
                  styles="w-full"
                  href={`/${item.slug}`}
                  text="weiterlesen"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
