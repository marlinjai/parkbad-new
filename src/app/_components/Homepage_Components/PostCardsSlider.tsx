// import React, { useEffect, useState } from "react";
// import type { CustomEvent, PostType } from "@/types/sanityTypes";
// import { CardSwiper, SwiperSlide } from "../Swiper_Components/MyCardsSwiper";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "swiper/css/autoplay";
// import PostSliderImage from "../Posts&Events_Components/PostImage";
// import { format, isSameDay } from "date-fns";
// import { HomePageProps } from "@/types/componentTypes";

// export default function PostCardsSlider({
//   preview,
//   posts,
//   customevents,
// }: HomePageProps) {
//   return (
//     <>
//       <h2 id="News" className="mt-pz10 text-3sc">
//         Neuigkeiten & Veranstaltungen
//       </h2>
//       {posts.length == 0 && customevents.length == 0 ? (
//         "aktuell gitb es keine Beiträge und Events"
//       ) : (
//         <CardSwiper
//           key={swiperKey} // Swiper key for reinitialization
//           navigation={{
//             nextEl: ".my-swiper-button-next",
//             prevEl: ".my-swiper-button-prev",
//           }}
//           className="mySwiper"
//         >
//           {customevents.map((event) => {
//             const start = new Date(event.eventStart);
//             const end = new Date(event.eventEnd);

//             // Determine if the start and end dates are the same day
//             const isSameStartDateAndEndDate = isSameDay(start, end);

//             let formattedStartDay = format(start, "dd.MM.yyyy");
//             let formattedEndDay = format(end, "dd.MM.yyyy");
//             let formattedEndTime = format(end, "HH.mm");
//             let formattedStartTime = format(start, "HH.mm");

//             return (
//               // ... Your existing JSX for custom events
//               <SwiperSlide key={event._id}>
//                 <PostSliderImage
//                   slug={event.slug}
//                   title={event.eventTitle}
//                   image={event.eventImage}
//                   priority={false}
//                   fit="cover"
//                   width={1200}
//                   height={800}
//                 />
//                 <div className="absolute bottom-10 z-50 w-full">
//                   <div className="overlay flex flex-col items-center justify-center">
//                     <svg
//                       id="Layer_1"
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 92 5"
//                       className=" mb-2 h-1 w-12  stroke-brand-colour-light"
//                     >
//                       <line
//                         x1="2.5"
//                         y1="2.5"
//                         x2="89.5"
//                         y2="2.5"
//                         strokeLinecap="round"
//                         strokeMiterlimit="10"
//                         strokeWidth="5"
//                       />
//                     </svg>

//                     <h2 className="my-2 text-3sc md:text-4sc">
//                       {event.eventTitle}
//                     </h2>
//                     <p className=" my-2 px-40 text-sm md:text-lg">
//                       {event.excerpt}
//                     </p>
//                     <p className=" text-md">
//                       {isSameStartDateAndEndDate
//                         ? formattedStartDay
//                         : formattedStartDay +
//                           " " +
//                           formattedStartTime +
//                           " - " +
//                           formattedEndDay +
//                           " " +
//                           formattedEndTime}
//                     </p>
//                     <p className="text-sm">
//                       {isSameStartDateAndEndDate
//                         ? formattedStartTime + " - " + formattedEndTime
//                         : ""}
//                     </p>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             );
//           })}

//           {posts.map((post) => (
//             // ... Your existing JSX for posts

//             <SwiperSlide key={post._id}>
//               <PostSliderImage
//                 slug={post.slug}
//                 title={post.title}
//                 image={post.coverImage}
//                 priority={false}
//                 fit="cover"
//                 width={1200}
//                 height={800}
//               />
//               <div className="absolute bottom-10 z-50 w-full">
//                 <div className="overlay flex flex-col items-center justify-center">
//                   <svg
//                     id="Layer_1"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 92 5"
//                     className=" mb-2 h-1 w-12  stroke-brand-colour-light"
//                   >
//                     <line
//                       x1="2.5"
//                       y1="2.5"
//                       x2="89.5"
//                       y2="2.5"
//                       strokeLinecap="round"
//                       strokeMiterlimit="10"
//                       strokeWidth="5"
//                     />
//                   </svg>
//                   <h2 className="text-3sc ">{post.title}</h2>
//                   <p>{post.excerpt}</p>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </CardSwiper>
//       )}
//     </>
//   );
// }
