#!/usr/bin/env python3
"""
Filtra, deduplica y calcula tiempo por etapa de issues de Jira (proyecto PROD)
para el reporte mensual de PD-001. Ver .claude/skills/jira-monthly-report/SKILL.md
para el procedimiento completo — este script solo hace el Paso 2, el resto
(revisión con Laura, redacción del snapshot) es manual a propósito.

ROUTINE_KEYWORDS, STAGE_TAG_RE y normalize_title deben coincidir con
hub/src/lib/jira-project-grouping.ts (si existe en el repo) — es la fuente de
verdad para la app web; si divergen, actualiza este script para igualarlo.

Input esperado (--issues): JSON, lista de objetos con al menos:
  key, fields.summary, fields.issuetype.name, fields.status.statusCategory.name,
  fields.assignee.displayName (o null), fields.created (ISO 8601),
  fields.parent.key (opcional), fields.issuelinks (opcional, lista con
  type.name / outwardIssue.key / inwardIssue.key)

Input esperado (--roster): JSON, dict displayName -> [celula, ...], igual forma
que PM_A_CELULA en pm-celula-map.ts.

Output: JSON a stdout con la estructura descrita al final del archivo.
"""

import argparse
import json
import re
import sys
from collections import defaultdict
from datetime import datetime
from typing import Optional

ROUTINE_KEYWORDS = [
    "reuni", "daily", "weekly", "planning", "planeaci", "ceremonia",
    "seguimiento de proyectos", "seguimiento proyectos", "product lab", "cell board",
    "cronograma", "prioridades", "retro", "cierre de sprint", "revisemos", "wekly",
]

# Taxonomía vigente desde julio 2026. Los tags legados (columna derecha de la
# migración) se detectan pero NUNCA se mapean solos a la taxonomía nueva — ver
# Paso 3 de la skill, es decisión manual de Laura mes a mes.
STAGE_ORDER = ["DISCOVERY", "POC", "DELIVERY", "FOLLOWING"]
STAGE_TAG_RE = re.compile(
    r"\[(DISCOVERY|DICOVERY|POC|DELIVERY|FOLLOWING|DEFINICI[OÓ]N|CIERRE|EXPERIMENTACI[OÓ]N|QA|HANDOFF)\]",
    re.IGNORECASE,
)
LEGACY_TAGS = {"DEFINICIÓN", "DEFINICION", "CIERRE", "EXPERIMENTACIÓN", "EXPERIMENTACION", "QA", "HANDOFF"}


def is_routine_ticket(summary: str) -> bool:
    s = summary.lower()
    return any(kw in s for kw in ROUTINE_KEYWORDS)


def extract_stage_tag(summary: str) -> Optional[str]:
    m = STAGE_TAG_RE.search(summary)
    if not m:
        return None
    tag = m.group(1).upper()
    if tag == "DICOVERY":
        return "DISCOVERY"
    if tag == "DEFINICION":
        return "DEFINICIÓN"
    if tag == "EXPERIMENTACION":
        return "EXPERIMENTACIÓN"
    return tag


def parse_jira_date(value: str) -> datetime:
    # Jira suele devolver "2026-07-01T10:00:00.000+0000" (sin ':' en el offset),
    # a veces "...Z" si viene normalizado a UTC — datetime.fromisoformat no acepta
    # ninguno de los dos de forma confiable en Python < 3.11, por eso strptime.
    if value.endswith("Z"):
        value = value[:-1] + "+0000"
    if "." not in value:
        value = value.replace("+", ".000+") if "+" in value else value + ".000"
    return datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%f%z")


def normalize_title(summary: str) -> str:
    s = summary.lower()
    s = re.sub(r"\[[^\]]*\]", "", s)
    s = re.sub(r"\b(fase|pt\.?|part|parte)\s*\d+\b", "", s)
    s = re.sub(r"\bv\d+(\.\d+)?\b", "", s)
    s = re.sub(r"\bclone\b", "", s)
    s = re.sub(r"[-–]\s*\d+\b", "", s)
    s = re.sub(r"\(\d+\)", "", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


class UnionFind:
    def __init__(self, keys):
        self.parent = {k: k for k in keys}

    def find(self, k):
        while self.parent[k] != k:
            self.parent[k] = self.parent[self.parent[k]]
            k = self.parent[k]
        return k

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.parent[ra] = rb


def celulas_de_assignee(roster: dict, display_name: Optional[str]):
    if not display_name:
        return []
    return roster.get(display_name, [])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--issues", required=True, help="JSON con issues crudos de Jira")
    ap.add_argument("--roster", required=True, help="JSON con PM_A_CELULA")
    ap.add_argument("--month", required=True, help="YYYY-MM, solo para el output")
    args = ap.parse_args()

    with open(args.issues, encoding="utf-8") as f:
        raw_issues = json.load(f)
    with open(args.roster, encoding="utf-8") as f:
        roster = json.load(f)

    stories = []
    total_rutina = 0
    total_no_story = 0
    for issue in raw_issues:
        fields = issue.get("fields", {})
        issuetype = (fields.get("issuetype") or {}).get("name")
        if issuetype != "Story":
            total_no_story += 1
            continue
        summary = fields.get("summary", "")
        if is_routine_ticket(summary):
            total_rutina += 1
            continue
        stories.append(issue)

    ambiguos = defaultdict(lambda: {"posibles": [], "keys": []})
    sin_clasificar = defaultdict(list)
    por_celula_issues = defaultdict(list)

    for issue in stories:
        fields = issue["fields"]
        assignee = (fields.get("assignee") or {}).get("displayName")
        celulas = celulas_de_assignee(roster, assignee)
        if len(celulas) == 0:
            sin_clasificar[assignee or "Sin asignar"].append(issue["key"])
        elif len(celulas) > 1:
            ambiguos[assignee]["posibles"] = celulas
            ambiguos[assignee]["keys"].append(issue["key"])
        else:
            por_celula_issues[celulas[0]].append(issue)

    resultado_por_celula = {}
    for celula, issues in por_celula_issues.items():
        keys = [i["key"] for i in issues]
        uf = UnionFind(keys)
        by_key = {i["key"]: i for i in issues}

        # Union por mismo parent (Epic)
        parent_groups = defaultdict(list)
        for i in issues:
            parent = (i["fields"].get("parent") or {}).get("key")
            if parent:
                parent_groups[parent].append(i["key"])
        for group in parent_groups.values():
            for k in group[1:]:
                uf.union(group[0], k)

        # Union por link "Cloners"
        for i in issues:
            for link in i["fields"].get("issuelinks", []) or []:
                if (link.get("type") or {}).get("name") != "Cloners":
                    continue
                other = (link.get("outwardIssue") or link.get("inwardIssue") or {}).get("key")
                if other in by_key:
                    uf.union(i["key"], other)

        # Union por título normalizado
        title_groups = defaultdict(list)
        for i in issues:
            norm = normalize_title(i["fields"]["summary"])
            title_groups[norm].append(i["key"])
        for group in title_groups.values():
            for k in group[1:]:
                uf.union(group[0], k)

        clusters = defaultdict(list)
        for k in keys:
            clusters[uf.find(k)].append(k)

        proyectos = []
        for root, cluster_keys in clusters.items():
            cluster_issues = [by_key[k] for k in cluster_keys]
            status_counts = {"done": 0, "enCurso": 0, "toDo": 0}
            stage_tags = []  # (tag, created_iso, key)
            for i in cluster_issues:
                cat = ((i["fields"].get("status") or {}).get("statusCategory") or {}).get("name", "To Do")
                if cat == "Done":
                    status_counts["done"] += 1
                elif cat == "In Progress":
                    status_counts["enCurso"] += 1
                else:
                    status_counts["toDo"] += 1
                tag = extract_stage_tag(i["fields"]["summary"])
                if tag:
                    stage_tags.append((tag, i["fields"].get("created"), i["key"]))

            # Etapa más temprana por tag (para transiciones)
            earliest_by_tag = {}
            for tag, created, key in stage_tags:
                if tag not in earliest_by_tag or created < earliest_by_tag[tag][0]:
                    earliest_by_tag[tag] = (created, key)

            legacy_tags_found = sorted(set(t for t in earliest_by_tag if t in LEGACY_TAGS))

            transiciones = []
            present_new_taxonomy = [s for s in STAGE_ORDER if s in earliest_by_tag]
            for a, b in zip(present_new_taxonomy, present_new_taxonomy[1:]):
                d_a = earliest_by_tag[a][0]
                d_b = earliest_by_tag[b][0]
                if d_a and d_b:
                    fa = parse_jira_date(d_a)
                    fb = parse_jira_date(d_b)
                    transiciones.append({
                        "transicion": f"{a.title()} → {b.title()}",
                        "dias": abs((fb - fa).days),
                        "n": 1,
                    })

            representative = max(cluster_issues, key=lambda i: len(i["fields"]["summary"]))["fields"]["summary"]
            proyectos.append({
                "keys": sorted(cluster_keys),
                "count": len(cluster_keys),
                "representativeTitle": representative,
                "statusCounts": status_counts,
                "legacyTagsFound": legacy_tags_found,
                "transicionesEtapa": transiciones,
            })

        proyectos.sort(key=lambda p: -p["count"])
        resultado_por_celula[celula] = proyectos

    output = {
        "month": args.month,
        "totalIssuesRecibidos": len(raw_issues),
        "totalDescartadosNoStory": total_no_story,
        "totalDescartadosRutina": total_rutina,
        "porCelula": resultado_por_celula,
        "ambiguos": [
            {"assignee": a, "posibles": v["posibles"], "count": len(v["keys"]), "keys": v["keys"]}
            for a, v in ambiguos.items()
        ],
        "sinClasificar": [
            {"assignee": a, "count": len(keys), "keys": keys} for a, keys in sin_clasificar.items()
        ],
    }

    json.dump(output, sys.stdout, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
