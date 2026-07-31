-- Migration to support E2E project documentation guidelines

-- 1. Add requires_e2e_format to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS requires_e2e_format boolean DEFAULT false;

-- 2. Modify constraint on draft_insights.draft_type
ALTER TABLE draft_insights DROP CONSTRAINT IF EXISTS draft_insights_draft_type_check;
ALTER TABLE draft_insights ADD CONSTRAINT draft_insights_draft_type_check CHECK (
  draft_type IN ('Business Context','ASIS','TOBE','Capability','Feature','User Story','Risk','Decision','Summary','Open Question','HU','Epica','E2E Kick-off','E2E Discovery','E2E Definición','E2E Following','E2E Hand-off')
);

-- 3. Modify constraint on approved_context.context_type
ALTER TABLE approved_context DROP CONSTRAINT IF EXISTS approved_context_context_type_check;
ALTER TABLE approved_context ADD CONSTRAINT approved_context_context_type_check CHECK (
  context_type IN ('Business Context','ASIS','TOBE','Capability','Feature','User Story','Risk','Decision','Operating Rule','HU','Epica','Definition','Open Question','Summary','E2E Kick-off','E2E Discovery','E2E Definición','E2E Following','E2E Hand-off')
);

-- 4. Modify risks table to support 1-5 scale and extra fields
-- Drop existing check constraints if any
ALTER TABLE risks DROP CONSTRAINT IF EXISTS risks_impact_check;
ALTER TABLE risks DROP CONSTRAINT IF EXISTS risks_probability_check;

-- Add new columns if they do not exist
ALTER TABLE risks ADD COLUMN IF NOT EXISTS risk_zone text CHECK (risk_zone IN ('Verde', 'Amarilla', 'Roja'));
ALTER TABLE risks ADD COLUMN IF NOT EXISTS owner text;

-- Convert text columns to integers with a default mapping:
-- 'High' -> 4, 'Medium' -> 3, 'Low' -> 2, others -> 1
ALTER TABLE risks 
  ALTER COLUMN impact TYPE integer USING (
    CASE 
      WHEN impact = 'High' THEN 4
      WHEN impact = 'Medium' THEN 3
      WHEN impact = 'Low' THEN 2
      ELSE 1
    END
  );

ALTER TABLE risks 
  ALTER COLUMN probability TYPE integer USING (
    CASE 
      WHEN probability = 'High' THEN 4
      WHEN probability = 'Medium' THEN 3
      WHEN probability = 'Low' THEN 2
      ELSE 1
    END
  );

-- Add the new range check constraints for integer values (1-5)
ALTER TABLE risks ADD CONSTRAINT risks_impact_check CHECK (impact BETWEEN 1 AND 5);
ALTER TABLE risks ADD CONSTRAINT risks_probability_check CHECK (probability BETWEEN 1 AND 5);
