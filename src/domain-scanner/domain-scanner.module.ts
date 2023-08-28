import { Module } from '@nestjs/common';
import { DomainScannerService } from './domain-scanner.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainScansEntity } from './domain-scans.entity'
import { DomainModule } from 'src/domain/domain.module';

@Module({
  providers: [DomainScannerService],
  imports: [TypeOrmModule.forFeature([DomainScansEntity]), HttpModule, ConfigModule, DomainModule],
})
export class DomainScannerModule { }
