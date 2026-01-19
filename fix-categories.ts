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

async function fixCategoriesTable() {
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
            console.log(`\n=== Fixing schema: ${schemaName} ===`);

            try {
                // Enable UUID extension in the schema
                console.log('1. Enabling UUID extension...');
                await dataSource.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

                // Drop existing tables if they exist (to recreate properly)
                console.log('2. Dropping existing tables if present...');
                await dataSource.query(`DROP TABLE IF EXISTS "${schemaName}"."categories" CASCADE`);
                await dataSource.query(`DROP TABLE IF EXISTS "${schemaName}"."product_groups" CASCADE`);

                // Create product_groups table
                console.log('3. Creating product_groups table...');
                await dataSource.query(`
                    CREATE TABLE "${schemaName}"."product_groups" (
                        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                        "name" character varying NOT NULL,
                        "code" character varying,
                        "description" text,
                        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                        CONSTRAINT "PK_product_groups" PRIMARY KEY ("id")
                    )
                `);
                console.log(`  ✓ product_groups table created`);

                // Create categories table
                console.log('4. Creating categories table...');
                await dataSource.query(`
                    CREATE TABLE "${schemaName}"."categories" (
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
                        CONSTRAINT "PK_categories" PRIMARY KEY ("id"),
                        CONSTRAINT "FK_categories_product_groups" FOREIGN KEY ("productGroupId") 
                            REFERENCES "${schemaName}"."product_groups"("id") ON DELETE SET NULL
                    )
                `);
                console.log(`  ✓ categories table created`);

                // Verify the table structure
                console.log('5. Verifying table structure...');
                const tableInfo = await dataSource.query(`
                    SELECT column_name, column_default, is_nullable, data_type
                    FROM information_schema.columns
                    WHERE table_schema = '${schemaName}' AND table_name = 'categories'
                    ORDER BY ordinal_position
                `);

                console.log('\n  Categories table structure:');
                tableInfo.forEach((col: any) => {
                    console.log(`    - ${col.column_name}: ${col.data_type} | Default: ${col.column_default || 'none'} | Nullable: ${col.is_nullable}`);
                });

                console.log(`\n  ✓ Schema ${schemaName} fixed successfully!`);

            } catch (error:any) {
                console.error(`  ✗ Error fixing schema ${schemaName}:`, error.message);
            }
        }

        console.log('\n✓ All schemas fixed!');
        await dataSource.destroy();
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        await dataSource.destroy();
        process.exit(1);
    }
}

fixCategoriesTable();
