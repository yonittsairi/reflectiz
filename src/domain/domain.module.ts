import { Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainEntity } from './domain.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [DomainService],
  imports: [TypeOrmModule.forFeature([DomainEntity])],
  exports: [DomainService],
  controllers: [],
})
export class DomainModule {}
