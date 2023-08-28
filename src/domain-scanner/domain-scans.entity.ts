import { Entity, Column, ManyToOne, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { DomainEntity } from 'src/domain/domain.entity';

@Entity({ name: 'domain_scans' })
export class DomainScansEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn({ nullable: true })
  createdAt?: Date;
  @Column()
  timestamp?: string;

  @Column()
  data: string;

  @Column()
  source: string;

  @Column()
  domainId: number
  @ManyToOne(() => DomainEntity, (domain) => domain.id)
  domain?: DomainEntity;
}
