import { Module } from '@nestjs/common';
import { RecentDomainScanService } from './recent-domain-scan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecentDomainScanEntity } from './recent-domain-scan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecentDomainScanEntity])],
  providers: [RecentDomainScanService],
  exports: [RecentDomainScanService]
})
export class RecentDomainScanModule { }
