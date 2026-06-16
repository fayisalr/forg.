import { Pool } from 'pg';

let pool: Pool;

const poolConfig = {
  host: process.env.DB_HOST || 'db.ygjmbeeuomwiciyjkmbd.supabase.co',
  port: parseInt(process.env.DB_PORT || '6543'),
  user: process.env.DB_USER || 'postgres',
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

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

export { pool };
