import { Events, Interaction } from "discord.js"
import type { EventContext, EventHandler } from "./types"
import { logger } from "../util/logger"

const handler: EventHandler<"interactionCreate"> = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction, { commands }: EventContext) {
    if (!commands) return

    if (interaction.isChatInputCommand()) {
      const { commandName } = interaction
      const command = commands.get(commandName)
      if (command) {
        try {
          await command.execute(interaction)
        } catch (error) {
          logger.error(`Error executing command ${commandName}`, error)
        }
      }
    }
    if (interaction.isAutocomplete()) {
      const { commandName } = interaction
      const command = commands.get(commandName)
      if (command?.autocomplete) {
        try {
          await command.autocomplete(interaction)
        } catch (error) {
          logger.error(`Error executing autocomplete ${commandName}`, error)
        }
      } else {
        logger.warn(`Received autocomplete for ${commandName} but handler missing`)
      }
    }
  },
}

export default handler
