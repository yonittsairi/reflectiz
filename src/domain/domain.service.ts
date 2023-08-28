import { Injectable, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { MoreThan, Repository, getConnection } from 'typeorm';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainEntity } from './domain.entity';
@Injectable()
export class DomainService {

  @InjectRepository(DomainEntity)
  public repository: Repository<DomainEntity>;

  async getDomains(startId: number, limit: number): Promise<DomainEntity[]> {
    return await this.repository.find({ where: { id: MoreThan(startId) }, take: limit })
  }


}
