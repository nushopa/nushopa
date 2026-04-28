import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: import.meta.env.VITE_PROJECT_ID,
  dataset: 'production',
  useCdn: true, 
  apiVersion: '2023-05-03',
})