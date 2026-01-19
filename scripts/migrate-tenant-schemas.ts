import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

async function applyMigrationToTenantSchemas() {
    await dataSource.initialize();
    console.log('Connected to database');

    // Get all tenant schemas
    const tenants = await dataSource.query(
        `SELECT "schemaName" FROM tenants WHERE "isActive" = true`
    );

    console.log(`Found ${tenants.length} active tenant(s)`);

    for (const tenant of tenants) {
        const schemaName = tenant.schemaName;
        console.log(`\nApplying migration to schema: ${schemaName}`);

        try {
            // Set search path to tenant schema
            await dataSource.query(`SET search_path TO "${schemaName}", public`);

            // Helper function to check if column exists
            const columnExists = async (table: string, column: string): Promise<boolean> => {
                const result = await dataSource.query(
                    `SELECT column_name FROM information_schema.columns 
                     WHERE table_schema = $1 AND table_name = $2 AND column_name = $3`,
                    [schemaName, table, column]
                );
                return result.length > 0;
            };

            // Helper function to check if table exists
            const tableExists = async (table: string): Promise<boolean> => {
                const result = await dataSource.query(
                    `SELECT table_name FROM information_schema.tables 
                     WHERE table_schema = $1 AND table_name = $2`,
                    [schemaName, table]
                );
                return result.length > 0;
            };

            // Create product_groups table if it doesn't exist
            if (!(await tableExists('product_groups'))) {
                await dataSource.query(`
                    CREATE TABLE "${schemaName}"."product_groups" (
                        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                        "name" character varying NOT NULL,
                        "code" character varying,
                        "description" text,
                        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                        CONSTRAINT "PK_product_groups_${schemaName}" PRIMARY KEY ("id")
                    )
                `);
                console.log('  ✓ Created product_groups table');
            }

            // Add missing columns to categories table
            if (!(await columnExists('categories', 'description'))) {
                await dataSource.query(`ALTER TABLE "${schemaName}"."categories" ADD "description" text`);
                console.log('  ✓ Added description to categories');
            }
            if (!(await columnExists('categories', 'displayOrder'))) {
                await dataSource.query(`ALTER TABLE "${schemaName}"."categories" ADD "displayOrder" integer NOT NULL DEFAULT '0'`);
                console.log('  ✓ Added displayOrder to categories');
            }
            if (!(await columnExists('categories', 'tax'))) {
                await dataSource.query(`ALTER TABLE "${schemaName}"."categories" ADD "tax" character varying`);
                console.log('  ✓ Added tax to categories');
            }
            if (!(await columnExists('categories', 'status'))) {
                await dataSource.query(`ALTER TABLE "${schemaName}"."categories" ADD "status" character varying NOT NULL DEFAULT 'Active'`);
                console.log('  ✓ Added status to categories');
            }
            if (!(await columnExists('categories', 'wef'))) {
                await dataSource.query(`ALTER TABLE "${schemaName}"."categories" ADD "wef" date`);
                console.log('  ✓ Added wef to categories');
            }
            if (!(await columnExists('categories', 'productGroupId'))) {
                await dataSource.query(`ALTER TABLE "${schemaName}"."categories" ADD "productGroupId" uuid`);
                await dataSource.query(`ALTER TABLE "${schemaName}"."categories" ADD CONSTRAINT "FK_categories_productGroup_${schemaName}" FOREIGN KEY ("productGroupId") REFERENCES "${schemaName}"."product_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
                console.log('  ✓ Added productGroupId to categories');
            }

            // Add missing columns to items table
            const itemColumns = [
                { name: 'brand', type: 'character varying' },
                { name: 'barcode', type: 'character varying' },
                { name: 'unit', type: 'character varying' },
                { name: 'gst', type: 'character varying' },
                { name: 'hsnCode', type: 'character varying' },
                { name: 'openingStock', type: 'integer NOT NULL DEFAULT \'0\'' },
                { name: 'cost', type: 'numeric(10,2) NOT NULL DEFAULT \'0\'' },
                { name: 'mrp', type: 'numeric(10,2) NOT NULL DEFAULT \'0\'' },
                { name: 'discountPercentage', type: 'numeric(10,2) NOT NULL DEFAULT \'0\'' },
                { name: 'sellingPrice', type: 'numeric(10,2) NOT NULL DEFAULT \'0\'' },
                { name: 'trackQty', type: 'boolean NOT NULL DEFAULT true' },
                { name: 'lowStockAlert', type: 'integer NOT NULL DEFAULT \'5\'' },
                { name: 'status', type: 'character varying NOT NULL DEFAULT \'Active\'' },
                { name: 'description', type: 'text' },
            ];

            for (const col of itemColumns) {
                if (!(await columnExists('items', col.name))) {
                    await dataSource.query(`ALTER TABLE "${schemaName}"."items" ADD "${col.name}" ${col.type}`);
                    console.log(`  ✓ Added ${col.name} to items`);
                }
            }

            console.log(`✅ Successfully migrated schema: ${schemaName}`);
        } catch (error) {
            console.error(`❌ Error migrating schema ${schemaName}:`, error.message);
        }
    }

    await dataSource.destroy();
    console.log('\n✅ Migration complete!');
}

applyMigrationToTenantSchemas().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
