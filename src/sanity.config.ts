import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

const config = defineConfig({
  projectId: "qyrn8cjm",
  dataset: "development",
  title: "Parkbad-GT new",
  apiVersion: "2023-15-10",
  basePath: "/admin",
  plugins: [deskTool()],
});

export default config;
