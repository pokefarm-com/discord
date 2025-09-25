import fs from "fs"
import path from "path"

type LogLevel = "debug" | "info" | "warn" | "error"

const logsDir = path.resolve(process.cwd(), "logs")

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

function getLogFilePath(date = new Date()) {
  const formattedDate = date.toISOString().split("T")[0]
  return path.join(logsDir, `${formattedDate}.log`)
}

const logFilePath = getLogFilePath()
const logStream = fs.createWriteStream(logFilePath, { flags: "a" })

function serializeMeta(meta: unknown) {
  if (!meta) return ""
  if (meta instanceof Error) {
    return `\n${meta.stack ?? meta.message}`
  }
  if (typeof meta === "object") {
    try {
      return `\n${JSON.stringify(meta, null, 2)}`
    } catch (error) {
      return `\n[unserializable meta: ${(error as Error).message}]`
    }
  }
  return `\n${String(meta)}`
}

function log(level: LogLevel, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString()
  const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`

  logStream.write(`${formattedMessage}${serializeMeta(meta)}\n`)

  const consoleFn =
    level === "debug" ? console.log : (console[level] as typeof console.log)
  consoleFn(formattedMessage, meta instanceof Error ? meta : meta ?? "")
}

export const logger = {
  debug(message: string, meta?: unknown) {
    log("debug", message, meta)
  },
  info(message: string, meta?: unknown) {
    log("info", message, meta)
  },
  warn(message: string, meta?: unknown) {
    log("warn", message, meta)
  },
  error(message: string, meta?: unknown) {
    log("error", message, meta)
  },
}


