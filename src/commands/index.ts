import ping from "./ping"
import type { CommandModule } from "./types"

export const commands: Record<string, CommandModule> = {
  [ping.data.name]: ping,
}
