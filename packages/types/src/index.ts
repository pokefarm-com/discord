// Database types
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

// API types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types
export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Discord types
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
}

// Common types
export type Environment = 'development' | 'staging' | 'production';

export interface Config {
  environment: Environment;
  port: number;
  database: DatabaseConfig;
  discord: {
    token: string;
    clientId: string;
    guildId: string;
  };
  api: {
    baseUrl: string;
    cors: {
      origin: string[];
    };
  };
}
