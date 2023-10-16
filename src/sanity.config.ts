import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import schemas from "./Sanity/schemas";

const config = defineConfig({
  projectId: "qyrn8cjm",
  dataset: "development",
  title: "Parkbad-GT new",
  apiVersion: "2023-15-10",
  basePath: "/admin",
  plugins: [deskTool()],
  schema: { types: schemas },
});

export default config;
