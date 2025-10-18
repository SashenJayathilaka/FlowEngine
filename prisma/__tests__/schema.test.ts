import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Prisma Schema Validation', () => {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
  let schemaContent: string

  beforeAll(() => {
    schemaContent = fs.readFileSync(schemaPath, 'utf-8')
  })

  describe('Schema File Structure', () => {
    it('should exist at the correct location', () => {
      expect(fs.existsSync(schemaPath)).toBe(true)
    })

    it('should be a valid .prisma file', () => {
      expect(schemaPath).toMatch(/\.prisma$/)
    })

    it('should not be empty', () => {
      expect(schemaContent.length).toBeGreaterThan(0)
    })

    it('should contain required schema sections', () => {
      expect(schemaContent).toContain('generator client')
      expect(schemaContent).toContain('datasource db')
    })
  })

  describe('Generator Configuration', () => {
    it('should specify prisma-client-js generator', () => {
      expect(schemaContent).toContain('provider = "prisma-client-js"')
    })

    it('should specify custom output path', () => {
      expect(schemaContent).toContain('output   = "../lib/generated/prisma"')
    })

    it('should have only one generator block', () => {
      const matches = schemaContent.match(/generator\s+client\s+{/g)
      expect(matches).toHaveLength(1)
    })
  })

  describe('Datasource Configuration', () => {
    it('should specify postgresql provider', () => {
      expect(schemaContent).toContain('provider = "postgresql"')
    })

    it('should reference DATABASE_URL environment variable', () => {
      expect(schemaContent).toContain('url      = env("DATABASE_URL")')
    })

    it('should have only one datasource block', () => {
      const matches = schemaContent.match(/datasource\s+db\s+{/g)
      expect(matches).toHaveLength(1)
    })

    it('should use correct datasource identifier', () => {
      expect(schemaContent).toMatch(/datasource\s+db\s+{/)
    })
  })

  describe('User Model', () => {
    it('should define User model', () => {
      expect(schemaContent).toMatch(/model\s+User\s+{/)
    })

    it('should have id field as primary key with autoincrement', () => {
      expect(schemaContent).toMatch(/id\s+Int\s+@id\s+@default\(autoincrement\(\)\)/)
    })

    it('should have email field as unique String', () => {
      expect(schemaContent).toMatch(/email\s+String\s+@unique/)
    })

    it('should have optional name field', () => {
      expect(schemaContent).toMatch(/name\s+String\?/)
    })

    it('should have posts relation to Post model', () => {
      expect(schemaContent).toMatch(/posts\s+Post\[\]/)
    })

    it('should have all required User fields', () => {
      const userModelMatch = schemaContent.match(/model\s+User\s+{[\s\S]*?^}/m)?.[0]
      expect(userModelMatch).toBeDefined()
      expect(userModelMatch).toContain('id')
      expect(userModelMatch).toContain('email')
      expect(userModelMatch).toContain('name')
      expect(userModelMatch).toContain('posts')
    })
  })

  describe('Post Model', () => {
    it('should define Post model', () => {
      expect(schemaContent).toMatch(/model\s+Post\s+{/)
    })

    it('should have id field as primary key with autoincrement', () => {
      const idMatches = schemaContent.match(/id\s+Int\s+@id\s+@default\(autoincrement\(\)\)/g)
      expect(idMatches).toBeDefined()
      expect(idMatches!.length).toBeGreaterThanOrEqual(2)
    })

    it('should have title field as required String', () => {
      expect(schemaContent).toMatch(/title\s+String/)
    })

    it('should have optional content field', () => {
      expect(schemaContent).toMatch(/content\s+String\?/)
    })

    it('should have published field with default false', () => {
      expect(schemaContent).toMatch(/published\s+Boolean\s+@default\(false\)/)
    })

    it('should have authorId field as Int', () => {
      expect(schemaContent).toMatch(/authorId\s+Int/)
    })

    it('should have author relation to User model', () => {
      expect(schemaContent).toMatch(/author\s+User\s+@relation\(fields:\s*\[authorId\],\s*references:\s*\[id\]\)/)
    })

    it('should have all required Post fields', () => {
      const postModelMatch = schemaContent.match(/model\s+Post\s+{[\s\S]*?^}/m)?.[1]
      expect(postModelMatch).toBeDefined()
    })
  })

  describe('Relationships', () => {
    it('should establish one-to-many relationship between User and Post', () => {
      expect(schemaContent).toContain('posts Post[]')
      expect(schemaContent).toMatch(/author\s+User\s+@relation/)
    })

    it('should properly define foreign key in Post model', () => {
      expect(schemaContent).toMatch(/@relation\(fields:\s*\[authorId\],\s*references:\s*\[id\]\)/)
    })

    it('should use correct field names in relation', () => {
      const relationMatch = schemaContent.match(/@relation\(fields:\s*\[(\w+)\],\s*references:\s*\[(\w+)\]\)/)
      expect(relationMatch).toBeDefined()
      expect(relationMatch?.[1]).toBe('authorId')
      expect(relationMatch?.[2]).toBe('id')
    })
  })

  describe('Data Types', () => {
    it('should use Int for id fields', () => {
      const idMatches = schemaContent.match(/id\s+Int/g)
      expect(idMatches).toBeDefined()
      expect(idMatches!.length).toBeGreaterThanOrEqual(2)
    })

    it('should use String for text fields', () => {
      expect(schemaContent).toContain('email String')
      expect(schemaContent).toContain('title String')
    })

    it('should use Boolean for published field', () => {
      expect(schemaContent).toContain('published Boolean')
    })

    it('should properly mark optional fields with ?', () => {
      expect(schemaContent).toMatch(/name\s+String\?/)
      expect(schemaContent).toMatch(/content\s+String\?/)
    })
  })

  describe('Constraints and Defaults', () => {
    it('should use @id attribute for primary keys', () => {
      const idAttributes = schemaContent.match(/@id/g)
      expect(idAttributes).toBeDefined()
      expect(idAttributes!.length).toBe(2)
    })

    it('should use @default(autoincrement()) for id fields', () => {
      const autoIncrements = schemaContent.match(/@default\(autoincrement\(\)\)/g)
      expect(autoIncrements).toBeDefined()
      expect(autoIncrements!.length).toBe(2)
    })

    it('should use @unique for email field', () => {
      expect(schemaContent).toContain('@unique')
      expect(schemaContent).toMatch(/email\s+String\s+@unique/)
    })

    it('should set default value for published field', () => {
      expect(schemaContent).toMatch(/published\s+Boolean\s+@default\(false\)/)
    })
  })

  describe('Schema Formatting', () => {
    it('should have models properly structured', () => {
      const models = schemaContent.match(/model\s+\w+\s+{[\s\S]*?^}/gm)
      expect(models).toBeDefined()
      expect(models!.length).toBe(2)
    })

    it('should have matching braces', () => {
      const openBraces = (schemaContent.match(/{/g) || []).length
      const closeBraces = (schemaContent.match(/}/g) || []).length
      expect(openBraces).toBe(closeBraces)
    })

    it('should not have syntax errors in model definitions', () => {
      expect(schemaContent).not.toMatch(/}}\s*}/)
      expect(schemaContent).not.toMatch(/{{/)
    })
  })

  describe('Best Practices', () => {
    it('should use consistent naming conventions (PascalCase for models)', () => {
      expect(schemaContent).toMatch(/model\s+User/)
      expect(schemaContent).toMatch(/model\s+Post/)
    })

    it('should use camelCase for field names', () => {
      expect(schemaContent).toMatch(/authorId/)
    })

    it('should define relations bidirectionally', () => {
      expect(schemaContent).toContain('posts Post[]')
      expect(schemaContent).toContain('author    User')
    })

    it('should use meaningful field names', () => {
      const meaningfulFields = ['email', 'name', 'title', 'content', 'published', 'author']
      meaningfulFields.forEach(field => {
        expect(schemaContent).toContain(field)
      })
    })
  })

  describe('Migration Lock File', () => {
    it('should have migration_lock.toml file', () => {
      const lockPath = path.join(process.cwd(), 'prisma', 'migrations', 'migration_lock.toml')
      expect(fs.existsSync(lockPath)).toBe(true)
    })

    it('should specify postgresql provider in lock file', () => {
      const lockPath = path.join(process.cwd(), 'prisma', 'migrations', 'migration_lock.toml')
      const lockContent = fs.readFileSync(lockPath, 'utf-8')
      expect(lockContent).toContain('provider = "postgresql"')
    })
  })

  describe('Initial Migration', () => {
    it('should have init migration directory', () => {
      const migrationDir = path.join(process.cwd(), 'prisma', 'migrations')
      const migrations = fs.readdirSync(migrationDir).filter(f => f.startsWith('202'))
      expect(migrations.length).toBeGreaterThan(0)
    })

    it('should have migration.sql file', () => {
      const migrationDir = path.join(process.cwd(), 'prisma', 'migrations')
      const migrations = fs.readdirSync(migrationDir).filter(f => f.startsWith('202'))
      const sqlPath = path.join(migrationDir, migrations[0], 'migration.sql')
      expect(fs.existsSync(sqlPath)).toBe(true)
    })

    it('should create User table in migration', () => {
      const migrationDir = path.join(process.cwd(), 'prisma', 'migrations')
      const migrations = fs.readdirSync(migrationDir).filter(f => f.startsWith('202'))
      const sqlPath = path.join(migrationDir, migrations[0], 'migration.sql')
      const migrationSql = fs.readFileSync(sqlPath, 'utf-8')
      expect(migrationSql).toContain('CREATE TABLE "User"')
    })

    it('should create Post table in migration', () => {
      const migrationDir = path.join(process.cwd(), 'prisma', 'migrations')
      const migrations = fs.readdirSync(migrationDir).filter(f => f.startsWith('202'))
      const sqlPath = path.join(migrationDir, migrations[0], 'migration.sql')
      const migrationSql = fs.readFileSync(sqlPath, 'utf-8')
      expect(migrationSql).toContain('CREATE TABLE "Post"')
    })

    it('should add foreign key constraint in migration', () => {
      const migrationDir = path.join(process.cwd(), 'prisma', 'migrations')
      const migrations = fs.readdirSync(migrationDir).filter(f => f.startsWith('202'))
      const sqlPath = path.join(migrationDir, migrations[0], 'migration.sql')
      const migrationSql = fs.readFileSync(sqlPath, 'utf-8')
      expect(migrationSql).toContain('FOREIGN KEY')
      expect(migrationSql).toContain('Post_authorId_fkey')
    })
  })
})