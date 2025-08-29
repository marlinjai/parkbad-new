export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-07-03";

// Environment-based dataset selection
export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);

// CDN usage based on environment
// Use CDN for production, disable for development and staging for real-time updates
export const useCdn = process.env.NODE_ENV === 'production' && 
  process.env.VERCEL_ENV === 'production';

export const perspective = "published";

export const title = "Parkbad-GT";

export const previewSecretId: `${string}.${string}` = "preview.secret";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
