import { envSchema } from '@/schemas/envs.schema';
import dotenv from 'dotenv';

dotenv.config(); // Load .env

// Utility: Mask sensitive values
const maskValue = (key: string, value: string) => {
  const SENSITIVE_KEYS = ['PASSWORD', 'SECRET', 'KEY', 'TOKEN'];
  return SENSITIVE_KEYS.some(sensitive => key.toUpperCase().includes(sensitive)) ? '****' : value;
};

// Load and validate environment variables
export const loadEnv = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid or missing environment variables:'.red.italic.bold);
    console.dir(parsed.error.format(), { depth: null });
    process.exit(1);
  } else {
    console.log('✅ Environment variables loaded successfully.\n'.green.italic.bold);
    Object.entries(parsed.data).forEach(([key, val]) => {
      const displayVal = typeof val === 'string' ? maskValue(key, val) : val;
      console.log(`  ${key}: ${displayVal}`.gray);
    });
    console.log('\n');
  }

  return parsed.success ? parsed.data : null;
};
