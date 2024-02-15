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

import { defaultDocumentNode } from "../desk/defaultDocumentNode";
import { structure } from "../desk/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

const config = defineConfig({
  projectId,
  dataset,
  title,
  apiVersion,
  basePath: "/admin",
  icon: StudioIcon,
  schema: { types: schemas },
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
            S.documentTypeListItem("food").title("Speisen"),
            // S.listItem()
            //   .title("Getränke nach Kategorie")
            //   .icon(BiSolidDrink)
            //   .child(
            //     S.documentTypeList("drinkCategories")
            //       .title("Kategorien")
            //       .child((categoryId) =>
            //         S.documentList()
            //           .title("Getränke")
            //           .filter(
            //             '_type == "drinks" && $categoryId == drinkCategory._ref'
            //           )
            //           .params({ categoryId })
            //       )
            //   ),
            orderableDocumentListDeskItem({
              type: "drinkCategories",
              title: "Getränke Kategorien",
              icon: BiSolidDrink,

              S,
              context,
            }),
            S.documentTypeListItem("drinks").title("alle Getränke"),
            S.documentTypeListItem("gallery").title("Gallerien"),
            S.documentTypeListItem("media.tag").title("Media Tags"),
          ]);
      },
    }),

    media(),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
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
