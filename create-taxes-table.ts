import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Tax } from './src/modules/taxes/tax.entity';

dotenv.config();

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Tax],
});

async function runTenantMigration() {
    try {
        await dataSource.initialize();
        console.log('Connected to database');

        const tenants = await dataSource.query(`SELECT "schemaName" FROM tenants WHERE "schemaName" IS NOT NULL`);
        console.log(`Found ${tenants.length} tenants`);

        for (const tenant of tenants) {
            const schemaName = tenant.schemaName;
            console.log(`Processing schema: ${schemaName}`);

            await dataSource.query(`
                CREATE TABLE IF NOT EXISTS "${schemaName}"."taxes" (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "name" character varying NOT NULL,
                    "type" character varying NOT NULL,
                    "taxType" character varying NOT NULL,
                    "rate" numeric(5,2) NOT NULL,
                    "status" character varying DEFAULT 'Active',
                    "wef" date,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                    CONSTRAINT "PK_taxes" PRIMARY KEY ("id")
                );
            `);
            console.log(`  ✓ Created taxes table`);
        }

        await dataSource.destroy();
        console.log('Migration complete');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

runTenantMigration();
