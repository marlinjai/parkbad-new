import { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items(
      // List all document types except "siteSettings"
      S.documentTypeListItems().filter((item) => item.getId() !== "mediaTag")
    );
