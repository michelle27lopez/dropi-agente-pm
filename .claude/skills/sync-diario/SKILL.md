---
name: sync-diario
description: Trae al día la rama de trabajo local con los últimos commits de origin/main (los cambios de Jaime/el otro dev) sin perder trabajo local ni forzar push. Úsalo al empezar el día o antes de seguir trabajando, para no divergir en silencio del repo compartido.
user-invocable: true
argument-hint: "[nombre de rama a actualizar, default: la rama actual]"
---

Sincroniza tu rama local con `origin/main` de forma segura, dejando que tú decidas cuándo hacer push. Pensado para correr **todos los días** antes de seguir trabajando, entre Michelle y Jaime en `dropi-agente-pm`.

## Contexto del repo (no asumir otra cosa)

- `origin` = `jaimeguevara-dropi/dropi-agente-pm` — Michelle **no tiene push aquí** (403 si lo intenta).
- `fork` = `michelle27lopez/dropi-agente-pm` — remoto con permisos de Michelle. Nunca confundir con `michelle` (otro repo, `dropi-pd-hub`, no usar).
- Nadie sube directo a `main`. Michelle trabaja en ramas `design/*` (actualmente acumulativa: `design/mis-cambios-acumulados`).
- Regla dura ya acordada: **no hacer push a ningún remoto salvo que la persona lo pida explícitamente**. Esta skill solo trae cambios (fetch + merge locales); nunca empuja nada por su cuenta.

## Pasos

1. **Verificar árbol de trabajo.** Corre `git status --short`. Si hay cambios sin commitear o sin stash:
   - No los toques por tu cuenta (ni `git stash`, ni `git checkout --`, ni commits automáticos).
   - Pregunta a la persona si quiere comitear/stashear antes de seguir, o si prefiere pausar el sync. No continúes con el merge hasta resolverlo.

2. **Fetch de ambos remotos.** `git fetch origin` y `git fetch fork` (silencioso). Esto solo actualiza referencias remotas, no toca el working tree.

3. **Actualizar `main` local con lo de Jaime.**
   - `git checkout main`
   - `git merge --ff-only origin/main`
   - Si el fast-forward falla (main local tiene commits que origin/main no tiene), **detente y avisa** — eso es una señal de que algo se comiteó donde no debía; no lo resuelvas solo.
   - Reporta cuántos commits nuevos trajiste (útil para saber qué cambió sin tener que leer 54 commits sueltos).

4. **Volver a la rama de trabajo y traer main.**
   - `git checkout <rama-de-trabajo>` (la que estaba activa al iniciar, o la que se pase como argumento).
   - `git merge main` (merge normal, **no rebase** — la rama ya vive pusheada en `fork`, y rebasear forzaría un push -f más adelante; un merge commit es más seguro y no reescribe historia).

5. **Si hay conflictos:**
   - No los resuelvas adivinando cuál versión "gana". Lista los archivos en conflicto y para cada uno resume en una línea qué cambió de cada lado (tu commit vs. el commit de Jaime), y pregunta cómo proceder archivo por archivo si no es obvio.
   - Nunca uses `git checkout --ours` / `--theirs` en bloque para "resolver rápido" — eso es exactamente el tipo de pérdida silenciosa de trabajo que esta skill existe para evitar.

6. **Revisar si llegaron migraciones de Supabase nuevas.** Si el merge trajo archivos nuevos bajo `hub/supabase/*.sql` que no existían antes, avísalo explícitamente — cada quien tiene su propio proyecto Supabase aislado (ver memoria de proyecto), así que una migración nueva de Jaime no se aplica sola; hay que correrla a mano en el SQL Editor del proyecto propio.

7. **Resumen final.** Reporta:
   - Cuántos commits de Jaime se integraron.
   - Si el merge quedó limpio o con conflictos (y si con conflictos, si ya se resolvieron).
   - Estado de la rama local vs. `fork` (ahead/behind) — para que la persona decida si quiere pushear ahora o seguir trabajando primero. No lo hagas automáticamente.

## Qué NO hace esta skill

- No pushea a `fork` ni a `origin` bajo ninguna circunstancia — eso requiere confirmación explícita de la persona, siempre.
- No abre ni actualiza Pull Requests.
- No resuelve conflictos de forma automática/heurística.
- No toca Supabase ni corre migraciones por su cuenta.
