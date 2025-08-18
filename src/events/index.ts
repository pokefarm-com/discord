import clientReady from "./clientReady"
import interactionCreate from "./interactionCreate"
import type { EventHandler } from "./types"

const events: EventHandler[] = [
  clientReady,
  interactionCreate,
]

export default events
