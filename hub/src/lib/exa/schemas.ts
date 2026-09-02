// Límite de Exa: Max Depth 2, Max Props 10
export const ExaCompetitorSchema = {
  type: "object",
  properties: {
    competitor: { type: "string" },
    coverage_status: { type: "string", enum: ["complete", "partial", "insufficient"] },
    channel_integrations: { type: "array", items: { type: "string" } },
    authorization_and_sync: { type: "array", items: { type: "string" } },
    failure_and_errors: { type: "array", items: { type: "string" } },
    seller_experience: { type: "array", items: { type: "string" } },
    commercial_model: { type: "array", items: { type: "string" } },
    cod_and_logistics: { type: "array", items: { type: "string" } },
    evidence_gaps: { type: "array", items: { type: "string" } }
  },
  required: ["competitor", "coverage_status"]
};

// Schema final compuesto para el renderer (fuera del motor de Exa)
export const CompositeBenchmarkResult = {
  type: "object",
  properties: {
    id: { type: "string" },
    competitors: {
      type: "array",
      items: ExaCompetitorSchema
    },
    external_frictions: { type: "array", items: { type: "string" } },
    claims: {
      type: "array",
      items: {
        type: "object",
        properties: {
          claim_id: { type: "string" },
          claim: { type: "string" },
          source_ids: { type: "array", items: { type: "string" } },
          evidence_excerpt: { type: "string" },
          source_type: { type: "string", enum: ["official", "external"] }
        }
      }
    }
  }
};
