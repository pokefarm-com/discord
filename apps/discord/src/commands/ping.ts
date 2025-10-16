import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"
import type { CommandModule } from "./types"
import { logger } from "../util/logger"

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Ping the bot.")

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply()
  try {
    await interaction.editReply({
      content: "Pong!",
    })
  } catch (error) {
    logger.error(interaction.client, "Failed to respond to ping command", error)
  }
}

const command: CommandModule = {
  data,
  execute,
}

export default command
