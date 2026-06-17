import { Pool, PoolConfig } from 'pg';

let pool: Pool;

// Prioritize DATABASE_URL if available, otherwise construct from individual fields
const connectionString = process.env.DATABASE_URL;

const poolConfig: PoolConfig = connectionString
  ? {
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    }
  : {
      host: process.env.DB_HOST || 'aws-1-ap-southeast-2.pooler.supabase.com',
      port: parseInt(process.env.DB_PORT || '6543'),
      user: process.env.DB_USER || 'postgres.ygjmbeeuomwiciyjkmbd',
      password: process.env.DB_PASSWORD || 'Forg@2030#@',
      database: process.env.DB_NAME || 'postgres',
      ssl: {
        rejectUnauthorized: false
      }
    };

if (process.env.NODE_ENV === 'production') {
  pool = new Pool(poolConfig);
} else {
  // Prevent multiple instances of Pool in development
  if (!(global as any)._postgresPool) {
    (global as any)._postgresPool = new Pool(poolConfig);
  }
  pool = (global as any)._postgresPool;
}

// Add unexpected idle client error handler
pool.on('error', (err) => {
  console.error('Unexpected database client error on idle client:', {
    message: err.message,
    stack: err.stack
  });
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // Log slow queries (> 500ms) or log general execution stats in debug mode if needed
    if (duration > 500) {
      console.warn(`Slow query executed: ${text.substring(0, 100)}... took ${duration}ms`);
    }
    return res;
  } catch (error: any) {
    const duration = Date.now() - start;
    console.error('Database Query Failure:', {
      sql: text.substring(0, 200),
      duration: `${duration}ms`,
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
    throw new Error(`Database connection or query failed: ${error.message}`);
  }
}

export { pool };

