import { createClient } from "next-sanity";

import { apiVersion, dataset, perspective, projectId, useCdn } from "../env";

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  perspective,
});
