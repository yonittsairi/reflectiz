import { Injectable, Inject, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainScansEntity } from './domain-scans.entity';
import { DomainService } from 'src/domain/domain.service';
import { HttpService } from '@nestjs/axios/dist';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { DomainEntity } from 'src/domain/domain.entity';
import { firstValueFrom } from 'rxjs';
import { RecentDomainScanService } from 'src/recent-domain-scan/recent-domain-scan.service';


@Injectable()
export class DomainScansService {
  private readonly logger = new Logger(DomainScansService.name);

  private apiKeyVirusTotal
  private urlVirusTotal
  private apiKeyWHOIS
  private urlWHOIS
  constructor(
    @InjectRepository(DomainScansEntity)
    public repository: Repository<DomainScansEntity>,
    @Inject(DomainService)
    private domainService: DomainService,
    @Inject(RecentDomainScanService)
    private recentDomainScanService: RecentDomainScanService,
    private configService: ConfigService,
    private readonly httpService: HttpService,


  ) {
    this.apiKeyVirusTotal = this.configService.get('virustotalAPIKEY');
    this.urlVirusTotal = this.configService.get('virustotalURL');
    this.apiKeyWHOIS = this.configService.get('whoIsAPIKEY');
    this.urlWHOIS = this.configService.get('whoIsURL');
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM, { name: 'domainScanCron' })
  watch() {
    const startId = 1;
    this.scanDomains(startId);
  }

  async callVirusTotal(domainName: string) {
    const req = this.httpService
      .get(this.urlVirusTotal + domainName, {
        headers: {
          accept: 'application/json',
          'x-apikey': this.apiKeyVirusTotal,
        },
      })

    const data = (await firstValueFrom(req).then((data) => (data.data)).catch((e) =>
      this.logger.error('callVirusTotal' + JSON.stringify(e))
    ))
    return data
  }

  async callWHOIS(domainName) {
    const req = this.httpService
      .get(`${this.urlWHOIS}apiKey=${this.apiKeyWHOIS}&domainName=${domainName}&outputFormat=JSON`, {
        headers: { accept: 'application/json' },
      })
      ;
    return await firstValueFrom(req).then((data) => data.data).catch((e) =>
      this.logger.error('callVirusTotal' + JSON.stringify(e)))
  }

  async scanDomains(startId: number) {
    if (!startId) {
      return;
    }
    let limit = 50;
    const domains: DomainEntity[] = await this.domainService.getDomains(startId, limit);

    if (domains.length !== 0) {
      startId = domains[domains.length - 1].id;
      this.retrieveDomainData(domains);
      this.scanDomains(startId);
    }
  }

  async retrieveDomainData(domains) {
    for (const domain of domains) {
      const { domainName, id } = domain
      this.callVirusTotal(domainName).then((data) =>

        this.saveDomainData(id, data?.data?.attributes?.last_analysis_stats, 'virusTotal'))

      this.callWHOIS(domainName).then((data) =>
        this.saveDomainData(id, data?.WhoisRecord?.strippedText, 'whoIs'))


    }
  }



  saveDomainData(id: number, text: any, source: string) {
    if (!text) {
      return
    }
    const entity: DomainScansEntity = { data: JSON.stringify(text), domainId: id, source }
    this.repository.insert(entity).then(() => {
      this.recentDomainScanService.saveRecentDomainInfo(entity)
    })
      .catch((e) => {
        this.logger.error(e)
      })
  }
}

