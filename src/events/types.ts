import type { Client, ClientEvents, Collection } from "discord.js"
import type { CommandModule } from "../commands/types"

export interface EventContext {
  client: Client
  commands: Collection<string, CommandModule>
}

export interface EventHandler<
  K extends keyof ClientEvents = keyof ClientEvents,
> {
  name: K
  once?: boolean
  execute: (...args: [...ClientEvents[K], EventContext]) => any
}
