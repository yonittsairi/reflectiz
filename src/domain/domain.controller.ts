import { Body, Controller, Post } from '@nestjs/common';
import { DomainEntity } from './domain.entity';
import { DomainService } from './domain.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDomainDto } from './dto/create-domain.dto';
@Controller('domain')
export class DomainController {
    constructor(
        @InjectRepository(DomainEntity)
        public repository: Repository<DomainEntity>,
        public domainService: DomainService,
    ) {
    }

    @Post()
    create(@Body() createDomainDto: CreateDomainDto) {
        return this.domainService.create(createDomainDto);
    }


}
