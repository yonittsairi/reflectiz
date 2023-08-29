import { Module } from '@nestjs/common';
import { DomainScansService } from './domain-scanner.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainScansEntity } from './domain-scans.entity'
import { DomainModule } from 'src/domain/domain.module';
import { RecentDomainScanModule } from 'src/recent-domain-scan/recent-domain-scan.module';

@Module({
  providers: [DomainScansService],
  imports: [TypeOrmModule.forFeature([DomainScansEntity]), HttpModule, ConfigModule, DomainModule, RecentDomainScanModule],
})
export class DomainScansModule { }
