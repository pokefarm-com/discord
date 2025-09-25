import { Events } from "discord.js"
import type { EventContext, EventHandler } from "./types"
import { logger } from "../util/logger"

const handler: EventHandler<"error"> = {
  name: Events.Error,
  once: false,
  async execute(error: Error, _context: EventContext) {
    logger.error("Discord client error", error)
  },
}

export default handler
