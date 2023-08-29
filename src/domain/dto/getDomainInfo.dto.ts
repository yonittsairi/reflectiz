import { RecentDomainScanEntity } from "src/recent-domain-scan/recent-domain-scan.entity";

export class GetDomainInfo {

    id: number;
    createdAt: Date;
    domainName: string;
    recentDomainScans: RecentDomainScanEntity[]
}
