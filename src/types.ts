export interface ApiEnvelope {
  apiVersion?: string;
  methodologyVersion?: string;
  updatedAt?: string;
}

export interface RankingCatalogEntry {
  id: string;
  rankingName: string;
  rankingType: 'derived' | 'dimension' | 'benchmark';
  dimension: string | null;
  direction: 'higher_is_better' | 'lower_is_better';
  modelCount: number;
  url: string;
}

export interface RankingsResponse extends ApiEnvelope {
  rankings: RankingCatalogEntry[];
}

export interface RankingDetail extends ApiEnvelope {
  id: string;
  rankingName: string;
  rankingType: 'derived' | 'dimension' | 'benchmark';
  direction: 'higher_is_better' | 'lower_is_better';
  models: unknown[];
}

export interface DomainSummary {
  id: string;
  name: string;
  benchmarkCount: number;
  updatedAt: string;
  url: string;
}

export interface DomainsResponse extends ApiEnvelope {
  domains: DomainSummary[];
}

export interface DomainResultRow {
  model: string;
  harness: string | null;
  score: number;
  modelUrl: string | null;
}

export interface DomainBenchmark {
  id: string;
  name: string;
  description: string;
  direction: 'higher_is_better' | 'lower_is_better';
  unit: string | null;
  source: { name: string; url: string };
  results: DomainResultRow[];
}

export interface DomainCompositeEntry {
  model: string;
  compositeIQ: number;
  benchmarksCovered: number;
  benchmarksTotal: number;
  modelUrl: string | null;
}

export interface DomainDetail extends ApiEnvelope {
  id: string;
  name: string;
  url: string;
  models: DomainCompositeEntry[];
  benchmarks: DomainBenchmark[];
}
