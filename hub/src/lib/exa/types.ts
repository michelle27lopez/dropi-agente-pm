export type ResearchType = 'competitive_benchmark' | 'market_research' | 'customer_problem' | 'technology_trend';
export type ResearchEffort = 'low' | 'medium' | 'high';
export type ResearchStatus = 'draft' | 'running' | 'generated' | 'incomplete' | 'failed' | 'reviewed' | 'archived' | 'published';
export type PMReviewStatus = 'pending' | 'approved' | 'changes_requested' | 'rejected';
export type QualityStatus = 'pending' | 'passed' | 'failed';
export type ConfidenceLevel = 'pending' | 'low' | 'medium' | 'high';

export interface DiscoveryResearch {
  id: string;
  owner: string;
  query: string;
  research_type: ResearchType;
  effort: ResearchEffort;
  exa_run_id: string | null;
  status: ResearchStatus;
  quality_status: QualityStatus;
  pm_review_status: PMReviewStatus;
  confidence: ConfidenceLevel;
  cost_usd: number;
  created_at: string;
  completed_at: string | null;
}

export interface SubRun {
  competitor?: string;
  scope: 'official' | 'external';
  status: 'pending' | 'running' | 'completed' | 'failed';
  request_id?: string;
  cost_usd: number;
  error?: string;
  data?: any;
}

export interface CompositeManifest {
  research_id: string;
  status: ResearchStatus;
  plan: {
    competitors: string[];
    official_domains: Record<string, string[]>;
  };
  subruns: SubRun[];
  estimated_cost_usd: number;
  actual_cost_usd: number;
  quality_gate_results?: any;
}
