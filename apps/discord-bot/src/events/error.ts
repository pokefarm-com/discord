import { Events } from "discord.js"
import type { EventContext, EventHandler } from "./types"
import { logger } from "../util/logger"

const handler: EventHandler<Events.Error> = {
  name: Events.Error,
  once: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(error: Error, _context: EventContext) {
    logger.error(undefined, "Discord client error", error)
  },
}

export default handler
