import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class MongoService {
    private client: typeof mongoose;

    async connect(timeout: number) {
        // Note: In a real app, this would use a config service
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/doctic';

        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error('Connection timeout'));
            }, timeout);

            mongoose.connect(uri)
                .then((client) => {
                    clearTimeout(timer);
                    this.client = client;
                    resolve(client);
                })
                .catch((err) => {
                    clearTimeout(timer);
                    reject(err);
                });
        });
    }

    get patients() {
        return {
            find: async () => [], // Simplified for now
            insert: async (data: any) => data,
        };
    }
}
