import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Tenant } from './tenants/tenant.entity';
import { User } from './users/user.entity';
import { UserPermission } from './users/user-permission.entity';

import { TenancyModule } from './tenancy/tenancy.module';
import { TenancyMiddleware } from './tenancy/tenancy.middleware';
import { TenantsModule } from './tenants/tenants.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './modules/items/items.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { TaxesModule } from './modules/taxes/taxes.module';
import { ProductGroupsModule } from './modules/product-group/product-groups.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Tenant, User, UserPermission],
        autoLoadEntities: true,
        synchronize: false, // Set to false when using migrations
      }),
      inject: [ConfigService],
    }),
    TenancyModule,
    TenantsModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    ProductGroupsModule,
    ProductCategoryModule,
    ItemsModule,
    TaxesModule,
    SuppliersModule,
    
  ],





  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenancyMiddleware).forRoutes('*');
  }
}
