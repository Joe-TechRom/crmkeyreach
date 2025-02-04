import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const supabaseUrl = 'https://jntbefyqkqciwgkofttx.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudGJlZnlxa3FjaXdna29mdHR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjM1NjY1OCwiZXhwIjoyMDUxOTMyNjU4fQ.b2B1XJCCpscMrOTzkz93fkI-AduRIQ3p4eEUuptv_Sg';

const connectionString = `postgres://postgres.jntbefyqkqciwgkofttx:${supabaseServiceRoleKey}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`;

const client = postgres(connectionString, {
  ssl: true,
});

export const db = drizzle(client, { schema });
