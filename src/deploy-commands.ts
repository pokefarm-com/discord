import {
  REST,
  Routes,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js"
import { config } from "./config"
import { commands } from "./commands"
import { logger } from "./util/logger"

const commandsData: RESTPostAPIChatInputApplicationCommandsJSONBody[] =
  Object.values(commands).map((command) => command.data.toJSON())

const rest = new REST().setToken(config.TOKEN)

async function registerCommands(route: string, scope: string) {
  if (commandsData.length === 0) {
    logger.warn(undefined, `No commands to register for ${scope}.`)
    return
  }

  logger.info(
    `Registering ${commandsData.length} ${scope} command${
      commandsData.length === 1 ? "" : "s"
    }.`,
  )

  await rest.put(route as `/{string}`, {
    body: commandsData,
  })

  logger.info(`Registered ${scope} commands.`)
}

export async function deployCommands(mode?: string) {
  const isProduction = mode === "--prod"
  const scope = isProduction ? "global" : `guild ${config.GUILD_ID}`
  const route = isProduction
    ? Routes.applicationCommands(config.CLIENT_ID)
    : Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID)

  if (isProduction) {
    logger.info("--prod flag detected: Registering commands globally.")
  } else {
    logger.info(`Registering commands to guild ${config.GUILD_ID}.`)
  }

  try {
    await registerCommands(route, scope)
  } catch (error) {
    logger.error(undefined, `Failed to register ${scope} commands`, error)
    throw error
  }
}
