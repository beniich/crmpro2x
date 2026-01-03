import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ProductsService {
    constructor(private db: DatabaseService) { }

    async findAll() {
        const conn = await this.db.getConnection();
        const products = await conn.products?.find() || [];
        return products.length > 0 ? products : [
            { id: '1', name: 'Stéthoscope Littmann', price: 95.00, stock: 12 },
            { id: '2', name: 'Gants d\'examen (100pcs)', price: 15.00, stock: 50 },
            { id: '3', name: 'Thermomètre Infrarouge', price: 45.00, stock: 8 },
        ];
    }
}
