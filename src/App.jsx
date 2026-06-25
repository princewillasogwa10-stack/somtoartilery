import { useMemo, useState } from "react";

const products = [
  {
    name: "Ascension Form",
    material: "Patinated bronze",
    price: "₦6,080,000",
    category: "bronze",
    dimensions: "94 x 38 x 31 cm",
    availability: "Available now",
    image: "/assets/sculpture-bronze.svg",
    alt: "Bronze abstract sculpture named Ascension Form",
    copy: "A vertical study in balance with hand-finished dark green patina."
  },
  {
    name: "Quiet Arch",
    material: "Carrara marble",
    price: "₦8,320,000",
    category: "stone",
    dimensions: "72 x 58 x 22 cm",
    availability: "Private viewing",
    image: "/assets/sculpture-stone.svg",
    alt: "Carved marble sculpture named Quiet Arch",
    copy: "A smooth carved arch with negative space and polished inner edges."
  },
  {
    name: "Vessel Memory",
    material: "Raku ceramic",
    price: "₦2,320,000",
    category: "ceramic",
    dimensions: "46 x 29 x 27 cm",
    availability: "Edition 2 of 8",
    image: "/assets/sculpture-ceramic.svg",
    alt: "Textured ceramic sculpture named Vessel Memory",
    copy: "An expressive fired vessel form with ash glaze and raw clay texture."
  }
];

const filters = ["all", "bronze", "stone", "ceramic"];

function Header({ inquiryCount, onOpenCart }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="site-header" aria-label="Main navigation">
      <a className="brand" href="#top" aria-label="Galleria Nazareth home">
        <span>Galleria Nazareth</span>
      </a>

      <button
        className="nav-toggle"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={navOpen}
        onClick={() => setNavOpen((open) => !open)}
      >
        <span />
        <span />
      </button>

      <nav className={`nav-links ${navOpen ? "open" : ""}`} aria-label="Primary">
        <a href="#collection" onClick={() => setNavOpen(false)}>
          Collection
        </a>
        <a href="#atelier" onClick={() => setNavOpen(false)}>
          Atelier
        </a>
        <a href="#visit" onClick={() => setNavOpen(false)}>
          Visit
        </a>
        <button className="cart-button" type="button" onClick={onOpenCart} aria-label="Open inquiry bag">
          <span className="cart-icon" aria-hidden="true">
            +
          </span>
          <span>Inquiry</span>
          <span className="cart-count">{inquiryCount}</span>
        </button>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Original sculpture, curated with intention</p>
        <h1 id="hero-title">Galleria Nazareth</h1>
        <p>
          A contemporary sculpture house for collectors seeking expressive stone, bronze, ceramic,
          and carved wood works with quiet presence.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#collection">
            View Collection
          </a>
          <a className="button secondary" href="#visit">
            Book Viewing
          </a>
        </div>
      </div>
      <div className="hero-notes" aria-label="Gallery highlights">
        <span>Limited editions</span>
        <span>Private sourcing</span>
        <span>Worldwide shipping</span>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="intro" aria-label="Galleria Nazareth introduction">
      <p>
        We select sculptures with tactile weight, architectural form, and a sense of sacred
        stillness. Each piece is ready for homes, hotels, studios, and public interiors.
      </p>
      <div className="intro-stats">
        <span>
          <strong>3</strong> works available
        </span>
        <span>
          <strong>7</strong> represented artists
        </span>
        <span>
          <strong>4</strong> material families
        </span>
      </div>
    </section>
  );
}

function Collection({ onAdd }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const visibleProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="collection-section" id="collection" aria-labelledby="collection-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Current Collection</p>
          <h2 id="collection-title">Sculptures for considered spaces</h2>
        </div>
        <div className="filter-tabs" role="tablist" aria-label="Filter sculptures">
          {filters.map((filter) => (
            <button
              className={`filter-tab ${activeFilter === filter ? "active" : ""}`}
              type="button"
              key={filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter[0].toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <article className="product-card" key={product.name}>
            <img src={product.image} alt={product.alt} />
            <div className="product-info">
              <div>
                <p className="material">{product.material}</p>
                <h3>{product.name}</h3>
              </div>
              <p className="price">{product.price}</p>
            </div>
            <p className="product-copy">{product.copy}</p>
            <dl className="product-details">
              <div>
                <dt>Dimensions</dt>
                <dd>{product.dimensions}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{product.availability}</dd>
              </div>
            </dl>
            <button
              className="button card-action"
              type="button"
              onClick={() => onAdd(product.name)}
              aria-label={`Add ${product.name} to inquiry`}
            >
              Add to inquiry
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Atelier() {
  const services = [
    ["01", "Private Selection", "Curated shortlists for residences, hospitality projects, and cultural spaces."],
    ["02", "Placement Advice", "Scale, light, plinth, and room-position guidance before purchase."],
    ["03", "Secure Delivery", "Crating, insurance, and installation coordination for delicate works."]
  ];

  return (
    <section className="atelier" id="atelier" aria-labelledby="atelier-title">
      <div className="atelier-copy">
        <p className="eyebrow">The Atelier</p>
        <h2 id="atelier-title">A calm buying experience for serious art lovers</h2>
        <p>
          Galleria Nazareth works directly with sculptors and estates to source pieces with
          provenance, installation guidance, and collector-ready documentation.
        </p>
      </div>
      <div className="service-list" aria-label="Services">
        {services.map(([number, title, copy]) => (
          <div key={title}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Visit({ inquiryItems }) {
  const [status, setStatus] = useState("");
  const selectedWorks = inquiryItems.length > 0 ? inquiryItems.join(", ") : "";

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const works = formData.get("works");
    const detail = works ? ` about ${works}` : "";
    setStatus(`Thank you. Galleria Nazareth will reply with viewing details${detail} shortly.`);
    event.currentTarget.reset();
  }

  return (
    <section className="visit" id="visit" aria-labelledby="visit-title">
      <div>
        <p className="eyebrow">Visit or inquire</p>
        <h2 id="visit-title">Begin with a viewing appointment</h2>
        <p>
          Tell us the works you are considering, your space, and your preferred delivery city. We
          will prepare availability, dimensions, and acquisition details.
        </p>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" name="name" placeholder="Your name" required />
        </label>
        <label>
          Email
          <input type="email" name="email" placeholder="you@example.com" required />
        </label>
        <label>
          Interest
          <select name="interest">
            <option>Private viewing</option>
            <option>Artwork inquiry</option>
            <option>Interior project</option>
          </select>
        </label>
        <label>
          Works
          <textarea
            key={selectedWorks}
            name="works"
            placeholder="Selected works or notes"
            defaultValue={selectedWorks}
            rows="4"
          />
        </label>
        <button className="button primary" type="submit">
          Request Appointment
        </button>
        <p className="form-status" role="status" aria-live="polite">
          {status}
        </p>
      </form>
    </section>
  );
}

function InquiryBag({ items, open, onClose, onRemove }) {
  return (
    <>
      <aside className={`cart-panel ${open ? "open" : ""}`} aria-hidden={!open} aria-label="Inquiry bag">
        <div className="cart-header">
          <h2>Inquiry Bag</h2>
          <button type="button" className="close-cart" onClick={onClose} aria-label="Close inquiry bag">
            x
          </button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? (
            <p className="empty-cart">No works added yet.</p>
          ) : (
            items.map((item) => (
              <div className="cart-line" key={item}>
                <span>{item}</span>
                <button type="button" onClick={() => onRemove(item)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <a className="button primary cart-cta" href="#visit" onClick={onClose}>
          Send Inquiry
        </a>
      </aside>``
      <button
        className={`scrim ${open ? "open" : ""}`}
        type="button"
        aria-label="Close inquiry bag"
        onClick={onClose}
      />
    </>
  );
}

export default function App() {
  const [inquiryItems, setInquiryItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  function addInquiryItem(item) {
    setInquiryItems((items) => (items.includes(item) ? items : [...items, item]));
    setCartOpen(true);
  }

  function removeInquiryItem(item) {
    setInquiryItems((items) => items.filter((currentItem) => currentItem !== item));
  }

  return (
    <>
      <Header inquiryCount={inquiryItems.length} onOpenCart={() => setCartOpen(true)} />
      <main id="top">
        <Hero />
        <Intro />
        <Collection onAdd={addInquiryItem} />
        <Atelier />
        <Visit inquiryItems={inquiryItems} />
      </main>
      <InquiryBag
        items={inquiryItems}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={removeInquiryItem}
      />
      <footer>
        <p>Galleria Nazareth</p>
        <p>Contemporary sculpture, collector services, and private viewings.</p>
      </footer>
    </>
  );
}
