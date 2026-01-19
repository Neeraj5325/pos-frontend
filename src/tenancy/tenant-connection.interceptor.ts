import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable, from, throwError } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';

@Injectable()
export class TenantConnectionInterceptor implements NestInterceptor {
    private readonly logger = new Logger(TenantConnectionInterceptor.name);

    constructor(private readonly dataSource: DataSource) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const user = req.user;

        // Determine schema name from user (AuthGuard runs before this) OR custom header
        const schemaName = user?.schemaName || req.tenantId || req.headers['x-tenant-id'];

        // If no schema context, proceed without tenant connection (public routes)
        if (!schemaName) {
            return next.handle();
        }

        return from(this.createTenantConnection(req, schemaName)).pipe(
            switchMap((queryRunner) => {
                return next.handle().pipe(
                    catchError((err) => {
                        return throwError(() => err);
                    }),
                    finalize(async () => {
                        // CRITICAL: Always release the connection when request finishes
                        if (queryRunner && !queryRunner.isReleased) {
                            await queryRunner.release();
                            // this.logger.debug(`Released connection for schema: ${schemaName}`);
                        }
                    }),
                );
            }),
        );
    }

    private async createTenantConnection(req: any, schemaName: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            await queryRunner.query(`SET search_path TO "${schemaName}", public`);

            // Attach manager to request so BaseTenantService can use it
            req.tenantManager = queryRunner.manager;

            return queryRunner;
        } catch (error) {
            // If setup fails, release immediately and throw
            await queryRunner.release();
            throw error;
        }
    }
}
