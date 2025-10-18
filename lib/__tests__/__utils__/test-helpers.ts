import { vi } from 'vitest'

/**
 * Helper to reset and clear all environment variables
 */
export function resetEnvironment() {
  const env = process.env
  Object.keys(env).forEach(key => {
    if (key.startsWith('TEST_') || key === 'NODE_ENV' || key === 'DATABASE_URL') {
      delete env[key]
    }
  })
}

/**
 * Helper to mock environment variables
 */
export function mockEnv(vars: Record<string, string>) {
  Object.entries(vars).forEach(([key, value]) => {
    process.env[key] = value
  })
}

/**
 * Helper to create a mock PrismaClient
 */
export function createMockPrismaClient() {
  return {
    $connect: vi.fn().mockResolvedValue(undefined),
    $disconnect: vi.fn().mockResolvedValue(undefined),
    $transaction: vi.fn(),
    $queryRaw: vi.fn(),
    $executeRaw: vi.fn(),
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    post: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  }
}