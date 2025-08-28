import { StructureBuilder, structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";

import { defineConfig } from "sanity";
import schemas from "../schemas";
import { dataset, projectId, title, apiVersion } from "../env";
import { myTheme } from "../theme";
import StudioNavbar from "@/app/_components/Sanity_Components/StudioNavbar";
import StudioIcon from "@/app/_components/Sanity_Components/StudioIcon";
import CustomToolMenu from "@/app/_components/Sanity_Components/CustomToolMenu";
import { media } from "sanity-plugin-media";
import { BiSolidDrink } from "react-icons/bi";
import { PiPizzaDuotone } from "react-icons/pi";

import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

const config = defineConfig({
  projectId,
  dataset,
  title,
  basePath: "/admin",
  icon: StudioIcon,
  schema: { types: schemas },
  form: {
    image: {
      directUploads: true,
    },
    file: {
      directUploads: true,
    }
  },
  plugins: [
    structureTool({
      structure: (S: StructureBuilder, context) => {
        console.log(context);
        // Define your custom structure here
        return S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("subBusiness").title(
              "Unternehmen im Parkbad"
            ),
            S.documentTypeListItem("post").title("Beiträge"),
            S.documentTypeListItem("customevent").title("Events"),
            orderableDocumentListDeskItem({
              type: "foodCategories",
              title: "Speise Kategorien",
              icon: PiPizzaDuotone,
              S,
              context,
            }),
            S.documentTypeListItem("food").title("alle Speisen"),
            orderableDocumentListDeskItem({
              type: "drinkCategories",
              title: "Getränke Kategorien",
              icon: BiSolidDrink,
              S,
              context,
            }),
            S.documentTypeListItem("drinks").title("alle Getränke"),
            S.documentTypeListItem("gallery").title("Gallerien"),
          ]);
      },
    }),
    media(),
    unsplashImageAsset(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  studio: {
    components: {
      navbar: StudioNavbar,
      toolMenu: CustomToolMenu,
    },
  },
  theme: myTheme,
});

export default config;
