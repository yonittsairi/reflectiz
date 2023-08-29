import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { DomainEntity } from './domain.entity';
import { DomainService } from './domain.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDomainDto } from './dto/create-domain.dto';
import { ParsedRequest, CrudRequest } from '@nestjsx/crud';
@Controller('domain')
export class DomainController {
    constructor(
        @InjectRepository(DomainEntity)
        public repository: Repository<DomainEntity>,
        public domainService: DomainService,
    ) {
    }

    @Get('/getDomainInfo')
    findOne(@Query() param: any) {
        if (!param?.name) {
            return { message: `please enter a domain name` }
        } else {
            return this.domainService.getDomainInfo(param.name)
        }
        ;
    }

    @Post()
    create(@Body() createDomainDto: CreateDomainDto) {
        return this.domainService.create(createDomainDto)
            .catch(res => {
                throw new BadRequestException(res)
            });
    }


}
