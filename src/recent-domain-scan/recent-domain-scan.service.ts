import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainScansEntity } from 'src/domain-scanner/domain-scans.entity';
import { Repository } from 'typeorm';
import { RecentDomainScanEntity } from './recent-domain-scan.entity';

@Injectable()
export class RecentDomainScanService {
    private readonly logger = new Logger(RecentDomainScanService.name);

    @InjectRepository(RecentDomainScanEntity)
    public repository: Repository<RecentDomainScanEntity>

    saveRecentDomainInfo(newEntity): void {
        const { domainId, data, source } = newEntity
        if (!data) {
            return
        }
        const entity = { data: JSON.stringify(data), domainId, source }
        this.repository.findOne({ where: { source, domainId } }).then(
            (res) => {
                if (!res) {
                    this.repository.insert(entity)
                        .catch((e) => {
                            this.logger.error(e)
                        })
                } else {
                    this.repository.update({ id: res.id }, { ...entity, updatedAt: new Date() })
                        .catch((e) => {
                            this.logger.error(e)
                        })


                }
            }

        )

    }

}

