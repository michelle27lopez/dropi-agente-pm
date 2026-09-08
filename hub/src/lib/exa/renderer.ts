import fs from "fs";
import path from "path";
import { CompositeManifest, QualityStatus, ConfidenceLevel } from "./types";

const RESEARCH_BRAIN_DIR = path.resolve(process.cwd(), "../research-brain");
const DRAFTS_DIR = path.join(RESEARCH_BRAIN_DIR, "drafts");

export function renderCompositeMarkdown(manifest: CompositeManifest, qualityStatus: QualityStatus, confidence: ConfidenceLevel) {
  const mdPath = path.join(DRAFTS_DIR, `${manifest.research_id}.md`);
  
  let markdown = `---
id: ${manifest.research_id}
status: ${manifest.status}
quality_status: ${qualityStatus}
pm_review_status: pending
confidence: ${confidence}
cost_usd: ${manifest.actual_cost_usd}
created_at: ${new Date().toISOString()}
---

# Benchmark Competitivo Compuesto

## 📊 Cobertura
- Competidores evaluados: ${manifest.plan.competitors.join(", ")}
- Calidad de ejecución: ${qualityStatus.toUpperCase()}

## 📈 Tabla Comparativa (Síntesis)
| Competidor | Cobertura | Integraciones Clave | Fricciones / Errores | Model Comercial |
|------------|-----------|---------------------|----------------------|-----------------|
`;

  // Process subruns
  const officialRuns = manifest.subruns.filter(s => s.scope === 'official' && s.data);
  const externalRun = manifest.subruns.find(s => s.scope === 'external' && s.data);

  officialRuns.forEach(run => {
    const data = run.data;
    markdown += `| **${data.competitor}** | ${data.coverage_status} | ${data.channel_integrations?.join(", ") || "-"} | ${data.failure_and_errors?.join(", ") || "-"} | ${data.commercial_model?.join(", ") || "-"} |\n`;
  });

  markdown += `\n## 📚 Evidencia por Competidor\n\n`;

  officialRuns.forEach(run => {
    const data = run.data;
    markdown += `### ${data.competitor}\n`;
    markdown += `- **Integraciones:** ${data.channel_integrations?.join(", ") || "No evidence found"}\n`;
    markdown += `- **Autorización y Sync:** ${data.authorization_and_sync?.join(", ") || "No evidence found"}\n`;
    markdown += `- **Experiencia del Seller:** ${data.seller_experience?.join(", ") || "No evidence found"}\n`;
    markdown += `- **Logística y COD:** ${data.cod_and_logistics?.join(", ") || "No evidence found"}\n\n`;
  });

  markdown += `\n## ⚠️ Fricciones Externas Reportadas\n\n`;
  if (externalRun?.data?.evidence_gaps) {
    markdown += externalRun.data.evidence_gaps.join("\n- ");
  } else {
    markdown += "No se extrajo información de fricciones externas.\n";
  }

  markdown += `\n## 🔗 Fuentes y Trazabilidad (Claims)\n`;
  officialRuns.forEach(run => {
    if (run.data?.sources) {
      markdown += `\n**${run.data.competitor}**:\n`;
      run.data.sources.forEach((src: any, i: number) => {
        markdown += `${i + 1}. [${src.title || src.url}](${src.url}) - *${src.type}*\n`;
      });
    }
  });

  fs.writeFileSync(mdPath, markdown);
  console.log(`✅ Markdown renderizado y guardado en: ${mdPath}`);
}
