import { config as dotenvConfig } from "dotenv"

dotenvConfig()

const { TOKEN, CLIENT_ID, GUILD_ID, SYSLOG_ID } = process.env

if (!TOKEN || !CLIENT_ID || !GUILD_ID || !SYSLOG_ID) {
  throw new Error("Missing environment variables")
}

export const config = {
  TOKEN,
  CLIENT_ID,
  GUILD_ID,
  SYSLOG_ID,
}
