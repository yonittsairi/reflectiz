import { DomainScansEntity } from 'src/domain-scanner/domain-scans.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany } from 'typeorm';


@Entity({ name: 'domain' })
export class DomainEntity  {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn({ nullable: true })
  createdAt?: Date;
  @Column({ name: 'domain_name' })
  domainName: string;

  @OneToMany(() => DomainScansEntity, (domainscan) => domainscan.domain)
  domainScans: DomainScansEntity[];
}
