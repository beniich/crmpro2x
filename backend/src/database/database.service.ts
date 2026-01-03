import { Injectable } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MockDbService } from './mock-db.service';

@Injectable()
export class DatabaseService {
    private activeConnection: any;

    constructor(
        private mongo: MongoService,
        private mock: MockDbService,
    ) { }

    async getConnection() {
        if (this.activeConnection) return this.activeConnection;

        try {
            await this.mongo.connect(2000);
            console.log('✅ MongoDB connected');
            this.activeConnection = this.mongo;
        } catch (error) {
            console.warn('⚠️ FALLING BACK TO MOCK DATABASE MODE (Missing MongoDB local instance)');
            this.mock.seed();
            this.activeConnection = this.mock;
        }
        return this.activeConnection;
    }
}
