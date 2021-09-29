import { Pool } from 'pg';

const pool = new Pool({
    host: 'db',
    user: 'postgres',
    password: 'postgres',
    database: 'test',
    port: 5432
});

export const query = <T = any>(text: string, params?: string[]) => {
    return pool.query<T>(text, params);
}