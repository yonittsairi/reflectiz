import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainScansModule } from './domain-scanner/domain-scanner.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainEntity } from './domain/domain.entity';
import { DomainScansEntity } from './domain-scanner/domain-scans.entity';
import { DomainModule } from './domain/domain.module';
import { HttpModule } from '@nestjs/axios';
import { RecentDomainScanModule } from './recent-domain-scan/recent-domain-scan.module';
import { RecentDomainScanEntity } from './recent-domain-scan/recent-domain-scan.entity';
import { typeOrmConfigAsync } from './config/typeOrm.config';
import config from './config/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    HttpModule,
    DomainScansModule,
    DomainModule,
    RecentDomainScanModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    RecentDomainScanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
