import { Injectable } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainEntity } from './domain.entity';
import { MessageDto } from 'src/generalDto/messageDto';
import { CreateDomainDto } from './dto/create-domain.dto ';
@Injectable()
export class DomainService {


  @InjectRepository(DomainEntity)
  public repository: Repository<DomainEntity>;

  async getDomains(startId: number, limit: number): Promise<DomainEntity[]> {
    return await this.repository.find({ where: { id: MoreThan(startId) }, take: limit })
  }

  getDomainInfo(name: any): Promise<DomainEntity | MessageDto> {
    return new Promise((resolve, reject) => {
      this.repository.findOne({ where: { domainName: name }, relations: ['recentDomainScans'] })
        .then(data => {
          if (!data) {
            this.repository.insert({ domainName: name })
              .then((res) => {
                return resolve({ message: `no data exist on domain ${name} please try again later` })
              }

              )
          } else {
            return resolve(data)
          }
        }).catch((res) => {
          reject(res)
        })



    })
  }
  create(createDomainDto: CreateDomainDto): Promise<DomainEntity | string> {
    return new Promise<DomainEntity | string>((resolve, reject) => {
      if (!this.isValidDomain(createDomainDto?.domainName)) {
        reject('Invalid Domain name')
      }
      resolve(this.repository.save(createDomainDto).then(x => x).catch(x => x))
    })

  }
  isValidDomain(domain: string): boolean {
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }


}
