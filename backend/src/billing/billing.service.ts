import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuditService } from '../shared/audit/audit.service';

@Injectable()
export class BillingService {
    constructor(
        private db: DatabaseService,
        private audit: AuditService,
    ) { }

    async findAll() {
        const conn = await this.db.getConnection();
        // Simplified: Return mock data if collection empty
        const bills = await conn.billing?.find() || [];
        return bills.length > 0 ? bills : [
            { id: '1', patientId: '1', amount: 150.00, status: 'Payé', date: '2023-12-10' },
            { id: '2', patientId: '2', amount: 250.00, status: 'En attente', date: '2023-12-15' },
        ];
    }

    async create(data: any) {
        const conn = await this.db.getConnection();
        const bill = await conn.billing.insert(data);
        this.audit.log('CREATE_INVOICE', 'SYSTEM', bill.id);
        return bill;
    }
}
