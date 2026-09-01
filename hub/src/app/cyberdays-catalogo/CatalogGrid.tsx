"use client";

import { useState } from "react";

type CatalogProduct = {
  id: number;
  name: string;
  price: number;
  suggestedPrice: number;
  category: string;
  provider: string;
  image: string;
  dropiUrl: string;
};

// Mismo marco (marcoo2.png) y misma ventana medida sobre su canal alfa que
// usa el panel de proveedor para el ZIP de fotos enmarcadas (ver MARCO_WINDOW
// en elegibles/[token]/page.tsx) — acá se aplica con CSS puro (object-fit:
// cover posicionado dentro de la ventana + el PNG del marco encima) en vez
// de canvas, porque es una grilla pública de N productos y no hace falta
// generar un archivo por foto, solo que se vea enmarcada.
const MARCO_SRC = "/cyberdays/assets/marcoo2.png";

function ProductImage({ image, name }: { image: string; name: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="catalog-card-image">
      <div className="catalog-card-photo-window">
        {!image || failed ? (
          <span className="catalog-card-image-fallback">{name.slice(0, 2).toUpperCase()}</span>
        ) : (
          <img src={encodeURI(image)} alt="" loading="lazy" onError={() => setFailed(true)} />
        )}
      </div>
      <img className="catalog-card-frame" src={MARCO_SRC} alt="" aria-hidden="true" loading="lazy" />
    </div>
  );
}

export default function CatalogGrid({ products }: { products: CatalogProduct[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort();

  return (
    <div className="cyc-page">
      <div className="cyc-header no-print">
        <h1 className="cyc-title">Catálogo Cyber Days</h1>
        <span className="cyc-count">{products.length} productos</span>
        <button className="cyc-download" onClick={() => window.print()}>
          ↓ Descargar PDF
        </button>
      </div>

      {categories.length > 1 && (
        <div className="cyc-filters no-print">
          <button
            className={`cyc-pill${activeCategory === null ? " active" : ""}`}
            onClick={() => setActiveCategory(null)}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`cyc-pill${activeCategory === category ? " active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="cyc-empty">Todavía no hay productos cargados en el catálogo.</div>
      ) : (
        <div className="catalog-grid">
          {products.map((product) => (
            <a
              key={product.id}
              href={product.dropiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`catalog-card${activeCategory && product.category !== activeCategory ? " filtered-out" : ""}`}
            >
              <ProductImage image={product.image} name={product.name} />
              <div className="catalog-card-body">
                <span className="catalog-card-name">{product.name}</span>
                {product.provider && <span className="catalog-card-provider">{product.provider}</span>}
                <div className="catalog-card-prices">
                  {product.price > 0 && (
                    <span className="catalog-card-price">${product.price.toLocaleString("es-CO")}</span>
                  )}
                  {product.suggestedPrice > 0 && (
                    <span className="catalog-card-suggested">
                      Sugerido ${product.suggestedPrice.toLocaleString("es-CO")}
                    </span>
                  )}
                </div>
                {product.category && <span className="catalog-card-category">{product.category}</span>}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
