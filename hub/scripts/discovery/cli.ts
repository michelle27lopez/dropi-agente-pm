import { Command } from "commander";
import { createCompositePlan, runCompositeResearch, getManifest } from "../../src/lib/exa/research-engine";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env.local" });
dotenv.config({ path: ".env.local" }); // En caso de que se corra desde ./hub

const program = new Command();

program
  .name("discovery-cli")
  .description("CLI para ejecución de Research as Code")
  .version("0.2.0");

program
  .command("composite")
  .description("Crea un benchmark compuesto de múltiples competidores")
  .requiredOption("-c, --competitors <string>", "Competidores separados por coma (ej. Dropi,Rocketfy,AutoDS)")
  .requiredOption("-q, --query <string>", "Consulta general del research")
  .action(async (options) => {
    try {
      const competitorsList = options.competitors.split(",").map((c: string) => c.trim());
      
      // Default mock official domains
      const officialDomains: Record<string, string[]> = {
        "Dropi": ["dropi.co", "academy.dropi.co"],
        "Rocketfy": ["rocketfy.co", "help.rocketfy.co"],
        "AutoDS": ["autods.com", "help.autods.com"],
        "Shopify": ["shopify.com", "help.shopify.com"],
        "Tiendanube": ["tiendanube.com", "tiendanube.com/mx"]
      };

      const manifest = createCompositePlan(competitorsList, officialDomains);
      console.log(`📋 Plan creado: ${manifest.research_id}`);
      console.log(`- Competidores: ${competitorsList.length}`);
      console.log(`- Runs previstos: ${manifest.subruns.length}`);
      console.log(`- Costo máximo estimado: USD $${manifest.estimated_cost_usd}`);
      console.log(`\nPara ejecutar, corre: npm run research:test -- resume -i ${manifest.research_id} -q "${options.query}"`);
    } catch (err: any) {
      console.error(`❌ Error: ${err.message}`);
    }
  });

program
  .command("resume")
  .description("Reanuda o ejecuta un plan de benchmark compuesto")
  .requiredOption("-i, --id <string>", "ID del research manifest (ej. res_123456)")
  .requiredOption("-q, --query <string>", "Consulta general")
  .action(async (options) => {
    try {
      const realExaSearch = async (query: string, opts: any) => {
        const { ExaCompetitorSchema } = require("../../src/lib/exa/schemas");
        
        const payload: any = {
          query,
          type: "deep",
          contents: { highlights: true },
          outputSchema: ExaCompetitorSchema
        };
        
        if (opts.includeDomains && opts.includeDomains.length > 0) payload.includeDomains = opts.includeDomains;
        if (opts.excludeDomains && opts.excludeDomains.length > 0) payload.excludeDomains = opts.excludeDomains;
        
        const response = await fetch("https://api.exa.ai/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.EXA_API_KEY!
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Exa API Error: ${response.status} ${errText}`);
        }
        
        const json = await response.json();
        
        let structuredData = json.output?.content || json;
        // Inject grounding/results as sources
        if (typeof structuredData === "object" && structuredData !== null) {
          structuredData.sources = json.results || [];
        }
        
        return structuredData;
      };

      await runCompositeResearch(options.id, options.query, realExaSearch);
      console.log("✅ Pipeline de orquestación completado (Real API).");
    } catch (err: any) {
      console.error(`❌ Error en ejecución: ${err.message}`);
    }
  });

program.parse();
