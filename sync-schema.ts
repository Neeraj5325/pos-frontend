import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

async function syncSchema() {
    try {
        await dataSource.initialize();
        console.log('Connected to database');

        // Get all tenants
        const tenants = await dataSource.query(`
            SELECT "schemaName" FROM tenants WHERE "schemaName" IS NOT NULL
        `);

        console.log(`Found ${tenants.length} tenant(s)`);

        for (const tenant of tenants) {
            const schemaName = tenant.schemaName;
            console.log(`\nSyncing schema: ${schemaName}`);

            try {
                // Create product_groups table
                await dataSource.query(`
                    CREATE TABLE IF NOT EXISTS "${schemaName}"."product_groups" (
                        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                        "name" character varying NOT NULL,
                        "code" character varying,
                        "description" text,
                        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                        CONSTRAINT "PK_${schemaName}_product_groups" PRIMARY KEY ("id")
                    );
                `);
                console.log(`  ✓ product_groups table created/verified`);

                // Create categories table
                await dataSource.query(`
                    CREATE TABLE IF NOT EXISTS "${schemaName}"."categories" (
                        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                        "name" character varying NOT NULL,
                        "icon" character varying,
                        "description" text,
                        "displayOrder" integer DEFAULT 0,
                        "tax" character varying,
                        "status" character varying DEFAULT 'Active',
                        "wef" date,
                        "productGroupId" uuid,
                        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                        CONSTRAINT "PK_${schemaName}_categories" PRIMARY KEY ("id"),
                        CONSTRAINT "FK_${schemaName}_categories_product_groups" FOREIGN KEY ("productGroupId") REFERENCES "${schemaName}"."product_groups"("id")
                    );
                `);
                console.log(`  ✓ categories table created/verified`);

            } catch (error:any) {
                console.error(`  ✗ Error syncing schema ${schemaName}:`, error.message);
            }
        }

        console.log('\n✓ Schema sync complete!');
        await dataSource.destroy();
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        await dataSource.destroy();
        process.exit(1);
    }
}

syncSchema();
