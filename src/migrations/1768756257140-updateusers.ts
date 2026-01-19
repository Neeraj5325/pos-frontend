import { MigrationInterface, QueryRunner } from "typeorm";

export class Updateusers1768756257140 implements MigrationInterface {
    name = 'Updateusers1768756257140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_permissions" DROP CONSTRAINT "FK_user_permissions_user"`);
        await queryRunner.query(`CREATE TABLE "taxes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" character varying NOT NULL, "taxType" character varying NOT NULL, "rate" numeric(5,2) NOT NULL, "status" character varying NOT NULL DEFAULT 'Active', "wef" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c58c9cbb420c4f65e3f5eb8162" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "suppliers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "supplierType" character varying, "address" text, "gstRegistrationType" character varying, "gstin" character varying, "openingBalance" numeric(10,2) NOT NULL DEFAULT '0', "paymentTerm" character varying, "state" character varying, "city" character varying, "pinCode" character varying, "mobileNo" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_permissions" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_permissions" ADD CONSTRAINT "FK_f05ccc7935f14874d7f89ba030f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_permissions" DROP CONSTRAINT "FK_f05ccc7935f14874d7f89ba030f"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_permissions" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "suppliers"`);
        await queryRunner.query(`DROP TABLE "taxes"`);
        await queryRunner.query(`ALTER TABLE "user_permissions" ADD CONSTRAINT "FK_user_permissions_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
