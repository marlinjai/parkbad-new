import { groq } from "next-sanity";

const postFields = groq`
  _id,
  title,
  date,
  showUntilDate,
  _updatedAt,
  content,
  excerpt,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture},
`;
const eventFields = groq`
      _id,
      eventTitle,
      eventContent,
      excerpt,
      eventImage,
      eventStart,
      eventEnd,
      "slug": slug.current,
      "author": author->{name, picture},
`;

const foodFields = groq`
_id,
foodTitle,
regularPrice,
discount,
category,
"slug": slug.current,
"seller": seller->{name, picture},
`;

const drinkFields = groq`
_id,
drinkTitle, 
drinkTitleIntern,
category,
alcoholic,
regularPrice,
size,
discount,
"slug": slug.current,
"seller": seller->{name, picture},
`;

const galleryFields = groq`
_id,
galleryTitle,
images,
"slug": slug.current,
`;

//generated queries

// Get all posts
export const postsQuery = groq`*[_type == "post" && defined(slug.current)]{
${postFields}
}`;

// Get a single post by its slug
export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{ 
${postFields}
}`;

// Get all post slugs
export const postPathsQuery = groq`*[_type == "post"]{
  ${postFields}
}`;

//old queries

export const settingsQuery = groq`*[_type == "settings"][0]`;

export const indexQuery = groq`
*[_type == "post"] | order(date desc, _updatedAt desc) {
  ${postFields}
}`;

export const homePostsQuery = groq`
*[_type == "post" && (showUntilDate > now() || !defined(showUntilDate))] | order(date desc, _updatedAt desc) {
  ${postFields}
}`;

export const eventsQuery = groq`
    *[_type == "customevent"] | order(_updatedAt desc) {
      ${eventFields}
    }
  `;

export const homepageEventsQuery = groq`
  *[_type == "customevent" && (eventEnd > now() || !defined(eventEnd))] | order(_updatedAt desc) {
    ${eventFields}
  }
`;
export const foodQuery = groq`
  *[_type == 'food'] |order(price asc) {${foodFields}}`;

export const drinksQuery = groq`
*[_type == 'drinks'] | order(price asc) {${drinkFields}}`;

export const alcoholicDrinksQuery = groq`
  *[_type =='drink' && alcoholic == true]| order (price asc){${drinkFields}}`;

export const nonAlcoholicDrinksQuery = groq`
*[_type =='drink' && alcoholic != true]| order (price asc){${drinkFields}}`;

export const postAndMoreStoriesQuery = groq`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
    content,
    ${postFields}
  }
}`;

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`;

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ${postFields}
}
`;

export const zoomGalleryQuery = groq`
*[_type == 'gallery' && galleryTitle == "Zoomgallery" ] | order(imageTitle asc){
  ${galleryFields}
}`;

export const galleryHeaderQuery = groq`
*[_type == 'gallery' && galleryTitle == "HistoryHeader" ] | order(imageTitle asc){
  ${galleryFields}
}`;

export const historyFaderQuery = groq`
*[_type == 'gallery' && galleryTitle == "HistoryFader" ] | order(imageTitle asc){
  ${galleryFields}
}`;
