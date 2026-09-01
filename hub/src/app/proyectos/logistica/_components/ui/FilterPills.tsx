// Selector de una opción entre pocas: semana, país, período, etapa.
//
// Es el "pill tab bar" de caza-productos y del Metrics Lab (Suppliers):
// contenedor gris, la opción activa en blanco con una sombra mínima. Se trae
// como primitivo porque en Logística el selector de semana era un <select>
// nativo —correcto, pero esconde las opciones— y el weekly tiene pocas semanas:
// verlas todas de un golpe es más rápido que desplegar.
//
// Sin estado propio: recibe `value` y avisa con `onChange`. Con más de ~8
// opciones deja de servir (se envuelve en dos filas) y ahí sí toca un select.

export type OpcionPill<T extends string | number> = {
  value: T;
  label: string;
  /** Texto secundario, en 11px y gris: "· actual", "3 proyectos". */
  hint?: string;
};

type Props<T extends string | number> = {
  options: OpcionPill<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Etiqueta accesible del grupo. */
  label: string;
};

export default function FilterPills<T extends string | number>({ options, value, onChange, label }: Props<T>) {
  return (
    <div className="u-pills" role="group" aria-label={label}>
      {options.map((o) => {
        const activa = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            className="u-pills__item"
            data-active={activa || undefined}
            aria-pressed={activa}
            onClick={() => onChange(o.value)}
          >
            {o.label}
            {o.hint && <span className="u-pills__hint">{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}
