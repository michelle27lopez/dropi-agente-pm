---
name: sync-diario
description: Trae al día la rama de trabajo local con lo último fusionado en origin/main (los cambios de quien sea la otra persona) y, si se confirma explícitamente en esa corrida, sube los commits propios a su remoto — sin perder trabajo de ningún lado y sin forzar push nunca. Funciona tanto para Michelle (fork) como para Jaime (push directo a origin), detectando el rol al vuelo. Úsalo al empezar el día o antes de seguir trabajando, para no divergir en silencio del repo compartido.
user-invocable: true
argument-hint: "[nombre de rama a actualizar, default: la rama actual]"
---

Sincroniza tu rama local con `origin/main` de forma segura (trae lo que la otra persona ya fusionó) y, solo si se pide explícitamente en esa corrida, sube tus commits al final. Pensado para correr **todos los días** antes de seguir trabajando, tanto por Michelle como por Jaime en `dropi-agente-pm`, cubriendo las dos direcciones sin que nadie pierda nada.

## Contexto del repo — dos roles distintos, detectar cuál aplica

- `origin` = `jaimeguevara-dropi/dropi-agente-pm`, el repo canónico/compartido. **Jaime es dueño de `origin`** y pushea directo ahí (a sus propias ramas, nunca a `main` sin PR). **Michelle no tiene push en `origin`** (403 si lo intenta); ella usa su propio remoto `fork` (`michelle27lopez/dropi-agente-pm`) y abre PR cross-fork hacia `origin`. Ojo: existe también un remoto `michelle` → `dropi-pd-hub`, es un repo *distinto*, no usarlo nunca para esto.
- **Paso 0 — detectar rol antes de todo:** correr `git remote -v`.
  - Si existe un remoto llamado `fork` → quien corre la skill es un colaborador externo (como Michelle): su remoto personal para push es `fork`.
  - Si **no** existe remoto `fork` → quien corre la skill tiene push directo en `origin` (como Jaime): su remoto personal para push es `origin` mismo (siempre a su propia rama, nunca a `main`).
  - No asumas de antemano que la persona es Michelle o Jaime — decide por lo que existe en `git remote -v` de ese checkout.
- Nadie sube directo a `main` en ningún caso, sin importar el rol.
- **Importante sobre qué trae esta skill:** solo trae lo que ya está *fusionado* en `origin/main`. Si la otra persona tiene un PR abierto pero aún no fusionado, esta skill no lo trae — para revisar trabajo en curso antes de aprobar, se usa el link de preview de Vercel del PR (flujo ya existente), no esta skill.
- Regla dura ya acordada: **no hacer push a ningún remoto salvo que la persona lo pida explícitamente, en esa misma corrida**. Los pasos 1-8 (traer cambios) nunca pushean nada por su cuenta. El paso 9 (subir cambios) es el único que puede pushear, y solo tras preguntar y recibir un sí explícito — nunca asumir un sí de una corrida anterior.

## Pasos

1. **Verificar árbol de trabajo.** Corre `git status --short`. Si hay cambios sin commitear o sin stash:
   - No los toques por tu cuenta (ni `git stash`, ni `git checkout --`, ni commits automáticos).
   - Pregunta a la persona si quiere comitear/stashear antes de seguir, o si prefiere pausar el sync. No continúes con el merge hasta resolverlo.

2. **Fetch.** `git fetch origin` siempre. Si en el paso 0 se detectó un remoto personal distinto de `origin` (p. ej. `fork`), fetch de ese también (`git fetch fork`) — es solo para tener tus propias referencias remotas al día, no trae cambios de la otra persona (eso vive en `origin`).

3. **Pull de tu propia rama de trabajo (protege contra trabajo hecho desde otra máquina o pusheado sin que tu local lo tenga).**
   - Revisa si `<rama-de-trabajo>` tiene upstream configurado (`git rev-parse --abbrev-ref --symbolic-full-name @{u}` sobre esa rama, o buscar `<remoto-personal>/<rama-de-trabajo>` en las referencias ya fetcheadas).
   - Si existe y tiene commits que tu copia local no tiene: `git merge --ff-only <remoto-personal>/<rama-de-trabajo>`.
   - Si el fast-forward falla (divergieron de verdad, no solo que el remoto esté adelante), **detente y avisa** en vez de decidir tú cuál versión vale — probablemente hay trabajo en dos lugares que hay que reconciliar a mano.
   - Si no hay upstream o no hay commits nuevos, sigue de largo sin hacer nada.

4. **Actualizar `main` local con lo que la otra persona ya fusionó.**
   - `git checkout main`
   - `git merge --ff-only origin/main`
   - Si el fast-forward falla (main local tiene commits que origin/main no tiene), **detente y avisa** — eso es una señal de que algo se comiteó donde no debía; no lo resuelvas solo.
   - Reporta cuántos commits nuevos trajiste (útil para saber qué cambió sin tener que leer decenas de commits sueltos).

5. **Volver a la rama de trabajo y traer main.**
   - `git checkout <rama-de-trabajo>` (la que estaba activa al iniciar, o la que se pase como argumento).
   - `git merge main` (merge normal, **no rebase** — la rama puede ya vivir pusheada en el remoto personal, y rebasear forzaría un push -f más adelante; un merge commit es más seguro y no reescribe historia).

6. **Si hay conflictos** (ya sea del paso 3 o del paso 5):
   - No los resuelvas adivinando cuál versión "gana". Lista los archivos en conflicto y para cada uno resume en una línea qué cambió de cada lado (tu commit vs. el commit de la otra persona), y pregunta cómo proceder archivo por archivo si no es obvio.
   - Nunca uses `git checkout --ours` / `--theirs` en bloque para "resolver rápido" — eso es exactamente el tipo de pérdida silenciosa de trabajo que esta skill existe para evitar.

7. **Revisar si llegaron migraciones de Supabase nuevas.** Si el merge trajo archivos nuevos bajo `hub/supabase/*.sql` que no existían antes, avísalo explícitamente — cada quien tiene su propio proyecto Supabase aislado (ver memoria de proyecto), así que una migración nueva de la otra persona no se aplica sola; hay que correrla a mano en el SQL Editor del proyecto propio.

8. **Resumen intermedio.** Reporta:
   - Cuántos commits nuevos se integraron (del paso 3 y del paso 5 por separado) y de qué se trataban (a grandes rasgos).
   - Si algún merge quedó limpio o con conflictos (y si con conflictos, si ya se resolvieron).
   - Estado de la rama local vs. el remoto personal detectado en el paso 0 (ahead/behind).

9. **Push guiado (opcional, solo con confirmación explícita en esta corrida).**
   - Pregunta directamente: "¿Quieres que suba tus commits a `<remoto-personal>/<rama>` ahora?" (usando el remoto detectado en el paso 0: `fork` para Michelle, `origin` para Jaime). No lo asumas por defecto ni por lo que se haya dicho en corridas anteriores.
   - Si dice que no (o no responde con un sí claro): detente aquí. Deja el resumen del paso 8 como cierre.
   - Si dice que sí:
     - `git push <remoto-personal> <rama-de-trabajo>` — nunca a `main`, nunca `--force`/`--force-with-lease` (si el push normal falla porque el remoto avanzó, detente y avisa en vez de forzar). Para Michelle esto es cross-fork hacia `origin`; para Jaime es directo dentro de `origin`, mismo repo.
     - Si el remoto personal es `fork` (caso Michelle): revisa si ya existe un PR abierto para esta rama antes de ofrecer crear uno nuevo (ver memoria del proyecto: histórico de PRs). Si existe, solo confirma que el push lo actualiza automáticamente. Si no existe, pregunta si quiere que abras uno — no lo abras sin que lo pida.
     - Si el remoto personal es `origin` (caso Jaime): el push ya deja la rama actualizada en el mismo repo; igual pregunta si quiere abrir o actualizar un PR hacia `main`, no lo hagas sin que lo pida.

## Qué NO hace esta skill

- No pushea nada en los pasos 1-8 (traer cambios) bajo ninguna circunstancia.
- En el paso 9, no pushea sin una confirmación explícita en esa misma corrida — nunca por inercia de una corrida anterior.
- Nunca hace push forzado (`--force` / `--force-with-lease`), a ningún remoto.
- No abre ni actualiza Pull Requests sin que se le pida explícitamente.
- No resuelve conflictos de forma automática/heurística.
- No toca Supabase ni corre migraciones por su cuenta.
- No trae trabajo de la otra persona que aún no se haya fusionado a `origin/main` (para eso, preview de Vercel del PR).
