import { useMemo, useState, useEffect } from "react";

const products = [
  {
    name: "Abstract Lady",
    material: "Oil on canvas",
    price: "₦4,500,000",
    category: "painting",
    dimensions: "90 x 120 cm",
    availability: "Available now",
    image: "/assets/abstract-lady.jpg",
    alt: "Abstract painting of a lady",
    copy: "A vibrant abstract portrait with expressive brushwork and rich color composition."
  },
  {
    name: "Untitled Composition",
    material: "Mixed media",
    price: "₦3,800,000",
    category: "painting",
    dimensions: "73 x 111 cm",
    availability: "Available now",
    image: "/assets/art-7.jpg",
    alt: "Abstract composition artwork",
    copy: "A compelling mixed-media piece with layered textures and bold compositional elements."
  },
  {
    name: "Abstract Study",
    material: "Mixed media",
    price: "₦3,200,000",
    category: "painting",
    dimensions: "60 x 80 cm",
    availability: "Available now",
    image: "/assets/art-6.jpg",
    alt: "Abstract study artwork",
    copy: "An evocative abstract study with dynamic form and nuanced color harmony."
  },
  {
    name: "Dreamscape",
    material: "Mixed media",
    price: "₦3,600,000",
    category: "painting",
    dimensions: "70 x 90 cm",
    availability: "Available now",
    image: "/assets/art-5.jpg",
    alt: "Dreamscape abstract artwork",
    copy: "A dreamy abstract composition with flowing forms and a soft, atmospheric palette."
  }
];

const filters = ["all", "painting"];

function Header({ inquiryCount, onOpenCart, user, onLogout }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="site-header" aria-label="Main navigation">
      <a className="brand" href="#top" aria-label="SOMTO ATELIER home">
        <span>SOMTO ATELIER</span>
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
        {user ? (
          <button className="logout-link" type="button" onClick={() => { onLogout(); setNavOpen(false); }}>
            Log out <strong>{user.name}</strong>
          </button>
        ) : (
          <a href="#auth" className="auth-link" onClick={() => setNavOpen(false)}>
            Sign in
          </a>
        )}
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Original sculpture, curated with intention</p>
        <h1 id="hero-title">SOMTO ATELIER</h1>
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
    <section className="intro" aria-label="SOMTO ATELIER introduction">
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

function Collection({ onAdd, user }) {
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
            {user ? (
              <button
                className="button card-action"
                type="button"
                onClick={() => onAdd(product.name)}
                aria-label={`Add ${product.name} to inquiry`}
              >
                Add to inquiry
              </button>
            ) : (
              <a className="button card-action" href="#auth">
                Sign in to add
              </a>
            )}
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
          SOMTO ATELIER works directly with sculptors and estates to source pieces with
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

function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password")
    };
    if (mode === "register") {
      payload.name = formData.get("name");
    }

    try {
      const res = await fetch(`/api/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        onAuth(data.token, data.user);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Unable to reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-section" id="auth" aria-labelledby="auth-title">
      <div className="auth-card">
        <h2 id="auth-title">{mode === "login" ? "Sign in" : "Create account"}</h2>
        <p className="eyebrow">
          {mode === "login"
            ? "Sign in to book a viewing or send an inquiry"
            : "Register to book viewings and send inquiries"}
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Name
              <input type="text" name="name" placeholder="Your name" required />
            </label>
          )}
          <label>
            Email
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input type="password" name="password" placeholder="At least 6 characters" minLength={6} required />
          </label>
          {error && <p className="form-status error">{error}</p>}
          <button className="button primary" type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="auth-toggle">
          {mode === "login" ? (
            <>No account? <button type="button" className="link-button" onClick={() => { setMode("register"); setError(""); }}>Register here</button></>
          ) : (
            <>Already registered? <button type="button" className="link-button" onClick={() => { setMode("login"); setError(""); }}>Sign in</button></>
          )}
        </p>
      </div>
    </section>
  );
}

function Visit({ inquiryItems, token }) {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const selectedWorks = inquiryItems.length > 0 ? inquiryItems.map((i) => i.name).join(", ") : "";

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      interest: formData.get("interest"),
      works: formData.get("works")
    };

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setStatus("Your interest has been sent.");
        form.reset();
      } else {
        const data = await res.json();
        setStatus(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("Unable to reach server. Please try again later.");
    } finally {
      setSubmitting(false);
    }
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
        <button className="button primary" type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Request Appointment"}
        </button>
        <p className="form-status" role="status" aria-live="polite">
          {status}
        </p>
      </form>
    </section>
  );
}

function InquiryBag({ items, open, onClose, onRemove }) {
  const total = items.reduce((sum, item) => {
    const num = parseFloat(item.price.replace(/[₦,]/g, ""));
    return sum + num;
  }, 0);

  function formatPrice(amount) {
    return "₦" + amount.toLocaleString();
  }

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
              <div className="cart-line" key={item.name}>
                <div className="cart-line-info">
                  <img className="cart-line-img" src={item.image} alt={item.name} />
                  <div>
                    <span className="cart-line-name">{item.name}</span>
                    <span className="cart-line-price">{item.price}</span>
                  </div>
                </div>
                <button type="button" onClick={() => onRemove(item.name)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="cart-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        )}
        <a className="button primary cart-cta" href="#visit" onClick={onClose}>
          Send Inquiry
        </a>
      </aside>
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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function handleAuth(newToken, newUser) {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  }

  function handleLogout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  function addInquiryItem(productName) {
    setInquiryItems((items) => {
      if (items.find((i) => i.name === productName)) return items;
      const product = products.find((p) => p.name === productName);
      return product ? [...items, product] : items;
    });
    setCartOpen(true);
  }

  function removeInquiryItem(productName) {
    setInquiryItems((items) => items.filter((item) => item.name !== productName));
  }

  return (
    <>
      <Header inquiryCount={inquiryItems.length} onOpenCart={() => setCartOpen(true)} user={user} onLogout={handleLogout} />
      <main id="top">
        <Hero />
        <Intro />
        <Collection onAdd={addInquiryItem} user={user} />
        <Atelier />
        {user ? (
          <Visit inquiryItems={inquiryItems} token={token} />
        ) : (
          <Auth onAuth={handleAuth} />
        )}
      </main>
      <InquiryBag
        items={inquiryItems}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={removeInquiryItem}
      />
      <footer>
        <p>SOMTO ATELIER</p>
        <p>Contemporary sculpture, collector services, and private viewings.</p>
      </footer>
    </>
  );
}
