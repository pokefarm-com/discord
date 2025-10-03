// Logger utility
export class Logger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  info(message: string, ...args: unknown[]): void {
    console.log(`[INFO]${this.context ? ` [${this.context}]` : ''} ${message}`, ...args);
  }

  error(message: string, error?: Error | unknown): void {
    console.error(`[ERROR]${this.context ? ` [${this.context}]` : ''} ${message}`, error);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN]${this.context ? ` [${this.context}]` : ''} ${message}`, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG]${this.context ? ` [${this.context}]` : ''} ${message}`, ...args);
    }
  }
}

// Database configuration interface
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean;
}

// Database utility
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connection: unknown | null = null;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(config: DatabaseConfig): Promise<void> {
    // This will be implemented with actual database connection logic
    console.log('Connecting to database...', config);
    // TODO: Implement actual connection logic and store connection
  }

  async disconnect(): Promise<void> {
    console.log('Disconnecting from database...');
    if (this.connection) {
      // TODO: Implement actual disconnection logic
      this.connection = null;
    }
  }

  getConnection(): unknown | null {
    return this.connection;
  }
}

// Utility functions
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidDiscordId = (id: string): boolean => {
  const discordIdRegex = /^\d{17,19}$/;
  return discordIdRegex.test(id);
};
