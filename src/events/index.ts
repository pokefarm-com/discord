import clientReady from "./clientReady"
import interactionCreate from "./interactionCreate"
import error from "./error"
import type { EventHandler } from "./types"

const events: EventHandler[] = [clientReady, interactionCreate, error]

export default events
