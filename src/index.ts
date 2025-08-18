import { Client, GatewayIntentBits, Collection } from "discord.js"
import { config } from "./config"
import { commands as commandModules } from "./commands"
import type {
  AutocompleteInteraction,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js"
import events from "./events"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
})

type CommandModule = {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction) => Promise<any>
  autocomplete: (interaction: AutocompleteInteraction) => Promise<any>
}

const commands = new Collection<string, CommandModule>()
for (const commandName in commandModules) {
  if (Object.prototype.hasOwnProperty.call(commandModules, commandName)) {
    commands.set(commandName, commandModules[commandName])
  }
}

for (const event of events) {
  if (event.once) {
    client.once(event.name, (...args) =>
      event.execute(...args, client, commands),
    )
  } else {
    client.on(event.name, (...args) => event.execute(...args, client, commands))
  }
}

client
  .login(config.TOKEN)
  .then(() => {
    console.log("Logged in successfully!")
  })
  .catch((error) => {
    console.error("Failed to log in:", error)
  })

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error)
})
