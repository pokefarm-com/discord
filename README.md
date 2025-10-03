# PFQ Monorepo

A monorepo containing the PokéFarm Q Discord bot, API, and dashboard applications.

## 🏗️ Project Structure

```
pfq-monorepo/
├── apps/
│   ├── discord-bot/     # Discord bot application
│   ├── api/             # Express.js API server
│   └── dashboard/       # Next.js dashboard with shadcn/ui
├── packages/
│   ├── shared/          # Shared utilities and helpers
│   └── types/           # Shared TypeScript types
├── package.json         # Root package.json with workspaces
├── turbo.json          # Turbo build configuration
└── tsconfig.json       # Root TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 10+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pfq-monorepo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy example environment files
cp apps/discord-bot/.env.example apps/discord-bot/.env
cp apps/api/.env.example apps/api/.env
cp apps/dashboard/.env.example apps/dashboard/.env
```

4. Build all packages:
```bash
npm run build
```

## 🛠️ Development

### Running All Applications

Start all applications in development mode:
```bash
npm run dev
```

This will start:
- Discord bot on the configured token
- API server on http://localhost:3001
- Dashboard on http://localhost:3000

### Running Individual Applications

#### Discord Bot
```bash
cd apps/discord-bot
npm run dev
```

#### API Server
```bash
cd apps/api
npm run dev
```

#### Dashboard
```bash
cd apps/dashboard
npm run dev
```

## 📦 Applications

### Discord Bot (`apps/discord-bot`)
- Built with Discord.js v14
- TypeScript support
- Command and event system
- Database integration

### API Server (`apps/api`)
- Express.js REST API
- CORS enabled
- Health check endpoints
- Database integration
- Error handling middleware

### Dashboard (`apps/dashboard`)
- Next.js 14 with App Router
- shadcn/ui components
- Tailwind CSS styling
- TypeScript support
- Responsive design

## 📚 Shared Packages

### Types (`packages/types`)
- Shared TypeScript interfaces
- API response types
- Database models
- Configuration types

### Shared (`packages/shared`)
- Common utilities
- Logger class
- Database connection helpers
- Validation functions

## 🔧 Scripts

### Root Level Scripts
- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all applications
- `npm run lint` - Lint all packages
- `npm run clean` - Clean all build artifacts
- `npm run format` - Format code with Prettier
- `npm run type-check` - Type check all packages

### Application Scripts
Each application has its own set of scripts:
- `dev` - Development mode with hot reload
- `build` - Production build
- `start` - Start production server
- `clean` - Clean build artifacts
- `type-check` - TypeScript type checking

## 🏗️ Build System

This monorepo uses:
- **Turbo** for build orchestration and caching
- **npm workspaces** for dependency management
- **TypeScript** for type safety across all packages
- **ESLint** for code linting
- **Prettier** for code formatting

## 🌍 Environment Variables

### Discord Bot
```env
TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id
GUILD_ID=your_discord_guild_id
```

### API Server
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Dashboard
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

This project is licensed under the GPL-3.0-or-later License.