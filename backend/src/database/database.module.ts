import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongoService } from './mongo.service';
import { MockDbService } from './mock-db.service';

@Global()
@Module({
    providers: [DatabaseService, MongoService, MockDbService],
    exports: [DatabaseService, MockDbService],
})
export class DatabaseModule { }
