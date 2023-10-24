import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";

import { defineConfig } from "sanity";
import schemas from "../schemas";
import { dataset, projectId, title, apiVersion } from "../env";
import { myTheme } from "../theme";
import StudioLogo from "@/app/_components/Sanity_Components/StudioLogo";
import StudioNavbar from "@/app/_components/Sanity_Components/StudioNavbar";

const config = defineConfig({
  projectId,
  dataset,
  title,
  apiVersion,
  basePath: "/admin",
  schema: { types: schemas },
  plugins: [
    deskTool(),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  studio: {
    components: {
      logo: StudioLogo,
      navbar: StudioNavbar,
    },
  },
  theme: myTheme,
});

export default config;
