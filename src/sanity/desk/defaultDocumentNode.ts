// ./nextjs-app/sanity/desk/defaultDocumentNode.ts

import Iframe from "sanity-plugin-iframe-pane";
import { StructureBuilder } from "sanity/structure";

// Create a function to generate the URL based on the document slug
const generatePreviewURL = (doc: { slug: { current: any } }) => {
  const url = doc?.slug?.current
    ? `http://localhost:3000/api/preview?slug=${doc.slug.current}`
    : `http://localhost:3000/api/preview`;

  console.log("Generated URL:", url); // Log the URL to the console

  return url;
};

export const defaultDocumentNode = (
  S: StructureBuilder,
  { schemaType: schemaType }: { schemaType: string }
) => {
  switch (schemaType) {
    case `post`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
            url: generatePreviewURL,
          })
          .title("Preview"),
      ]);
    default:
      return S.document().views([S.view.form()]);
  }
};
