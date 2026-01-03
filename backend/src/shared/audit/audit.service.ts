import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
    log(action: string, userId: string, entity: string) {
        const timestamp = new Date().toISOString();
        console.log(`[AUDIT] ${timestamp} - ${action} by user ${userId} on ${entity}`);
        // In production, this would write to a secure database/file
    }
}
