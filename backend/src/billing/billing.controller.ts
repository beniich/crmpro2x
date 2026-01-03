import { Controller, Get, Post, Body } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    @Get()
    findAll() {
        return this.billingService.findAll();
    }

    @Post()
    create(@Body() data: any) {
        return this.billingService.create(data);
    }
}
