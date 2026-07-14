const fs = require('fs');
const { createClient } = require('/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/node_modules/@supabase/supabase-js');

const supabaseUrl = 'https://fwwkesboxlbmimzyoztq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3d2tlc2JveGxibWltenlvenRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk4MDMzMiwiZXhwIjoyMDkzNTU2MzMyfQ.rj3EkRLTS89tM3NbyftV023mWUbHIB4DvXU6cJZzVVU';

const supabase = createClient(supabaseUrl, supabaseKey);

function parseCSV(content) {
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return [];
  
  function parseLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] || '';
    });
    rows.push(row);
  }
  return rows;
}

function determineSegment(row) {
  const q3 = (row['3.¿Cuántos pedidos gestionas al mes?'] || '').trim().toLowerCase();
  const q5 = (row['5.¿Cuántas ventas realiza tu marca al mes?'] || '').trim().toLowerCase();
  const f2q1 = (row['1.¿Cuál es tu volumen de ventas mensual?'] || '').trim().toLowerCase();

  const allAns = [q3, q5, f2q1];

  // 1000_plus
  if (allAns.some(ans => ans.includes('más de 1.000') || ans.includes('más de 1.500') || ans.includes('1000_plus'))) {
    return '1000_plus';
  }
  // 300_1000
  if (allAns.some(ans => ans.includes('301 a 1.000') || ans.includes('entre 201 y 500') || ans.includes('300_1000'))) {
    return '300_1000';
  }
  // 50_300
  if (allAns.some(ans => ans.includes('51 a 300') || ans.includes('entre 51 y 200') || ans.includes('50_300'))) {
    return '50_300';
  }
  // Default to pequeños
  return 'pequenos';
}

async function main() {
  const userpilotPath = '/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/agente-delivery/Documentos/auth0_69fce8b962d8ef610433002e-3FuCsIlbwvZpm5HdlFgzU56KDOc.csv';
  const crmPath = '/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/agente-delivery/Documentos/opportunities (4).csv';

  const survey1Path = '/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/supabase/auth0_69fce8b962d8ef610433002e-3FuLiPh2XeHaGIkveYUagS04Lwu.csv';
  const survey2Path = '/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/supabase/auth0_69fce8b962d8ef610433002e-3FuLowhtsomt6uWDbTnZWkh1SP4.csv';
  const survey3Path = '/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/supabase/auth0_69fce8b962d8ef610433002e-3FuLXf19kHbB9IQVJYFzkvF1dwQ.csv';

  console.log("Reading CSV files...");
  const upRaw = parseCSV(fs.readFileSync(userpilotPath, 'utf-8'));
  const crmRaw = parseCSV(fs.readFileSync(crmPath, 'utf-8'));

  const s1Raw = parseCSV(fs.readFileSync(survey1Path, 'utf-8'));
  const s2Raw = parseCSV(fs.readFileSync(survey2Path, 'utf-8'));
  const s3Raw = parseCSV(fs.readFileSync(survey3Path, 'utf-8'));

  console.log(`Parsed Userpilot rows: ${upRaw.length}`);
  console.log(`Parsed CRM rows: ${crmRaw.length}`);
  console.log(`Parsed Survey rows: ${s1Raw.length + s2Raw.length + s3Raw.length}`);

  // Create user_id -> segment map from survey CSVs
  const surveyMap = new Map();
  [...s1Raw, ...s2Raw, ...s3Raw].forEach(row => {
    const userId = row['User ID'] || row['User Id'];
    if (userId) {
      surveyMap.set(userId.trim(), determineSegment(row));
    }
  });

  // Create set of all Userpilot emails for manual identification
  const upEmails = new Set(upRaw.map(r => (r['Email'] || '').toLowerCase().trim()).filter(Boolean));

  // Create email -> segment map for CRM mapping
  const emailToSegmentMap = new Map();

  // 1. Process Userpilot suppliers into the isolated cohort table
  const mappedSuppliers = upRaw.map(row => {
    const userId = (row['User Id'] || '').trim();
    const segment = surveyMap.get(userId) || 'pequenos';
    
    const email = (row['Email'] || '').toLowerCase().trim();
    if (email) {
      emailToSegmentMap.set(email, segment);
    }

    return {
      user_id: userId,
      name: row['Name'] || row['Full Name'],
      email: row['Email'],
      signed_up: row['Signed Up'] || row['Signed up'] ? new Date(row['Signed Up'] || row['Signed up']).toISOString() : null,
      phone: row['Phone'] || null,
      country: row['Country'] || 'Colombia',
      segment_key: segment
    };
  });

  console.log("Cleaning old Userpilot cohort data in Supabase...");
  const { error: deleteUpError } = await supabase
    .from('ttv_userpilot_cohort')
    .delete()
    .neq('user_id', '000000'); // delete all
  if (deleteUpError) {
    console.error("Error deleting old cohort data:", deleteUpError.message);
    process.exit(1);
  }

  console.log("Uploading Userpilot suppliers cohort to Supabase...");
  for (let i = 0; i < mappedSuppliers.length; i += 50) {
    const batch = mappedSuppliers.slice(i, i + 50);
    const { error } = await supabase.from('ttv_userpilot_cohort').upsert(batch);
    if (error) {
      console.error(`Error uploading Userpilot batch at ${i}:`, error.message);
      process.exit(1);
    }
  }
  console.log("Successfully uploaded Userpilot suppliers cohort!");

  // 2. Process CRM opportunities
  const mappedOpps = crmRaw.map(row => {
    const email = (row['correo electrónico'] || '').toLowerCase().trim();
    const isManual = !upEmails.has(email);
    const segment = emailToSegmentMap.get(email) || 'pequenos'; // manual entries default to pequenos

    // Tags field: handle quote enclosed and split
    const tagsStr = row['etiquetas'] || '';
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    return {
      opportunity_id: row['ID de oportunidad'] || null,
      contact_id: row['ID de contacto'] || null,
      contact_name: row['Nombre del contacto'] || null,
      opportunity_name: row['Nombre de la oportunidad'] || null,
      phone: row['teléfono'] || null,
      email: row['correo electrónico'] || null,
      stage_name: row['fase'] || null,
      status: row['estado'] || 'open',
      date_created: row['Creado el'] ? new Date(row['Creado el']).toISOString() : null,
      date_updated: row['Actualizado el'] ? new Date(row['Actualizado el']).toISOString() : null,
      tags: tags,
      assigned_to: row['asignado'] || null,
      sequence: row['secuencia'] || null,
      is_manual: isManual,
      segment_key: segment
    };
  });

  console.log("Cleaning old opportunities in Supabase...");
  const { error: deleteCrmError } = await supabase
    .from('ttv_crm_opportunities')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
  if (deleteCrmError) {
    console.error("Error deleting old opportunities:", deleteCrmError.message);
    process.exit(1);
  }

  console.log("Uploading CRM opportunities to Supabase...");
  for (let i = 0; i < mappedOpps.length; i += 50) {
    const batch = mappedOpps.slice(i, i + 50);
    const { error } = await supabase.from('ttv_crm_opportunities').upsert(batch);
    if (error) {
      console.error(`Error uploading CRM batch at ${i}:`, error.message);
      process.exit(1);
    }
  }
  console.log("Successfully uploaded CRM opportunities!");

  // 3. Compute Segment Statistics for Month 1 (Cohort starting June 30, 2 PM COT)
  const filterDateCRM = new Date('2026-06-30T19:00:00.000Z'); // 14:00 COT

  // Filter GHL opportunities created since CRM activation
  const cohortOpps = mappedOpps.filter(opp => {
    return opp.date_created && new Date(opp.date_created) >= filterDateCRM;
  });

  const auditedStages = [
    'auditoria confirmada',
    'Auditoría confirmada',
    'Auditoría Rechazada',
    'Auditoría rechazada',
    'Aprobado con pendientes',
    'listo para vender',
    'Listo para vender',
    'Primera Orden generada',
    'Enfrio/no apto',
    'Enfrío/no apto'
  ];

  const readyStages = [
    'listo para vender',
    'Listo para vender',
    'Primera Orden generada'
  ];

  const segments = ['pequenos', '50_300', '300_1000', '1000_plus'];
  const segStats = {};
  segments.forEach(s => {
    segStats[s] = { contactos: 0, auditados: 0, listos: 0 };
  });

  cohortOpps.forEach(opp => {
    const seg = opp.segment_key;
    if (segStats[seg]) {
      segStats[seg].contactos++;
      
      const normalizedStage = (opp.stage_name || '').toLowerCase().trim();
      const isAudited = auditedStages.some(s => s.toLowerCase() === normalizedStage);
      const isReady = readyStages.some(s => s.toLowerCase() === normalizedStage);

      if (isAudited) {
        segStats[seg].auditados++;
      }
      if (isReady) {
        segStats[seg].listos++;
      }
    }
  });

  console.log("Segment distribution calculated:", segStats);

  // Update ttv_monthly_segments table
  console.log("Updating ttv_monthly_segments table in Supabase...");
  for (const seg of segments) {
    const { error: updateError } = await supabase
      .from('ttv_monthly_segments')
      .update({
        contactos_real: segStats[seg].contactos,
        auditados_real: segStats[seg].auditados,
        listos_real: segStats[seg].listos
      })
      .eq('month_number', 1)
      .eq('segment_key', seg);

    if (updateError) {
      console.error(`Error updating segment ${seg}:`, updateError.message);
    }
  }

  console.log("Database update completed successfully!");
}

main().catch(console.error);
