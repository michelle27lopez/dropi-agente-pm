// Persistencia local de proyectos Gali (localStorage). Compartido entre el wizard (v5/page.tsx)
// y la vista de listado (proyectos/page.tsx) para no duplicar el modelo de datos.

const STORAGE_KEY = 'gali_local_projects';

export interface GaliProject {
  id: string;
  nombre: string;
  estado: string;
  step_actual: string;
  producto_id?: string;
  producto_nombre?: string;
  costo_base?: number;
  precio_venta?: number;
  presupuesto_diario?: number;
  landing_titulo?: string;
  landing_subtitulo?: string;
  creative_script?: string;
  agentes?: {
    roax?: boolean;
    vigilante?: boolean;
    ada?: boolean;
    chatea?: boolean;
  };
}

export function getLocalProjects(): GaliProject[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getLocalProject(id: string): GaliProject | undefined {
  return getLocalProjects().find(p => p.id === id);
}

export function saveLocalProject(project: GaliProject): void {
  const projects = getLocalProjects();
  const index = projects.findIndex(p => p.id === project.id);
  if (index !== -1) {
    projects[index] = project;
  } else {
    projects.unshift(project);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
