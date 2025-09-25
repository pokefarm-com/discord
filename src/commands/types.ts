import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js"

export type CommandExecute = (
  interaction: ChatInputCommandInteraction,
) => Promise<unknown>

export type CommandAutocomplete = (
  interaction: AutocompleteInteraction,
) => Promise<unknown>

export interface CommandModule {
  data: SlashCommandBuilder
  execute: CommandExecute
  autocomplete?: CommandAutocomplete
}


