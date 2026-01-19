import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1768719932510 implements MigrationInterface {
    name = 'Initial1768719932510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tenants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "schemaName" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_32731f181236a46182a38c992a8" UNIQUE ("name"), CONSTRAINT "UQ_2310ecc5cb8be427097154b18fc" UNIQUE ("slug"), CONSTRAINT "UQ_fae19dfc02d10ccce4412abb397" UNIQUE ("schemaName"), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('cashier', 'supervisor', 'manager', 'owner')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'cashier', "tenantId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "image" character varying, "stock" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" uuid, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "unitPrice" numeric(10,2) NOT NULL, "totalPrice" numeric(10,2) NOT NULL, "orderId" uuid, "itemId" uuid, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'completed', 'void', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderNumber" character varying NOT NULL, "subtotal" numeric(10,2) NOT NULL, "discount" numeric(10,2) NOT NULL DEFAULT '0', "tax" numeric(10,2) NOT NULL DEFAULT '0', "total" numeric(10,2) NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_59b0c3b34ea0fa5562342f24143" UNIQUE ("orderNumber"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payments_method_enum" AS ENUM('cash', 'card', 'upi', 'wallet')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "method" "public"."payments_method_enum" NOT NULL, "status" character varying NOT NULL DEFAULT 'completed', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "orderId" uuid, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c58f7e88c286e5e3478960a998b" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_788929ed61ab78bb914f0d1931b" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_e253fbd572683bcc785a70cbca7" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_e253fbd572683bcc785a70cbca7"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_788929ed61ab78bb914f0d1931b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c58f7e88c286e5e3478960a998b"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_method_enum"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
    }

}
