import { config as dotenvConfig } from "dotenv"

dotenvConfig()

/**
 * Get a Discord category ID from environment variables
 * @param categoryName - The environment variable name (e.g., 'PUBLIC')
 * @returns The category ID as a string
 * @throws Error if the environment variable is not found
 */
export function getCategoryId(categoryName: string): string {
  const categoryId = process.env["CATEGORIES_" + categoryName.toUpperCase()]
  if (!categoryId) {
    throw new Error(`Category ID not found for: ${categoryName}`)
  }
  return categoryId
}

/**
 * Get a Discord channel ID from environment variables
 * @param channelName - The environment variable name (e.g., 'WELCOME')
 * @returns The channel ID as a string
 * @throws Error if the environment variable is not found
 */
export function getChannelId(channelName: string): string {
  const channelId = process.env["CHANNELS_" + channelName.toUpperCase()]
  if (!channelId) {
    throw new Error(`Channel ID not found for: ${channelName}`)
  }
  return channelId
}

/**
 * Get a Discord role ID from environment variables
 * @param roleName - The environment variable name (e.g., 'EMBARGO')
 * @returns The role ID as a string
 * @throws Error if the environment variable is not found
 */
export function getRoleId(roleName: string): string {
  const roleId = process.env["ROLES_" + roleName.toUpperCase()]
  if (!roleId) {
    throw new Error(`Role ID not found for: ${roleName}`)
  }
  return roleId
}

/**
 * Get a Discord user ID from environment variables
 * @param userName - The environment variable name for the user ID
 * @returns The user ID as a string
 * @throws Error if the environment variable is not found
 */
export function getUserId(userName: string): string {
  const userId = process.env["USERS_" + userName.toUpperCase()]
  if (!userId) {
    throw new Error(`User ID not found for: ${userName}`)
  }
  return userId
}

export const CATEGORIES = {
  CHATOT: getCategoryId("CHATOT"),
  PUBLIC: getCategoryId("PUBLIC"),
  WIKI: getCategoryId("WIKI"),
} as const

export const CHANNELS = {
  AUTOMOD: getChannelId("AUTOMOD"),
  CHATOTCHATTER: getChannelId("CHATOTCHATTER"),
  CHATREPORTS: getChannelId("CHATREPORTS"),
  CHATREQUESTS: getChannelId("CHATREQUESTS"),
  CHATWARNINGS: getChannelId("CHATWARNINGS"),
  OFFICIAL: getChannelId("OFFICIAL"),
  PKRSNOTIFICATIONS: getChannelId("PKRSNOTIFICATIONS"),
  RULES: getChannelId("RULES"),
  STAFFNOTICEBOARD: getChannelId("STAFFNOTICEBOARD"),
  SYSTEMLOG: getChannelId("SYSTEMLOG"),
  WELCOME: getChannelId("WELCOME"),
} as const

export const ROLES = {
  ADMIN: getRoleId("ADMIN"),
  DEVSTREAMPING: getRoleId("DEVSTREAMPING"),
  EMBARGO: getRoleId("EMBARGO"),
  GAMESTREAMPING: getRoleId("GAMESTREAMPING"),
  GUEST: getRoleId("GUEST"),
  HYPERMODE: getRoleId("HYPERMODE"),
  MANAGER: getRoleId("MANAGER"),
  NITROBOOSTER: getRoleId("NITROBOOSTER"),
  PINGDISABLED: getRoleId("PINGDISABLED"),
  PINGENABLED: getRoleId("PINGENABLED"),
  PINGINACTIVE: getRoleId("PINGINACTIVE"),
  PINGPLEASE: getRoleId("PINGPLEASE"),
  REPORTS: getRoleId("REPORTS"),
  STAFF: getRoleId("STAFF"),
  WIKIEDITORS: getRoleId("WIKIEDITORS"),
} as const

export const USERS = {
  HADES: getUserId("HADES"),
  MOONS: getUserId("MOONS"),
  NIET: getUserId("NIET"),
} as const
