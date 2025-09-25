## PFQ-Bot Node.js Porting Checklist (ordered)

Use this end-to-end checklist to port the C# PFQ-Bot to Node.js while preserving behavior. Complete items in order.

1. Project setup and tooling

- [x] Choose stack (recommended: `discord.js@14`, Node 18+, TypeScript, `ts-node` or build with `tsc`)
- [x] Repo scaffold, linting/formatting (`eslint`, `prettier`), commit hooks (optional)
- [x] Environment/config loader (`dotenv`, config module)
- [x] Map `Options/Keys.cs` into a Node config (dev vs prod IDs)

2. Discord client bootstrap

- [x] Instantiate client with intents: AllUnprivileged minus Invites/ScheduledEvents, plus `GuildMembers`, `MessageContent`
- [ ] Partials if needed (messages, channels, reactions)
- [x] Login, ready lifecycle, equivalent logs
- [x] Presence: Online, Playing “PokéFarm Q”

3. Command registration framework

- [ ] Slash and context menu builders (`@discordjs/builders`)
- [x] Register per-guild to `Keys.Guilds.Current`; delete global commands on startup
- [ ] Error handling pipeline: log embeds to `SystemLog` on failures

4. HTTP server and static files

- [ ] Add `express` app with `/health`, `/reports`, `/reportstats`

5. Core helpers and utilities

- [ ] URL/allowed-domain checks and message parsing (port `Extensions/StringExtensions.cs`)
- [ ] User role helpers (port `Extensions/UserExtensions.cs` → `canPostLinks`, `sanitize`)
- [ ] PFQ HTTP wrappers (replace `HttpClient` with `undici`/`node-fetch`)
- [ ] HTML parsing (`cheerio`) to replace `HtmlAgilityPack`

6. Help & links commands

- [ ] `/useful-links` with autocomplete from link store
- [ ] `/add-link` and `/del-link` (staff only)

7. Fun & utility commands

- [ ] `/coin-flip`, `/dice-roll [1-10]`

8. Time & events

- [ ] `/server-time [ephemeral]` consuming PFQ `index/getdayinfo` and formatting Discord timestamps

9. Roles & notifications

- [ ] `/role` to toggle ping-preference roles (mutually exclusive)
- [ ] `/stream-notification` to toggle Dev/Game stream roles

10. User utilities

- [ ] User command: View on PFQ (party embed + staff links)

11. Link/file requests (workflow core)

- [ ] `/link-request` (url validation, description mention block, spoiler/mod-check flags)
- [ ] `/file-request` (attachment URL path)
- [ ] DM compatibility, link/file in DM => "which channel" => send request
- [ ] Store pending requests in database
- [ ] Post request embed to `#chat-requests` with Approve/Deny/Visit URL buttons
- [ ] Auto-approval path (allowed URL or canPostLinks AND mod-check=false) with immediate post
- [ ] Image/video preview post in `#chat-requests`
- [ ] Approve button: turn green, post in origin channel (respect spoiler, PingDisabled), cleanup files/previews
- [ ] Deny button: turn red, open modal for reason, DM user with reason / fall back to PM on-site?

12. Reports and ticketing

- [ ] Message/User context menu: open modal for reason; post report embed to `#chat-reports` and database
- [ ] Buttons: Create Ticket → create `ticket-<username>` in ChatOt category with proper permissions
- [ ] Buttons: Close as not actionable → grey state, modal optional note, DM reporter if possible
- [ ] Buttons: Mark as Done → green state, modal optional note, DM reporter if possible
- [ ] Close Ticket button in ticket channel: export last 500 msgs to file, post back to `#chat-reports`, add View Logs button, delete channel, close database entry
- [ ] Persist database, add endpoints to compute stats

13. Staff commands

- [ ] `/say channel message` (delay typing, send, log embed)
- [ ] `/reply channel message-id message` (reply, log embed)
- [ ] `/react channel message-id reaction` (emoji or custom emote)

14. Global event handlers

- [ ] Message Create: short-message rate limit in `Official` and `QnA` (>=5 msgs, <12 chars, 30s window) + warnings/DM
- [ ] Message Create: link moderation for non-allowed users; reply instructions and delete message; log to `SystemLog`
- [ ] Message Update/Delete: log diffs and deletions in public categories (use `diff` lib for unified output)
- [ ] Reaction Add/Remove/Clear: log spammy reactions (quick burst within <5s / add and remove within 5s)
- [ ] Reaction special cases: remove super-react bursts; user self-delete button on their request (staff + author only)
- [ ] Guild Member Update: Nitro Booster role change → call PFQ promote API, log embed
- [ ] User Joined: post templated welcome message from database
- [ ] Webhook IP Ban monitor: detect `banned IP: <ip>` and query PFQ API; post follow-up mention
- [ ] Hypermode sync on message in public categories: 1h cache per user; add/remove Hypermode role

16. Background schedulers

- [ ] Link timeout sweep every minute (expire pending requests, mark red, cleanup preview, delete file)
- [ ] Egg monitor service: every ~5 minutes check parties, detect hatch-ready eggs, DM user; de-dupe per-process; auto-remove users on DM failure

17. Observability and logging

- [x] Structured logger (`pino`/`winston`) with file rotation similar to `Logs/latest-*.log`
- [ ] Reaction logs: append-only daily files
- [ ] Error reporting embeds to `SystemLog` (command failures, DM failures)

18. Security and resilience

- [x] Securely load Discord token and PFQ API key
- [ ] Sanitize inputs (URLs, mentions), handle rate limits and HTTP retries
- [ ] Atomic file writes (tmp+rename) to avoid corruption

19. Dev/Prod parity and rollout

- [x] Honor dev vs prod IDs from config (like `Keys.Guilds.Current`)
- [ ] Dry-run in development guild; verify each feature group
- [ ] Prepare migration notes for any behavior changes

20. Final verification

- [ ] Cross-check against `FEATURES.md` for parity
- [ ] Smoke test all commands, buttons, modals, and event flows
