import { Pool } from 'pg';

let pool: Pool;

const poolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
