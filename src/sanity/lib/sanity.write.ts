import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

if (!process.env.SANITY_API_WRITE_TOKEN) {
  console.warn('SANITY_API_WRITE_TOKEN is not set; write operations will fail.');
}

export const writeClient = createClient({
  apiVersion,
  dataset,
  projectId,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  perspective: 'raw',
});
