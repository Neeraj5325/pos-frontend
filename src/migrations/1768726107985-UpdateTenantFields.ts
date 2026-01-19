import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTenantFields1768726107985 implements MigrationInterface {
    name = 'UpdateTenantFields1768726107985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_53030d3a4b3ba3a7175bb132378" UNIQUE ("code"), CONSTRAINT "PK_bccc8805f3453d0cce77c1beedb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "pinCode" character varying`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "mobile" character varying`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "gstRegistrationType" character varying`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "gstin" character varying`);
        await queryRunner.query(`ALTER TABLE "items" ADD "brand" character varying`);
        await queryRunner.query(`ALTER TABLE "items" ADD "barcode" character varying`);
        await queryRunner.query(`ALTER TABLE "items" ADD "unit" character varying`);
        await queryRunner.query(`ALTER TABLE "items" ADD "gst" character varying`);
        await queryRunner.query(`ALTER TABLE "items" ADD "hsnCode" character varying`);
        await queryRunner.query(`ALTER TABLE "items" ADD "openingStock" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "items" ADD "cost" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "items" ADD "mrp" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "items" ADD "discountPercentage" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "items" ADD "sellingPrice" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "items" ADD "trackQty" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "items" ADD "lowStockAlert" integer NOT NULL DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "items" ADD "status" character varying NOT NULL DEFAULT 'Active'`);
        await queryRunner.query(`ALTER TABLE "items" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "displayOrder" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "tax" character varying`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "status" character varying NOT NULL DEFAULT 'Active'`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "wef" date`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "productGroupId" uuid`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_225e818e565dd877ed01e54614c" FOREIGN KEY ("productGroupId") REFERENCES "product_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_225e818e565dd877ed01e54614c"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "productGroupId"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "wef"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "tax"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "displayOrder"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "description"`);
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
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "gstin"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "gstRegistrationType"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "mobile"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "pinCode"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "address"`);
        await queryRunner.query(`DROP TABLE "product_groups"`);
    }

}
