import { Injectable, Inject, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainScansEntity } from './domain-scans.entity';
import { DomainService } from 'src/domain/domain.service';
import { HttpService } from '@nestjs/axios/dist';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { DomainEntity } from 'src/domain/domain.entity';
import { firstValueFrom } from 'rxjs';
import { RecentDomainScanService } from 'src/recent-domain-scan/recent-domain-scan.service';
import { CronJob } from 'cron';

@Injectable()
export class DomainScansService {
  private readonly logger = new Logger(DomainScansService.name);

  private apiKeyVirusTotal: string
  private urlVirusTotal: string
  private apiKeyWHOIS: string
  private urlWHOIS: string
  private cronExpression: "0 0 1 * *";
  constructor(
    @InjectRepository(DomainScansEntity)
    public repository: Repository<DomainScansEntity>,
    @Inject(DomainService)
    private domainService: DomainService,
    @Inject(RecentDomainScanService)
    private recentDomainScanService: RecentDomainScanService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry


  ) {
    this.apiKeyVirusTotal = this.configService.get('virustotalAPIKEY');
    this.urlVirusTotal = this.configService.get('virustotalURL');
    this.apiKeyWHOIS = this.configService.get('whoIsAPIKEY');
    this.urlWHOIS = this.configService.get('whoIsURL');
    this.cronExpression = this.configService.get('cronExpression', "0 0 1 * *")

  }

  onModuleInit() {
    const job = new CronJob(this.cronExpression, () => {

      const startId = 1;
      this.scanDomains(startId);

    });

    this.schedulerRegistry.addCronJob('scan', job);
    job.start();
  }



  async callVirusTotal(domainName: string): Promise<any> {
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

  async callWHOIS(domainName): Promise<any> {
    const req = this.httpService
      .get(`${this.urlWHOIS}apiKey=${this.apiKeyWHOIS}&domainName=${domainName}&outputFormat=JSON`, {
        headers: { accept: 'application/json' },
      })
      ;
    return await firstValueFrom(req).then((data) => data.data).catch((e) =>
      this.logger.error('callWHOIS' + JSON.stringify(e)))
  }

  async scanDomains(startId: number): Promise<void> {
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
    domains.map(({ domainName, id }) => {
      this.callVirusTotal(domainName).then((data) =>

        this.saveDomainData(id, data?.data?.attributes?.last_analysis_stats, 'virusTotal'))

      this.callWHOIS(domainName).then((data) =>
        this.saveDomainData(id, data?.WhoisRecord?.strippedText, 'whoIs'))


    })

  }



  saveDomainData(id: number, text: any, source: string): void {
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

