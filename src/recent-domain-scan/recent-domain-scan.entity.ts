import { DomainScansEntity } from 'src/domain-scanner/domain-scans.entity';
import { DomainEntity } from 'src/domain/domain.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany, Unique, ManyToOne, UpdateDateColumn } from 'typeorm';


@Entity({ name: 'recent_domain_scan' })
export class RecentDomainScanEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn({ nullable: true })
  createdAt?: Date;

  @Column()
  data: string;

  @Column()
  source: string;

  @Column()
  domainId: number
  @ManyToOne(() => DomainEntity, (domain) => domain.id)
  domain?: DomainEntity;
}
