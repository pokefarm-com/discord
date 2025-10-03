import { deployCommands } from "../src/deploy-commands"
import { logger } from "../src/util/logger"
;(async () => {
  try {
    const mode = process.argv[2]
    logger.info("Deploying Discord commands...", mode ? { mode } : undefined)
    await deployCommands(mode)
    logger.info("Commands deployed successfully.")
    process.exit(0)
  } catch (error) {
    logger.error(undefined, "Failed to deploy commands", error)
    process.exit(1)
  }
})()
