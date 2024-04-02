"use client";

import { urlForImage } from "../../../sanity/lib/sanity.image";
import { client } from "../../../sanity/lib/sanity.client";
import { PostType, CustomEvent } from "@/types/sanityTypes";
import { useEffect, useState, useMemo } from "react";
import { parseISO, compareAsc, compareDesc } from "date-fns";
import Image from "next/image";
import Button from "../UtilityComponents/Button";
import renderDate from "../Homepage_Components/RenderDate";

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
  const [sortKey, setSortKey] = useState("date"); // default sort key

  useEffect(() => {
    console.log("Effect triggered");

    let filteredData = [...combinedData]; // Create a new array instead of mutating state directly

    // Filter by type
    if (filterType !== "all") {
      filteredData = filteredData.filter((item) => item.type === filterType);
    }

    // Sort
    filteredData.sort((a, b) => {
      if (sortKey === "dateDsc") {
        return compareAsc(parseISO(a.startDate), parseISO(b.startDate));
      } else if (sortKey === "dateAsc") {
        return compareAsc(parseISO(b.startDate), parseISO(a.startDate));
      } else if (sortKey === "titleAsc") {
        return a.title.localeCompare(b.title);
      } else if (sortKey === "titleDsc") {
        return b.title.localeCompare(a.title);
      }

      return 0;
    });

    console.log("Filtered and sorted data:", filteredData);

    setData(filteredData);
  }, [sortKey, filterType, combinedData]);
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
        className={`grid grid-cols-1  xs:grid-cols-2 md:grid-cols-3 ${
          data.length == 2
            ? "md:grid-cols-2"
            : data.length == 3
            ? "lg:grid-cols-3 md:grid-cols-2"
            : data.length >= 4
            ? "xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2"
            : null
        }  p-10`}
      >
        {data.map((item) => (
          <div key={item._id} className="  p-4 rounded-lg ">
            <a href={`/${item.slug}`}>
              <div className="relative h-vw35 md:h-vw20 w-full">
                <Image
                  src={builder.image(item.coverImage).url()}
                  alt={item.title}
                  fill={true}
                  sizes={"(min-width: 640px) 50vw, 100vw"}
                  className="object-cover rounded-lg"
                />
              </div>
            </a>
            <div className="p-4 text-center flex flex-col justify-start">
              <div className=" h-16 flex justify-center items-center">
                <h2 className="text-2xl text-white font-semibold">
                  {item.title}
                </h2>
              </div>
              {/* 
              <p className="text-white text-lg mt-2 h-24">{item.excerpt}</p> */}
              <div className=" h-20 flex justify-center items-center">
                <p className="text-white text-lg">{renderDate(item)}</p>
              </div>
              <div className=" h-16 flex justify-center items-center">
                <Button
                  styles="w-pz80"
                  href={`/${item.slug}`}
                  text="weiterlesen"
                ></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
