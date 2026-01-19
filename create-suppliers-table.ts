import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Supplier } from './src/modules/suppliers/supplier.entity';

dotenv.config();

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Supplier],
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
                CREATE TABLE IF NOT EXISTS "${schemaName}"."suppliers" (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "name" character varying NOT NULL,
                    "supplierType" character varying,
                    "address" text,
                    "gstRegistrationType" character varying,
                    "gstin" character varying,
                    "openingBalance" numeric(10,2) DEFAULT 0,
                    "paymentTerm" character varying,
                    "state" character varying,
                    "city" character varying,
                    "pinCode" character varying,
                    "mobileNo" character varying,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                    CONSTRAINT "PK_suppliers" PRIMARY KEY ("id")
                );
            `);
            console.log(`  ✓ Created suppliers table`);
        }

        await dataSource.destroy();
        console.log('Migration complete');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

runTenantMigration();
