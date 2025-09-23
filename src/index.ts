import { Client, GatewayIntentBits, Collection, ActivityType } from "discord.js"
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

  presence: {
    status: "online",
    activities: [
      {
        name: "PokéFarm Q",
        type: ActivityType.Playing,
      },
    ],
  },
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

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error)
  process.exit(1)
})

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down gracefully...")
  client.destroy()
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully...")
  client.destroy()
  process.exit(0)
})
