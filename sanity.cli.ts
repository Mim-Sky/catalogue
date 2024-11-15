import { defineCliConfig } from 'sanity/cli'
import dotenv from 'dotenv'

// Load environment variables from `.env.local`
dotenv.config()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error('Missing required environment variables for Sanity CLI.')
}

export default defineCliConfig({ api: { projectId, dataset } })
