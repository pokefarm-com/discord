import { config as dotenvConfig } from "dotenv"
import { getChannelId } from "./constants"

dotenvConfig()

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

const SYSTEMLOG = getChannelId("SYSTEMLOG")

if (!TOKEN || !CLIENT_ID || !GUILD_ID || !SYSTEMLOG) {
  throw new Error("Missing environment variables")
}

export const config = {
  TOKEN,
  CLIENT_ID,
  GUILD_ID,
  SYSTEMLOG,
}
