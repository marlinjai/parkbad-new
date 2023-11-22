"use client";

import { urlForImage } from "@/sanity/lib/sanity.image";
import { client } from "@/sanity/lib/sanity.client";
import { PostType, CustomEvent } from "@/types/sanityTypes";
import { useEffect, useState } from "react";
import { parseISO, compareAsc } from "date-fns";
import Image from "next/image";

const builder = urlForImage(client);

export default function Archive({
  posts = [],
  events = [],
}: {
  posts: PostType[];
  events: CustomEvent[];
}) {
  // Map and normalize the data structure
  const combinedData = [
    ...posts.map((post) => ({
      ...post,
      type: "post",
      date: post._updatedAt,
      slug: post.slug,
    })), // Use _updatedAt if date isn't available
    ...events.map((event) => ({
      ...event,
      type: "event",
      title: event.eventTitle, // Normalize eventTitle to title
      date: event.eventStart, // Use eventStart as date for sorting
      coverImage: event.eventImage, // Normalize eventImage to mainImage
      slug: event.slug, // Normalize slug
    })),
  ];

  const [data, setData] = useState(combinedData);
  const [filterType, setFilterType] = useState("all"); // default to show all
  const [sortKey, setSortKey] = useState("date"); // default sort key

  useEffect(() => {
    let filteredData = combinedData;

    // Filter by type
    if (filterType !== "all") {
      filteredData = filteredData.filter((item) => item.type === filterType);
    }

    // Sort
    filteredData.sort((a, b) => {
      if (sortKey === "date") {
        return compareAsc(parseISO(a.date), parseISO(b.date));
      } else if (sortKey === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    setData(filteredData);
  }, [sortKey, filterType, combinedData]);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl m-10 text-brand-colour-light">
          Alle Veranstaltungen & Beiträge
        </h1>
        <div className="">
          <select
            onChange={(e) => setFilterType(e.target.value)}
            className="border p-2 mr-4"
          >
            <option value="all">All</option>
            <option value="post">Posts</option>
            <option value="event">Events</option>
          </select>
          <select
            onChange={(e) => setSortKey(e.target.value)}
            className="border p-2"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            {/* Add other sort options as needed */}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1  xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 p-10">
        {data.map((item) => (
          <div key={item._id} className="  p-4 rounded-lg ">
            <div className="relative h-60 w-full">
              <Image
                src={builder.image(item.coverImage).url()}
                alt={item.title}
                fill={true}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="p-4">
              <h2 className="text-2xl text-white font-semibold">
                {item.title}
              </h2>
              <p className="text-white mt-2">{item.excerpt}</p>

              <a href={`/${item.slug}`}>
                <div className=" bg-brand-colour-light text-center p-4 rounded-full">
                  Weiterlesen
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
