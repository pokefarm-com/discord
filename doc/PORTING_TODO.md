## PFQ-Bot Node.js Porting Checklist (ordered)

Use this end-to-end checklist to port the C# PFQ-Bot to Node.js while preserving behavior. Complete items in order.

1. Project setup and tooling

- [ ] Choose stack (recommended: `discord.js@14`, Node 18+, TypeScript, `ts-node` or build with `tsc`)
- [ ] Repo scaffold, linting/formatting (`eslint`, `prettier`), commit hooks (optional)
- [ ] Environment/config loader (`dotenv`, config module)
- [ ] Map `Options/Keys.cs` into a Node config (dev vs prod IDs)

2. Discord client bootstrap

- [ ] Instantiate client with intents: AllUnprivileged minus Invites/ScheduledEvents, plus `GuildMembers`, `MessageContent`
- [ ] Partials if needed (messages, channels, reactions)
- [ ] Login, ready lifecycle, shard-ready equivalent logs
- [ ] Presence: Online, Playing “PokéFarm Q”

3. Command registration framework

- [ ] Slash and context menu builders (`@discordjs/builders`)
- [ ] Register per-guild to `Keys.Guilds.Current`; delete global commands on startup
- [ ] Error handling pipeline: log embeds to `SystemLog` on failures

4. HTTP server and static files

- [ ] Add `express`/`fastify` app with `/health`, `/localization`, `/reports`, `/reportstats`
- [ ] Serve `wwwroot/logs` at `/logs` and static files in `wwwroot/discord`

5. Core helpers and utilities

- [ ] URL/allowed-domain checks and message parsing (port `Extensions/StringExtensions.cs`)
- [ ] User role helpers (port `Extensions/UserExtensions.cs` → `canPostLinks`, `sanitize`)
- [ ] PFQ HTTP wrappers (replace `HttpClient` with `undici`/`node-fetch`)
- [ ] HTML parsing (`cheerio`) to replace `HtmlAgilityPack`
- [ ] Localization data loader parity

6. Help & links commands

- [ ] `/useful-links` with autocomplete from in-memory/link store
- [ ] `/add-link` and `/del-link` (staff only)

7. Fun & utility commands

- [ ] `/coin-flip`, `/dice-roll [1-10]`
- [ ] `/currency amount from to` (dual-rate logic for ZC↔GP, Credits rate)

8. Time & events

- [ ] `/server-time [ephemeral]` consuming PFQ `index/getdayinfo` and formatting Discord timestamps

9. Roles & notifications

- [ ] `/role` to toggle ping-preference roles (mutually exclusive)
- [ ] `/stream-notification` to toggle Dev/Game stream roles

10. User & wiki utilities

- [ ] User command: View on PFQ (party embed + staff links)
- [ ] Message commands: `[WIKI-ONLY] Pin` / `[WIKI-ONLY] Unpin` with category and role gating

11. Link/file requests (workflow core)

- [ ] `/link-request` (url validation, description mention block, spoiler/mod-check flags)
- [ ] `/file-request` (attachment URL path)
- [ ] Store pending requests under `Data/request-<messageId>.json`
- [ ] Post request embed to `#chat-requests` with Approve/Deny/Visit URL buttons
- [ ] Auto-approval path (allowed URL or canPostLinks AND mod-check=false) with immediate post
- [ ] Image/video preview post in `#chat-requests` and record preview message ID
- [ ] Approve button: turn green, post in origin channel (respect spoiler, PingDisabled), cleanup files/previews
- [ ] Deny button: turn red, open modal for reason, DM user with reason

12. Reports and ticketing

- [ ] Message/User context menu: open modal for reason; post report embed to `#chat-reports`
- [ ] Buttons: Create Ticket → create `ticket-<username>` in ChatOt category with proper permissions
- [ ] Buttons: Mark as Done → green state, modal optional note, DM reporter if possible
- [ ] Close Ticket button in ticket channel: export last 500 msgs to file, post back to `#chat-reports`, add View Logs button, delete channel
- [ ] Persist `Config/reports.json` and `Config/reports.txt`; compute stats

13. Staff commands

- [ ] `/type channel` (fake typing ~10s)
- [ ] `/say channel message` (delay typing, send, log embed)
- [ ] `/reply channel message-id message` (reply, log embed)
- [ ] `/react channel message-id reaction` (emoji or custom emote)
- [ ] `/timeout [int]` (read/write `Config/timeout.txt`, caps and messages)

14. Text commands (prefix)

- [ ] `bonus` (Bonus Counters fetch + embed)
- [ ] `send <channelId>` (send all `Config/msg/*.txt` in numeric order)
- [ ] `party` (self party view with staff links)

15. Global event handlers

- [ ] Message Create: short-message rate limit in `Official` and `QnA` (>=5 msgs, <12 chars, 30s window) + warnings/DM
- [ ] Message Create: link moderation for non-allowed users; reply instructions and delete message; log to `SystemLog`
- [ ] Message Update/Delete: log diffs and deletions in public categories (use `diff` lib for unified output)
- [ ] Reaction Add/Remove/Clear: log lines to `wwwroot/logs/YYYY-MM-DD-reactions.log`
- [ ] Reaction special cases: remove super-react bursts; user self-delete reactions (❌/🗑️) on their requests
- [ ] Guild Member Update: Nitro Booster role change → call PFQ promote API, log embed
- [ ] User Joined: post templated welcome message from `Config/discord-welcome-messages.json`
- [ ] Webhook IP Ban monitor: detect `banned IP: <ip>` and query PFQ API; post follow-up mention
- [ ] Hypermode sync on message in `Official`: 24h cache per user; add/remove Hypermode role

16. Background schedulers

- [ ] Link timeout sweep every minute (expire pending requests, mark red, cleanup preview, delete file)
- [ ] Egg monitor service: every ~5 minutes check parties, detect hatch-ready eggs, DM user; de-dupe per-process; auto-remove users on DM failure

17. Data files and directories

- [ ] Ensure existence of `Config`, `Data`, `Logs`, `wwwroot/logs`, `wwwroot/discord`
- [ ] Read/write parity for:
  - [ ] `Config/timeout.txt`
  - [ ] `Config/reports.txt`
  - [ ] `Config/reports.json`
  - [ ] `Config/monitor.txt`
  - [ ] `Config/discord-welcome-messages.json`
  - [ ] `Config/msg/*.txt`
  - [ ] `Data/request-*.json`
  - [ ] `Logs/latest-*.log` (app logs)
  - [ ] `wwwroot/logs/*.log` (reactions)

18. Observability and logging

- [ ] Structured logger (`pino`/`winston`) with file rotation similar to `Logs/latest-*.log`
- [ ] Reaction logs: append-only daily files
- [ ] Error reporting embeds to `SystemLog` (command failures, DM failures)

19. Security and resilience

- [ ] Securely load Discord token and PFQ API key
- [ ] Sanitize inputs (URLs, mentions), handle rate limits and HTTP retries
- [ ] Atomic file writes (tmp+rename) to avoid corruption

20. Dev/Prod parity and rollout

- [ ] Honor dev vs prod IDs from config (like `Keys.Guilds.Current`)
- [ ] Dry-run in development guild; verify each feature group
- [ ] Prepare migration notes for any behavior changes

21. Final verification

- [ ] Cross-check against `FEATURES.md` for parity
- [ ] Smoke test all commands, buttons, modals, and event flows
- [ ] Archive C# references and ship Node.js version
