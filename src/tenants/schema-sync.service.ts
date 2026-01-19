import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SchemaSyncService {
  constructor(private dataSource: DataSource) { }

  async createTablesForSchema(schemaName: string) {
    // This is a simplified way to create tables in a new schema by copying from public schema
    // or running a raw SQL script. 
    // In a real app, you'd run TypeORM migrations targeting this schema.

    const tables = ['categories', 'items', 'orders', 'order_items', 'payments', 'users'];

    for (const table of tables) {
      // We can use CREATE TABLE ... AS SELECT * FROM ... WITH NO DATA 
      // but we need to handle constraints. Better to just run the SQL definitions.
      // For this prototype, I'll run a manual script.
    }
  }

  getSchemaInitSql(schemaName: string): string {
    return `
      CREATE TABLE IF NOT EXISTS "${schemaName}"."product_groups" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "code" character varying,
        "description" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_product_groups" PRIMARY KEY ("id")
      );

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
        CONSTRAINT "PK_categories" PRIMARY KEY ("id"),
        CONSTRAINT "FK_categories_product_groups" FOREIGN KEY ("productGroupId") REFERENCES "${schemaName}"."product_groups"("id")
      );

      CREATE TABLE IF NOT EXISTS "${schemaName}"."items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "image" character varying,
        "brand" character varying,
        "barcode" character varying,
        "unit" character varying,
        "gst" character varying,
        "hsnCode" character varying,
        "stock" integer NOT NULL DEFAULT 0,
        "openingStock" integer NOT NULL DEFAULT 0,
        "cost" numeric(10,2) DEFAULT 0,
        "mrp" numeric(10,2) DEFAULT 0,
        "discountPercentage" numeric(10,2) DEFAULT 0,
        "sellingPrice" numeric(10,2) DEFAULT 0,
        "trackQty" boolean DEFAULT true,
        "lowStockAlert" integer DEFAULT 5,
        "status" character varying DEFAULT 'Active',
        "description" text,
        "categoryId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_items_categories" FOREIGN KEY ("categoryId") REFERENCES "${schemaName}"."categories"("id")
      );

      CREATE TABLE IF NOT EXISTS "${schemaName}"."orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "orderNumber" character varying NOT NULL,
        "subtotal" numeric(10,2) NOT NULL,
        "discount" numeric(10,2) NOT NULL DEFAULT 0,
        "tax" numeric(10,2) NOT NULL DEFAULT 0,
        "total" numeric(10,2) NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_orders" PRIMARY KEY ("id")
      );

      CREATE TABLE IF NOT EXISTS "${schemaName}"."order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "quantity" integer NOT NULL,
        "unitPrice" numeric(10,2) NOT NULL,
        "totalPrice" numeric(10,2) NOT NULL,
        "orderId" uuid,
        "itemId" uuid,
        CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_items_orders" FOREIGN KEY ("orderId") REFERENCES "${schemaName}"."orders"("id"),
        CONSTRAINT "FK_order_items_items" FOREIGN KEY ("itemId") REFERENCES "${schemaName}"."items"("id")
      );

      CREATE TABLE IF NOT EXISTS "${schemaName}"."payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "amount" numeric(10,2) NOT NULL,
        "method" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'completed',
        "orderId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_payments_orders" FOREIGN KEY ("orderId") REFERENCES "${schemaName}"."orders"("id")
      );

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

      -- We also need users within the schema if we want them to be schema-specific, 
      -- but usually users are in public schema with a tenant link.
      -- Let's keep users in public for global login, but we can have schema-specific settings.
    `;
  }
}
