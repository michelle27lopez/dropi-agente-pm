import fs from "fs";
import path from "path";
import { CompositeManifest, SubRun, ResearchStatus, QualityStatus, ConfidenceLevel } from "./types";
import { renderCompositeMarkdown } from "./renderer";

const RESEARCH_BRAIN_DIR = path.resolve(process.cwd(), "../research-brain");
const RUNS_DIR = path.join(RESEARCH_BRAIN_DIR, ".runs");
const DRAFTS_DIR = path.join(RESEARCH_BRAIN_DIR, "drafts");

function ensureDirectories() {
  if (!fs.existsSync(RUNS_DIR)) fs.mkdirSync(RUNS_DIR, { recursive: true });
  if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });
}

export function createCompositePlan(competitors: string[], officialDomains: Record<string, string[]>): CompositeManifest {
  ensureDirectories();
  const id = `res_${Date.now()}`;
  
  const manifest: CompositeManifest = {
    research_id: id,
    status: 'draft',
    plan: {
      competitors,
      official_domains: officialDomains
    },
    subruns: [],
    estimated_cost_usd: (competitors.length + 1) * 0.05, // 1 per competitor + 1 external
    actual_cost_usd: 0
  };

  // Official runs
  competitors.forEach(comp => {
    manifest.subruns.push({
      competitor: comp,
      scope: 'official',
      status: 'pending',
      cost_usd: 0
    });
  });

  // External comparative run
  manifest.subruns.push({
    scope: 'external',
    status: 'pending',
    cost_usd: 0
  });

  saveManifest(id, manifest);
  return manifest;
}

export function getManifest(id: string): CompositeManifest {
  const manifestPath = path.join(RUNS_DIR, `${id}.json`);
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest ${id} no encontrado.`);
  }
  return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
}

export function saveManifest(id: string, manifest: CompositeManifest) {
  const manifestPath = path.join(RUNS_DIR, `${id}.json`);
  const tempPath = path.join(RUNS_DIR, `${id}.tmp.json`);
  fs.writeFileSync(tempPath, JSON.stringify(manifest, null, 2));
  fs.renameSync(tempPath, manifestPath); // Atomic write
}

export async function runCompositeResearch(id: string, query: string, exaSearchFn: (query: string, options: any) => Promise<any>) {
  const manifest = getManifest(id);
  if (manifest.status === 'generated' || manifest.status === 'published' || manifest.status === 'reviewed') {
    throw new Error(`El benchmark ya está en estado ${manifest.status}. No se consumirán créditos.`);
  }

  manifest.status = 'running';
  saveManifest(id, manifest);

  try {
    for (const subrun of manifest.subruns) {
      if (subrun.status === 'completed') continue; // Idempotency
      
      subrun.status = 'running';
      saveManifest(id, manifest);

      const options: any = { type: "deep" };
      if (subrun.scope === 'official' && subrun.competitor) {
        options.includeDomains = manifest.plan.official_domains[subrun.competitor] || [];
      } else {
        // External
        const allOfficial = Object.values(manifest.plan.official_domains).flat();
        options.excludeDomains = allOfficial;
      }

      // Execute search
      const result = await exaSearchFn(`${query} (Competitor: ${subrun.competitor || 'Market'})`, options);
      
      subrun.status = 'completed';
      subrun.cost_usd = 0.05; // Mocked cost
      subrun.data = result;
      manifest.actual_cost_usd += subrun.cost_usd;
      saveManifest(id, manifest);
    }

    // Quality Gates
    const qualityResults = evaluateQualityGates(manifest);
    manifest.quality_gate_results = qualityResults;

    let qualityStatus: QualityStatus = 'passed';
    let finalStatus: ResearchStatus = 'generated';
    let confidence: ConfidenceLevel = 'high';

    if (!qualityResults.all_competitors_covered || !qualityResults.sufficient_official_sources) {
      qualityStatus = 'failed';
      finalStatus = 'incomplete';
      confidence = 'low';
    }

    manifest.status = finalStatus;
    saveManifest(id, manifest);

    // Render Markdown
    renderCompositeMarkdown(manifest, qualityStatus, confidence);

  } catch (error: any) {
    manifest.status = 'failed';
    saveManifest(id, manifest);
    throw error;
  }
}

function evaluateQualityGates(manifest: CompositeManifest) {
  const required = manifest.plan.competitors;
  const covered = manifest.subruns.filter(s => s.scope === 'official' && s.status === 'completed' && s.data?.competitor).map(s => s.competitor);
  
  const allCovered = required.every(r => covered.includes(r));
  const sufficientSources = manifest.subruns.every(s => (s.data?.sources?.length || 0) >= (s.scope === 'official' ? 2 : 1));

  return {
    all_competitors_covered: allCovered,
    sufficient_official_sources: sufficientSources,
    urls_valid: true // Mocked
  };
}
