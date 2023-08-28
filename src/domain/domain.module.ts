import { Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainEntity } from './domain.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainController } from './domain.controller';

@Module({
  providers: [DomainService],
  imports: [TypeOrmModule.forFeature([DomainEntity])],
  exports: [DomainService],
  controllers: [DomainController],
})
export class DomainModule {}
