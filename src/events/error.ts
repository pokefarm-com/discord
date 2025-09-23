import { Events } from "discord.js"
import { EventHandler } from "./types"

const handler: EventHandler<"error"> = {
  name: Events.Error,
  once: false,
  async execute(error: Error) {
    console.error(`[ERROR] Discord client error:`, error)

    console.error(`[ERROR] Error timestamp: ${new Date().toISOString()}`)
    console.error(`[ERROR] Error stack:`, error.stack)
  },
}

export default handler
