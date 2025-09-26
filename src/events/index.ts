import clientReady from "./clientReady"
import interactionCreate from "./interactionCreate"
import error from "./error"
import type { EventHandler } from "./types"

const events = [clientReady, interactionCreate, error] as EventHandler[]

export default events
