import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";

import { defineConfig } from "sanity";
import schemas from "../schemas";
import { dataset, projectId, title, apiVersion } from "../env";

const config = defineConfig({
  projectId,
  dataset,
  title,
  apiVersion,
  basePath: "/admin",
  plugins: [
    deskTool(),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemas },
});

export default config;
