import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');

const targetProvider = process.argv[2]?.toLowerCase();

if (!['sqlite', 'postgresql', 'postgres'].includes(targetProvider)) {
  console.log(`
Usage:
  node scripts/switch-db.mjs postgresql   # Switch schema for Supabase / Neon / Railway / RDS
  node scripts/switch-db.mjs sqlite       # Switch schema for local development & testing
`);
  process.exit(1);
}

const provider = targetProvider === 'postgres' ? 'postgresql' : targetProvider;

let schema = fs.readFileSync(schemaPath, 'utf8');
schema = schema.replace(
  /datasource db \{\s*provider\s*=\s*"[^"]+"\s*url\s*=\s*env\("DATABASE_URL"\)\s*\}/,
  `datasource db {\n  provider = "${provider}"\n  url      = env("DATABASE_URL")\n}`
);

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log(`[Database Switcher] Successfully updated prisma/schema.prisma datasource provider to: "${provider}"`);
