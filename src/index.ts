import { Client, GatewayIntentBits, Collection, ActivityType } from "discord.js"
import { config } from "./config"
import { commands as commandModules } from "./commands"
import events from "./events"
import type { CommandModule } from "./commands/types"
import type { EventContext } from "./events/types"
import { logger } from "./util/logger"

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
        name: "chomping on PokéFarm Q",
        type: ActivityType.Custom,
      },
    ],
  },
})

const commands = new Collection<string, CommandModule>()
for (const commandName in commandModules) {
  if (Object.prototype.hasOwnProperty.call(commandModules, commandName)) {
    commands.set(commandName, commandModules[commandName])
  }
}

const eventContext: EventContext = {
  client,
  commands,
}

for (const event of events) {
  if (event.once) {
    client.once(event.name, (...args) =>
      event.execute(...args, eventContext),
    )
  } else {
    client.on(event.name, (...args) => event.execute(...args, eventContext))
  }
}

client
  .login(config.TOKEN)
  .then(() => {
    logger.info("Logged in successfully!")
  })
  .catch((error) => {
    logger.error("Failed to log in", error)
  })

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled promise rejection", error)
})

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", error)
  process.exit(1)
})

process.on("SIGINT", () => {
  logger.info("Received SIGINT, shutting down gracefully...")
  client.destroy()
  process.exit(0)
})

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM, shutting down gracefully...")
  client.destroy()
  process.exit(0)
})
