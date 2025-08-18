import { SlashCommandBuilder, CommandInteraction } from "discord.js"

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Ping the bot.")

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply()
  try {
    await interaction.editReply({
      content: "Pong!",
    })
  } catch (err) {
    console.error(err)
  }
}
