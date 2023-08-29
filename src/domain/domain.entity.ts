import { DomainScansEntity } from 'src/domain-scanner/domain-scans.entity';
import { RecentDomainScanEntity } from 'src/recent-domain-scan/recent-domain-scan.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany, Unique } from 'typeorm';


@Entity({ name: 'domain' })
@Unique('UQ_DOMAIN', ['domainName'])
export class DomainEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn({ nullable: true })
  createdAt?: Date;

  @Column({ name: 'domain_name' })
  domainName: string;

  @OneToMany(() => DomainScansEntity, (domainscan) => domainscan.domain)
  domainScans: DomainScansEntity[];

  @OneToMany(() => RecentDomainScanEntity, (recentdomainScan) => recentdomainScan.domain)
  recentDomainScans: RecentDomainScanEntity[];
}
