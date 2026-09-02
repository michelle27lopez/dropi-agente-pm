import Exa from "exa-js";
import dotenv from "dotenv";
import path from "path";

// Cargar variables de entorno del hub (buscando hacia arriba si se corre desde otro lado)
dotenv.config({ path: path.resolve(__dirname, "../../../../../.env.local") }); 
// Dependiendo desde donde se corra el CLI, la ruta al env.local puede variar, mejor:
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

let exaInstance: Exa | null = null;

export function getExaClient(): Exa {
  if (!exaInstance) {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
      throw new Error("EXA_API_KEY is not configured en .env.local.");
    }
    exaInstance = new Exa(apiKey);
  }
  return exaInstance;
}
