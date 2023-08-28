import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainScannerModule } from './domain-scanner/domain-scanner.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainEntity } from './domain/domain.entity';
import { DomainScansEntity } from './domain-scanner/domain-scans.entity';
import { DomainModule } from './domain/domain.module';
import config from './config/config';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    HttpModule,
    DomainScannerModule,
    DomainModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({

      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'app_schema',
      entities: [DomainEntity, DomainScansEntity],
      synchronize: false,
    }

    )
    ,
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
