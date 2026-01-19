import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export async function ensureDatabaseExists() {
    const dbName = process.env.DB_DATABASE || 'pos_system';

    // Connect to the default 'postgres' database to check/create the target database
    const client = new Client({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'postgres', // Connect to default database
    });

    try {
        await client.connect();

        // Check if database exists
        const res = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName],
        );

        if (res.rowCount === 0) {
            console.log(`Database "${dbName}" does not exist. Creating...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database "${dbName}" created successfully.`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }
    } catch (err) {
        console.error(`Error ensuring database exists:`, err);
        throw err;
    } finally {
        await client.end();
    }
}
