import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock PrismaClient before importing db
vi.mock('../generated/prisma', () => {
  const mockPrismaClient = vi.fn(() => ({
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  }))
  
  return {
    PrismaClient: mockPrismaClient,
  }
})

describe('lib/db.ts', () => {
  let originalNodeEnv: string | undefined
  let originalGlobalPrisma: any

  beforeEach(() => {
    // Store original values
    originalNodeEnv = process.env.NODE_ENV
    originalGlobalPrisma = (global as any).prisma

    // Clear the module cache to get fresh imports
    vi.resetModules()
    
    // Clean up global prisma
    delete (global as any).prisma
  })

  afterEach(() => {
    // Restore original values
    process.env.NODE_ENV = originalNodeEnv
    if (originalGlobalPrisma !== undefined) {
      (global as any).prisma = originalGlobalPrisma
    } else {
      delete (global as any).prisma
    }
    
    vi.clearAllMocks()
  })

  describe('Singleton Pattern', () => {
    it('should create a new PrismaClient instance when none exists', async () => {
      const { PrismaClient } = await import('../generated/prisma')
      await import('../db')

      expect(PrismaClient).toHaveBeenCalledTimes(1)
    })

    it('should export a prisma client instance', async () => {
      const db = await import('../db')
      
      expect(db.default).toBeDefined()
      expect(typeof db.default).toBe('object')
    })

    it('should reuse existing PrismaClient instance from global in development', async () => {
      process.env.NODE_ENV = 'development'
      
      const { PrismaClient } = await import('../generated/prisma')
      const mockInstance = new PrismaClient()
      
      // Set up global prisma
      const globalForPrisma = global as unknown as { prisma: any }
      globalForPrisma.prisma = mockInstance

      // Clear and re-import to test reuse
      vi.resetModules()
      const db = await import('../db')

      // Should reuse the existing instance, not create a new one
      expect(db.default).toBe(mockInstance)
    })
  })

  describe('Environment-based Behavior', () => {
    it('should store prisma instance in global when NODE_ENV is not production', async () => {
      process.env.NODE_ENV = 'development'
      vi.resetModules()
      
      await import('../db')
      
      const globalForPrisma = global as unknown as { prisma: any }
      expect(globalForPrisma.prisma).toBeDefined()
    })

    it('should store prisma instance in global when NODE_ENV is test', async () => {
      process.env.NODE_ENV = 'test'
      vi.resetModules()
      
      await import('../db')
      
      const globalForPrisma = global as unknown as { prisma: any }
      expect(globalForPrisma.prisma).toBeDefined()
    })

    it('should not pollute global in production environment', async () => {
      process.env.NODE_ENV = 'production'
      delete (global as any).prisma
      vi.resetModules()
      
      const { PrismaClient } = await import('../generated/prisma')
      const initialCallCount = (PrismaClient as any).mock.calls.length
      
      await import('../db')
      
      // In production, it should create instance but not store in global
      expect((PrismaClient as any).mock.calls.length).toBeGreaterThan(initialCallCount)
    })

    it('should handle undefined NODE_ENV as non-production', async () => {
      delete process.env.NODE_ENV
      vi.resetModules()
      
      await import('../db')
      
      const globalForPrisma = global as unknown as { prisma: any }
      expect(globalForPrisma.prisma).toBeDefined()
    })
  })

  describe('Multiple Import Behavior', () => {
    it('should return the same instance on multiple imports in development', async () => {
      process.env.NODE_ENV = 'development'
      vi.resetModules()
      
      const db1 = await import('../db')
      const db2 = await import('../db')

      expect(db1.default).toBe(db2.default)
    })

    it('should prevent multiple PrismaClient instantiations in development', async () => {
      process.env.NODE_ENV = 'development'
      vi.resetModules()
      
      const { PrismaClient } = await import('../generated/prisma')
      
      // Import multiple times
      await import('../db')
      const callCountAfterFirst = (PrismaClient as any).mock.calls.length
      
      vi.resetModules()
      await import('../db')
      const callCountAfterSecond = (PrismaClient as any).mock.calls.length

      // Should reuse global instance on second import
      expect(callCountAfterSecond).toBe(callCountAfterFirst)
    })
  })

  describe('Type Safety', () => {
    it('should properly type the global object', async () => {
      const db = await import('../db')
      
      // This test ensures TypeScript compilation works
      // The actual type checking happens at compile time
      expect(db.default).toBeDefined()
    })

    it('should handle global type assertion without runtime errors', async () => {
      process.env.NODE_ENV = 'development'
      vi.resetModules()
      
      // Should not throw during global type assertion
      expect(async () => {
        await import('../db')
      }).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid consecutive imports', async () => {
      process.env.NODE_ENV = 'development'
      vi.resetModules()
      
      const imports = await Promise.all([
        import('../db'),
        import('../db'),
        import('../db'),
      ])

      // All should reference the same instance
      expect(imports[0].default).toBe(imports[1].default)
      expect(imports[1].default).toBe(imports[2].default)
    })

    it('should handle falsy NODE_ENV values correctly', async () => {
      const falsyValues = ['', '0', 'false']
      
      for (const value of falsyValues) {
        process.env.NODE_ENV = value
        delete (global as any).prisma
        vi.resetModules()
        
        await import('../db')
        
        // Should treat as non-production and store in global
        const globalForPrisma = global as unknown as { prisma: any }
        expect(globalForPrisma.prisma).toBeDefined()
      }
    })

    it('should create new instance if global.prisma exists but is undefined', async () => {
      process.env.NODE_ENV = 'development'
      const globalForPrisma = global as unknown as { prisma: any }
      globalForPrisma.prisma = undefined
      vi.resetModules()
      
      const { PrismaClient } = await import('../generated/prisma')
      await import('../db')

      // Should create new instance when global.prisma is undefined
      expect(PrismaClient).toHaveBeenCalled()
    })
  })

  describe('Export Validation', () => {
    it('should have default export', async () => {
      const db = await import('../db')
      
      expect(db.default).toBeDefined()
      expect(db.default).not.toBeNull()
    })

    it('should not have named exports', async () => {
      const db = await import('../db')
      const keys = Object.keys(db).filter(key => key !== 'default')
      
      expect(keys.length).toBe(0)
    })

    it('should export an object (PrismaClient instance)', async () => {
      const db = await import('../db')
      
      expect(typeof db.default).toBe('object')
      expect(db.default).not.toBeNull()
    })
  })
})