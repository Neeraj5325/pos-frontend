import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/users/user.entity';
import { UserPermission } from './src/users/user-permission.entity';
import { Tenant } from './src/tenants/tenant.entity';

dotenv.config();

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, UserPermission, Tenant], // Include all related entities
});

async function runPublicMigration() {
    try {
        await dataSource.initialize();
        console.log('Connected to database');

        // Create user_permissions table
        await dataSource.query(`
            CREATE TABLE IF NOT EXISTS "public"."user_permissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "module" character varying NOT NULL,
                "canCreate" boolean NOT NULL DEFAULT false,
                "canEdit" boolean NOT NULL DEFAULT false,
                "canDelete" boolean NOT NULL DEFAULT false,
                "canView" boolean NOT NULL DEFAULT false,
                "canPrint" boolean NOT NULL DEFAULT false,
                "userId" uuid,
                CONSTRAINT "PK_user_permissions" PRIMARY KEY ("id"),
                CONSTRAINT "FK_user_permissions_user" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE
            );
        `);
        console.log('  ✓ Created user_permissions table');

        // Check columns in users table
        const columns = await dataSource.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND table_schema = 'public'
        `);

        const columnNames = columns.map(c => c.column_name);

        if (!columnNames.includes('mobileNo')) {
            await dataSource.query(`ALTER TABLE "public"."users" ADD COLUMN "mobileNo" character varying`);
            console.log('  ✓ Added mobileNo column');
        }
        if (!columnNames.includes('status')) {
            await dataSource.query(`ALTER TABLE "public"."users" ADD COLUMN "status" character varying DEFAULT 'Active'`);
            console.log('  ✓ Added status column');
        }
        if (!columnNames.includes('wef')) {
            await dataSource.query(`ALTER TABLE "public"."users" ADD COLUMN "wef" date`);
            console.log('  ✓ Added wef column');
        }

        await dataSource.destroy();
        console.log('Migration complete');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

runPublicMigration();
