-- Ejecutar este script en el SQL Editor de tu proyecto Supabase (J-Commander)

CREATE TABLE IF NOT EXISTS public.lab_simulation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    variant_name TEXT NOT NULL,
    total_users_started INTEGER NOT NULL,
    step_bodega_started INTEGER NOT NULL,
    step_bodega_completed INTEGER NOT NULL,
    step_product_started INTEGER NOT NULL,
    step_product_completed INTEGER NOT NULL,
    engine TEXT NOT NULL
);

-- Configurar RLS (Row Level Security) para permitir inserts
ALTER TABLE public.lab_simulation_runs ENABLE ROW LEVEL SECURITY;

-- Permitir inserciones anónimas (ya que el lab corre en cliente/servidor sin auth por ahora)
CREATE POLICY "Allow anonymous inserts" 
ON public.lab_simulation_runs
FOR INSERT 
TO anon
WITH CHECK (true);

-- Permitir lectura anónima (para dibujar el funnel)
CREATE POLICY "Allow anonymous select" 
ON public.lab_simulation_runs
FOR SELECT 
TO anon
USING (true);
