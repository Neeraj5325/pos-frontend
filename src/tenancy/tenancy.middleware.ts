import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.headers['x-tenant-id'] as string;
        if (!tenantId && req.url !== '/tenants/register') {
            // Allow registration without tenant ID, but other routes might need it
            // For now, just pass through if not provided, we can handle it in guards
        }
        (req as any).tenantId = tenantId;
        next();
    }
}
