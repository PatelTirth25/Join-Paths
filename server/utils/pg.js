import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
    user: 'tirth',
    host: 'localhost',
    database: 'socialmedia',
    password: 'pool',
    port: 5432,
});

export default async function database(query, params) {
    try {
        // Get a client from the pool
        const client = await pool.connect();

        // Query the database
        const res = await client.query(query, params);

        // Release the client back to the pool
        client.release();

        // Send back the result
        return res.rows

    } catch (err) {
        console.error('Connection error', err.stack);
    }
}
