## PFQ-Bot Feature Specification (for Node.js port)

This document describes the existing features, commands, events, background services, configuration, and data flows of the C# PFQ-Bot so they can be replicated in a future Node.js implementation.

### Contents

- General overview and architecture
- Slash commands (with options and permissions)
- Context menu and text commands
- Moderation and automations
- Link/file request workflow
- Reports and ticketing workflow
- Roles and notifications
- User and site utilities
- Time and event tools
- Egg monitor (DM notifications)
- Reactions logging
- Welcome messages
- HTTP endpoints exposed by the bot
- Configuration, storage and files
- Porting notes for Node.js

---

## General overview and architecture

- **Platform**: Discord bot using Discord.Net (C#) with hosted services.
- **Audience**: PokéFarm Q community (server-specific IDs defined in `Options/Keys.cs`).
- **Purpose**: Moderation, utility, and community tools.
- **Key components**:
  - `Services/DiscordService.cs`: Main gateway/event handler. Registers slash and context commands, wires interaction handlers, and global moderation behaviors.
  - `Modules/*.cs`: Command modules (slash, user, message, text commands).
  - `Services/InteractionResponses/{Buttons,Modals}.cs`: Button and modal handlers.
  - `Services/MonitorService.cs`: Background egg monitor (scrapes PFQ site, DMs users).
  - `Services/LinkTimeoutService.cs`: Expires pending link/file requests and cleans previews.
  - `Services/ReactionService.cs`: Logs reactions and related moderation behavior.
  - `Services/WelcomeService.cs`: Generates welcome messages from local JSON with templating.
  - `Program.cs`: Host bootstrap and minimal HTTP endpoints (`/health`, `/localization`, `/reports`, `/reportstats`) and static file serving for logs.

---

## Slash commands

### Fun & utility

- `/coin-flip`
  - Returns Heads/Tails with emojis.
- `/dice-roll rolls: int (1–10)`
  - Returns `rolls` emoji dice faces; validates range.
- `/currency amount: number, from: Credits|GP|ZC, to: Credits|GP|ZC`
  - Converts between currencies. For ZC↔GP, shows dual-rate results (1:5 and 1:6). Shows derived conversions to Credits at 1 ZC = 5000 Credits.
- `/monitor`
  - Toggles egg monitor DMs for the caller. Requires that the bot can DM the user.
  - Limit of ~30 users, with staff bypass. State stored in `Config/monitor.txt`.

### Help & links

- `/useful-links topic: autocomplete`
  - Returns a curated link from `Options/UsefulLinks.cs` with title/description/URL.
- `/add-link slug, title, description, url` (staff only)
  - Adds a link to the curated list.
- `/del-link topic: autocomplete` (staff only)
  - Removes a link.

### Link/file requests (moderated posting)

- `/link-request url, description, mark-spoiler: boolChoice, mod-check: boolChoice`
  - Validates URL, blocks user mentions in description, and opens a request in `#chat-requests` with Approve/Deny buttons.
  - Auto-approval if the user can post links or URL is allowed AND `mod-check` is false.
  - Spoiler option wraps URL in `||` when posted.
- `/file-request file: attachment, description, mark-spoiler: boolChoice, mod-check: boolChoice`
  - Same workflow as link-request, using attachment URL.

### Roles & notifications

- `/role role: No Pings | Ping if Inactive | Pings Okay | Please Ping`
  - Assigns the chosen ping-preference role; ensures only one of these roles is active at a time. Ephemeral embed response.
- `/stream-notification type: Dev Streams | Game Streams`
  - Toggles the selected stream notification role.

### User & wiki utilities

- `User Command: View on PFQ`
  - Builds a party embed using PFQ site scrape, with staff-only quick links (Notes/Locks, Interactions, User Editor).
- `Message Command: [WIKI-ONLY] Pin` and `Message Command: [WIKI-ONLY] Unpin` (Wiki Editors only, wiki channels)
  - Pin/unpin messages inside wiki category channels.

### Time & events

- `/server-time ephemeral: bool` (defaults true)
  - Shows server dawn/dusk times and tomorrow sunrise as local-time Discord timestamps. Uses PFQ API `index/getdayinfo`.

### Staff tools (Manage Messages or higher)

- `/type channel`
  - Fakes typing in target channel for ~10 seconds.
- `/say channel, message`
  - Sends a message as the bot and logs an action embed to `SystemLog`.
- `/reply channel, message-id, message`
  - Replies to an existing message and logs to `SystemLog`.
- `/react channel, message-id, reaction`
  - Adds a reaction (custom `:<name>:<id>` or standard emoji) and logs to `SystemLog`.
- `/timeout timeout: int`
  - Gets/sets the pending link request timeout window (0 returns current; caps at 60). Stored in `Config/timeout.txt`.

---

## Context menu and text commands

- `Message Command: Report this Message`
  - Opens a modal for report reason; creates a report embed in `#chat-reports` with buttons to Create Ticket / Mark as Done.
- `User Command: Report this User`
  - Same as above but targets a user.
- Text commands (prefix in `DiscordOptions.Prefix`):
  - `bonus`: Fetches and displays Bonus Counters from PFQ.
  - `send <channelId>`: Bulk-sends pre-staged messages from `Config/msg/*` (ordered numerically by filename).
  - `party`: Shows the caller’s own PFQ party embed; staff get extra quick links.
- Fun trigger: addressing “sally” or mentioning the bot with natural-language phrases triggers an 8-ball style response (rate-limited to avoid spam, special long “berries” message daily once).

---

## Moderation and automations

- Message link filtering (public/thread channels):
  - Users without link privileges (not Staff, not NitroBooster without Embargo) are checked for URLs.
  - Allowed domains and special cases defined in `Extensions/StringExtensions.cs` (`AllowedDomains`, `BlockedPaths`).
  - On disallowed URLs: the bot replies with instructions to use `</file-request:...>` or `</link-request:...>` and deletes the message; logs an embed to `SystemLog`.
- Rate limiting short messages in `Official` and `QnA` channels:
  - If a user sends ≥5 messages under 12 chars within 30 seconds, they receive a DM warning or channel warning; event logged to `ChatWarnings`.
- Edited/deleted message logging (public categories):
  - Edits: Diff of old/new content posted to `SystemLog`.
  - Deletes: Original content (if cached) posted to `SystemLog`.
- Hypermode role sync:
  - In `Official`, on message receive the bot queries PFQ API (24h cache per user) and adds/removes the Hypermode role accordingly; errors logged.
- Nitro Booster status change:
  - On guild member role update, posts status change to `SystemLog` and calls `PostBoost` to PFQ admin endpoint.
- Formatting misuse notice:
  - Non-staff using header-like formatting (`#`, `-#`) in public channels triggers a heads-up embed into `ChatReports`.
- IP ban webhook watch:
  - If a webhook posts “banned IP: `<ip>`” in a specific channel, the bot calls PFQ API to check and posts a follow-up mention if an account is found.

---

## Link/file request workflow

- User runs `/link-request` or `/file-request`.
- Validation:
  - Block user mentions in description.
  - For URLs: must parse as HTTP/HTTPS; optional spoiler and mod-check flags.
- Auto-approval path:
  - If requester can post links OR URL is allowed AND `mod-check` is false, the bot posts the URL immediately in the origin channel (respects PingDisabled role to avoid mentions) and logs green embed in `#chat-requests`.
- Manual approval path:
  - Posts an orange embed in `#chat-requests` pinging Reports role, with Approve/Deny buttons and a “Visit URL” button.
  - Stores the request to `Data/request-<messageId>.json` with expiry set to `Timeout` minutes rounded to the next minute.
  - For images/videos on auto-expanding, attempts to post a preview message in `#chat-requests` and records its message ID for cleanup.
- Approval:
  - Button turns request green, clears components, posts the link (spoiler-respected) to the origin channel addressing the requester, deletes preview, removes request file.
- Denial:
  - Button turns request red, clears components, deletes preview, opens a modal to capture denial reason, DMs the requester with the reason.
- Timeout:
  - `LinkTimeoutService` runs each minute, scans `Data/request-*.json` and when `ExpiresAt < now`, marks the original embed red, writes a timeout message, clears buttons, deletes preview message, removes the request file.

---

## Reports and ticketing workflow

- From `Report this Message/User`, a modal captures a reason; the bot posts an embed to `#chat-reports` with two buttons:
  - Create Ticket: creates `#ticket-<username>` in `Categories.ChatOt`, grants view/send to reporter, Reports role, and the bot; stores origin message ID in channel topic for traceability; posts the original embed plus a Close Ticket button inside the ticket.
  - Mark as Done: marks the report green, records closer info, prompts a modal to optionally add a note, and attempts to DM the reporter that the report was resolved.
- Close Ticket:
  - Exports last 500 messages (excluding bot) to `Logs/<timestamp>-<ticket>.log`, posts the file back to `#chat-reports` as a reply to the original report, adds a “View Logs” button on the original report, then deletes the ticket channel. If no open reports remain, posts a completion checkmark.
- Storage:
  - `Config/reports.json` stores full report objects and state (Open/Closed, timestamps, closer info).
  - `Config/reports.txt` holds message IDs already reported to prevent duplicates.
- Stats:
  - `/reportstats` HTTP endpoint returns aggregated metrics (open/closed counts, closed-by user histogram, average close time in seconds).

---

## Roles and notifications

- Ping preference roles: `No Pings`, `Ping if Inactive`, `Pings Okay`, `Please Ping` — only one can be active at a time.
- Stream roles: `Dev Streams`, `Game Streams`.
- Other notable roles: `Staff`, `Reports`, `Admins`, `NitroBooster`, `Embargo`, `WikiEditors`, `Hypermode`.
  - Link-posting permission: `Staff` or `NitroBooster` without `Embargo`.

---

## User and site utilities

- Party views (User command and text `party`): scrap PFQ user pages for party slots, egg progress, and Pokemon details; include DM/trade links; staff see extra admin links.
- Bonus Counters (`bonus`): fetch counters from PFQ and display summarised perks for each counter owner.
- Bulk messaging (`send <channelId>`): sends contents of `Config/msg/*.txt` files to the target channel in numeric order.
- Special Nextcloud upload helper (specific thread): URLs posted in a designated thread are fetched and uploaded to Nextcloud with a response containing URL and preview (server-specific convenience tool).

---

## Time and event tools

- `/server-time` uses PFQ API for daily times and formats results as Discord timestamps showing local times for the requester.

---

## Egg monitor (DM notifications)

- Opt-in via `/monitor`; the background service checks parties on a cadence (30s under debugger, ~5m in production) and DMs users when eggs reach hatch-ready EXP.
- De-duplicates notifications by tracking posted egg IDs within process lifetime; removes users who cannot be DMed.

---

## Reactions logging

- Logs all reaction add/remove/clear events to per-day files under `wwwroot/logs/YYYY-MM-DD-reactions.log`.
- Special cases:
  - Removes “super react” bursts automatically and logs the removal.
  - If a bot-authored request message begins with the user mention and the user reacts with ❌ or 🗑️, the original request message is deleted and a staff log entry is made.

---

## Welcome messages

- On `UserJoined`, posts a randomised welcome message to the `Welcome` channel.
- Messages are loaded from `Config/discord-welcome-messages.json` and support variables with `%var:<name>%` syntax, substituted from the same JSON file.

---

## HTTP endpoints exposed by the bot

- `GET /health` → 200 OK (liveness probe).
- `GET /localization` → returns `Options/Localization.LocalizationData`.
- `GET /reports` → returns the JSON content of `Config/reports.json`.
- `GET /reportstats` → returns aggregated report stats.
- Static files: exposes `wwwroot/logs` via `/logs` with directory listing; also serves files under `wwwroot/discord` produced by helper tasks.

---

## Configuration, storage and files

- `appsettings.json` / environment: Discord token, API key, prefix, and logging settings. Options bound into `Options/DiscordOptions.cs`.
- `Options/Keys.cs`: All server-specific IDs for roles, channels, categories, users, guilds, and feature colors. Contains computed `Current` guild based on debug/production.
- Persistent files used by features:
  - `Config/timeout.txt`: minutes for link request expiry.
  - `Config/reports.txt`: message IDs already reported.
  - `Config/reports.json`: array of `ReportObject` items tracking reports and state.
  - `Config/monitor.txt`: user IDs opted-in for egg monitor DMs.
  - `Config/discord-welcome-messages.json`: welcome phrases and variable sets.
  - `Config/msg/*.txt`: bulk message templates for staff `send`.
  - `Data/request-<messageId>.json`: pending link/file requests (ephemeral; cleaned by timeout or decision).
  - `Logs/latest-*.log`: rolling application logs.
  - `wwwroot/logs/*.log`: daily reactions logs.
  - `wwwroot/discord/*`: downloaded/processed files for helper workflows.

---

## Porting notes for Node.js

### Libraries and equivalents

- **Discord gateway**: Use `discord.js` v14+ with intents: AllUnprivileged minus Invites/ScheduledEvents, plus `GuildMembers` and `MessageContent`. Enable partials if needed.
- **Slash/Context commands**: Use `@discordjs/builders` and command registration per-guild during startup (delete global, register to `Keys.Guilds.Current`).
- **Buttons/Modals**: Use `discord.js` component collectors and modal submissions; encode custom IDs as `<module>:<action>:<id>`.
- **Background services**: Use a scheduler (e.g., `node-cron` or `setInterval`) for:
  - Link timeout sweep (every minute).
  - Egg monitor checks (every 5 minutes, offset to align on minute boundary).
- **HTTP endpoints**: Use `express` or `fastify` to expose `/health`, `/localization`, `/reports`, `/reportstats`, and static dir under `/logs`.
- **Logging**: Use `pino`/`winston`. Keep daily file rotation for reaction logs and app logs.

### Data and storage

- Preserve the same file layout where possible to keep operational parity, or migrate to a database (SQLite/Postgres) with a light DAO layer for:
  - Reports, report stats.
  - Pending requests.
  - Monitor opt-ins.
- If using files, ensure atomic writes and concurrency safety; for Node.js use `fs.promises` and write temp + rename for robustness.

### Permissions and guards

- Mirror checks for:
  - Link posting capability (`NitroBooster` without `Embargo`, or `Staff`).
  - Wiki Editors for message pin/unpin within wiki category.
  - Staff-only commands gated by `ManageMessages`.
  - Rate limit thresholds and short-message filter in `Official` and `QnA`.

### HTTP calls and scraping

- Replace `HttpClient` with `node-fetch`/`undici`.
- Use `cheerio` to replace `HtmlAgilityPack` for PFQ page parsing.

### Identifiers and configuration

- Port `Options/Keys.cs` values into a Node config module. Keep separate IDs for development vs production.
- Port localization payload loader if needed.

### Edge cases to replicate

- Clean URL previews in `#chat-requests` for image/video types.
- Spoiler wrapping for approved links.
- DM failures leading to monitor opt-out.
- Super-react removal and log messages.
- Edit diff in public channels (use a diff library like `diff` to produce unified-style output).

---

## Glossary of key files/classes

- `Services/DiscordService.cs`: gateway handlers (messages, interactions, reactions, member updates), command registration, error reporting to `SystemLog`.
- `Services/InteractionResponses/Buttons.cs`: handlers for Ticket (create/close/done), Link (approve/deny).
- `Services/InteractionResponses/Modals.cs`: handlers for Report submission, Report done notification, Link deny reason.
- `Services/MonitorService.cs`: egg monitor scraping, DM notifications, opt-in storage.
- `Services/LinkTimeoutService.cs`: pending request expiry and cleanup.
- `Services/ReactionService.cs`: reaction add/remove/clear logging and special behaviors.
- `Services/WelcomeService.cs`: templated welcome message builder from JSON.
- `Modules/*.cs`: command surfaces (Fun, Help, Link, Report, Role, Staff, StaffText, Time, User, Wiki).
- `Extensions/*.cs`: helper methods (embeds, logging adapter, DI, string/url checks, user role checks).
- `Options/Keys.cs`: constants and IDs for roles/channels/categories/users/guilds.

---

This specification is intended to be the authoritative reference when building a Node.js version that matches behavior and user experience of the current C# bot.
