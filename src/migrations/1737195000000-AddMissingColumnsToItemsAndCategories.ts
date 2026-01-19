import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingColumnsToItemsAndCategories1737195000000 implements MigrationInterface {
    name = 'AddMissingColumnsToItemsAndCategories1737195000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Helper function to check if column exists
        const columnExists = async (table: string, column: string): Promise<boolean> => {
            const result = await queryRunner.query(
                `SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND column_name = $2`,
                [table, column]
            );
            return result.length > 0;
        };

        // Add missing columns to categories table
        if (!(await columnExists('categories', 'description'))) {
            await queryRunner.query(`ALTER TABLE "categories" ADD "description" text`);
        }
        if (!(await columnExists('categories', 'displayOrder'))) {
            await queryRunner.query(`ALTER TABLE "categories" ADD "displayOrder" integer NOT NULL DEFAULT '0'`);
        }
        if (!(await columnExists('categories', 'tax'))) {
            await queryRunner.query(`ALTER TABLE "categories" ADD "tax" character varying`);
        }
        if (!(await columnExists('categories', 'status'))) {
            await queryRunner.query(`ALTER TABLE "categories" ADD "status" character varying NOT NULL DEFAULT 'Active'`);
        }
        if (!(await columnExists('categories', 'wef'))) {
            await queryRunner.query(`ALTER TABLE "categories" ADD "wef" date`);
        }
        if (!(await columnExists('categories', 'productGroupId'))) {
            await queryRunner.query(`ALTER TABLE "categories" ADD "productGroupId" uuid`);
            await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_categories_productGroup" FOREIGN KEY ("productGroupId") REFERENCES "product_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        }

        // Add missing columns to items table
        if (!(await columnExists('items', 'brand'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "brand" character varying`);
        }
        if (!(await columnExists('items', 'barcode'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "barcode" character varying`);
        }
        if (!(await columnExists('items', 'unit'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "unit" character varying`);
        }
        if (!(await columnExists('items', 'gst'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "gst" character varying`);
        }
        if (!(await columnExists('items', 'hsnCode'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "hsnCode" character varying`);
        }
        if (!(await columnExists('items', 'openingStock'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "openingStock" integer NOT NULL DEFAULT '0'`);
        }
        if (!(await columnExists('items', 'cost'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "cost" numeric(10,2) NOT NULL DEFAULT '0'`);
        }
        if (!(await columnExists('items', 'mrp'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "mrp" numeric(10,2) NOT NULL DEFAULT '0'`);
        }
        if (!(await columnExists('items', 'discountPercentage'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "discountPercentage" numeric(10,2) NOT NULL DEFAULT '0'`);
        }
        if (!(await columnExists('items', 'sellingPrice'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "sellingPrice" numeric(10,2) NOT NULL DEFAULT '0'`);
        }
        if (!(await columnExists('items', 'trackQty'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "trackQty" boolean NOT NULL DEFAULT true`);
        }
        if (!(await columnExists('items', 'lowStockAlert'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "lowStockAlert" integer NOT NULL DEFAULT '5'`);
        }
        if (!(await columnExists('items', 'status'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "status" character varying NOT NULL DEFAULT 'Active'`);
        }
        if (!(await columnExists('items', 'description'))) {
            await queryRunner.query(`ALTER TABLE "items" ADD "description" text`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove columns from items table
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "lowStockAlert"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "trackQty"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "sellingPrice"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "discountPercentage"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "mrp"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "cost"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "openingStock"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "hsnCode"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "gst"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "unit"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "barcode"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "brand"`);

        // Remove columns from categories table
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_categories_productGroup"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "productGroupId"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "wef"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "tax"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "displayOrder"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "description"`);
    }
}
