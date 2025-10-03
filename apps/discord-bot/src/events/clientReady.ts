import { Events } from "discord.js"
import type { EventContext, EventHandler } from "./types"
import { logger } from "../util/logger"

const handler: EventHandler<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  async execute(_client, { client }: EventContext) {
    logger.info(`Bot is connected as ${client.user!.tag}`)
  },
}

export default handler
