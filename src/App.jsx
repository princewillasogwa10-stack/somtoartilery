import { useMemo, useState, useEffect, useRef } from "react";

class AmbientSynth {
  constructor() {
    this.audio = null;
    this.playing = false;
  }

  start() {
    try {
      this.audio = new Audio("/Gibran_Alcocer_-_Idea_10_(mp3.pm).mp3");
      this.audio.loop = true;
      this.audio.volume = 0.5;
      this.audio.onerror = () => console.error("Ambient Audio error:", this.audio.error);
      this.audio.play().catch(e => console.error("Ambient Audio play failed:", e));
      this.playing = true;
    } catch (e) {
      console.error("Failed to start Ambient Audio: ", e);
    }
  }

  stop() {
    this.playing = false;
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }
}

const products = [
  {
    name: "Abstract Lady",
    material: "Oil on canvas",
    price: "₦200,000",
    category: "painting",
    dimensions: "90 x 120 cm",
    availability: "Available now",
    image: "/assets/abstract-lady.jpg",
    alt: "Abstract painting of a lady",
    copy: "Made by Michael Amba. A vibrant abstract portrait with expressive brushwork and rich color composition."
  },
  {
    name: "Untitled Composition",
    material: "Mixed media",
    price: "₦800,000",
    category: "painting",
    dimensions: "73 x 111 cm",
    availability: "Available now",
    image: "/assets/art-7.jpg",
    alt: "Abstract composition artwork",
    copy: "Made by Michael Amba. A compelling mixed-media piece with layered textures and bold compositional elements."
  },
  {
    name: "Abstract Study",
    material: "Mixed media",
    price: "₦4,500,000",
    category: "painting",
    dimensions: "60 x 80 cm",
    availability: "Available now",
    image: "/assets/art-6.jpg",
    alt: "Abstract study artwork",
    copy: "Made by Michael Amba. An evocative abstract study with dynamic form and nuanced color harmony."
  },
  {
    name: "Dreamscape",
    material: "Mixed media",
    price: "₦600,000",
    category: "painting",
    dimensions: "70 x 90 cm",
    availability: "Available now",
    image: "/assets/art-5.jpg",
    alt: "Dreamscape abstract artwork",
    copy: "Made by Michael Amba. A dreamy abstract composition with flowing forms and a soft, atmospheric palette."
  },
  {
    name: "United Series by Michael Amba",
    material: "Mixed media",
    price: "₦3,400,000",
    category: "painting",
    dimensions: "65 x 85 cm",
    availability: "Available now",
    image: "/assets/art-3.jpg",
    alt: "Abstract artwork from untitled series",
    copy: "A striking abstract piece with bold gestures and layered depth."
  }
];

const filters = ["all", "painting"];

function compressImage(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        } else {
          if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Header({ inquiryCount, onOpenCart, user, onLogout, isAdminActive, onToggleAdmin, ambientPlaying, onToggleAmbient, onProfileUpdate, token }) {
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollPos = window.scrollY + 200; // Offset for header clearance
      const collectionEl = document.getElementById("collection");
      const atelierEl = document.getElementById("atelier");

      if (atelierEl && scrollPos >= atelierEl.offsetTop && scrollPos < (atelierEl.offsetTop + atelierEl.offsetHeight)) {
        setActiveSection("#atelier");
      } else if (collectionEl && scrollPos >= collectionEl.offsetTop && scrollPos < (collectionEl.offsetTop + collectionEl.offsetHeight)) {
        setActiveSection("#collection");
      } else {
        setActiveSection("");
      }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (showProfileMenu && !e.target.closest('.user-profile-section')) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  return (
    <header className="site-header" aria-label="Main navigation">
      <a className="brand" href="#top" aria-label="SOMTO ATELIER home" onClick={() => { if (isAdminActive) onToggleAdmin(false); }} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
        {!isAdminActive && (
          <>
            <a href="#collection" className={activeSection === "#collection" ? "active" : ""} onClick={() => setNavOpen(false)}>
              Collection
            </a>
            <a href="#atelier" className={activeSection === "#atelier" ? "active" : ""} onClick={() => setNavOpen(false)}>
              Atelier
            </a>
          </>
        )}
        {user && user.email === 'somtoasogwa10@gmail.com' && (
          <button
            className="admin-toggle-link"
            type="button"
            onClick={() => { onToggleAdmin(!isAdminActive); setNavOpen(false); }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: isAdminActive ? '600' : '500',
              color: isAdminActive ? 'var(--ink)' : 'var(--muted)',
              fontSize: '0.82rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: 0
            }}
          >
            {isAdminActive ? "View Site" : "Admin Dashboard"}
          </button>
        )}
        {!isAdminActive && (
          <button 
            className={`ambient-toggle-btn ${ambientPlaying ? "playing" : ""}`}
            type="button" 
            onClick={onToggleAmbient} 
            title="Toggle Ambient Gallery Soundscape"
          >
            <span className="sound-wave">
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </span>
            <span>{ambientPlaying ? "Pause" : "Listen Now"}</span>
          </button>
        )}
        {!isAdminActive && (
          <button className="cart-button" type="button" onClick={onOpenCart} aria-label="Open inquiry bag">
            <span className="cart-icon" aria-hidden="true">
              +
            </span>
            <span>Inquiry</span>
            <span className="cart-count">{inquiryCount}</span>
          </button>
        )}
        {user ? (
          <div className="user-profile-section">
            <button className="profile-btn" type="button" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="profile-picture" />
              ) : (
                <span className="profile-initials">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </button>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="profile-picture-large" />
                  ) : (
                    <span className="profile-initials-large">{user.name.charAt(0).toUpperCase()}</span>
                  )}
                  <div className="profile-user-info">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
                <label className="profile-upload-btn">
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const base64 = await compressImage(file, 200, 0.8);
                      const res = await fetch("/api/user/profile", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ profilePicture: base64 })
                      });
                      const data = await res.json();
                      if (res.ok) {
                        onProfileUpdate(data.user, data.token);
                      } else {
                        console.error("Server error:", data.error);
                      }
                    } catch (err) {
                      console.error("Failed to update profile picture:", err);
                    } finally {
                      setUploading(false);
                    }
                  }} hidden />
                  {uploading ? "Uploading..." : "Change Photo"}
                </label>
                <button className="logout-link" type="button" onClick={() => { onLogout(); setNavOpen(false); setShowProfileMenu(false); if (isAdminActive) onToggleAdmin(false); }}>
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <a href="#auth" className="auth-link" onClick={() => setNavOpen(false)}>
            Sign in
          </a>
        )}
      </nav>
    </header>
  );
}


function Hero({ user }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % products.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

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
          <a className="button secondary" href={user ? "#visit" : "#auth"}>
            Book Viewing
          </a>
        </div>
      </div>
      <div className="hero-slideshow" aria-label="Featured artworks">
        {products.map((product, i) => (
          <img
            key={product.name}
            src={product.image}
            alt={product.alt}
            className={i === slide ? "active" : ""}
          />
        ))}
        <div className="hero-slide-dots">
          {products.map((_, i) => (
            <button
              key={i}
              className={i === slide ? "active" : ""}
              onClick={() => setSlide(i)}
              aria-label={`Show ${products[i].name}`}
            />
          ))}
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
function AudioGuide({ text }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 0.95;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(
        (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural"))
      ) || voices.find((v) => v.lang.startsWith("en"));
      if (voice) utterance.voice = voice;

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="audio-guide-container">
      <button
        type="button"
        className={`audio-guide-btn ${isPlaying ? "playing" : ""}`}
        onClick={toggleSpeech}
        title="Listen to Artwork Description"
      >
        <span className="wave-bar" />
        <span className="wave-bar" />
        <span className="wave-bar" />
        <span>{isPlaying ? "Mute Guide" : "Listen to Guide"}</span>
      </button>
    </div>
  );
}

function Collection({ onAdd, user, darkRoom, setDarkRoom, lightbox, setLightbox }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const gridRef = useRef(null);

  const visibleProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter]);

  const handleFilterChange = (filter) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => setActiveFilter(filter));
    } else {
      setActiveFilter(filter);
    }
  };

  const handleImageClick = (product, event) => {
    const imgEl = event.currentTarget;
    imgEl.style.viewTransitionName = "active-artwork-image";
    
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        setLightbox(product);
      });
      transition.finished.finally(() => {
        imgEl.style.viewTransitionName = "";
      });
    } else {
      setLightbox(product);
    }
  };

  const handleMouseMove = (e) => {
    if (!darkRoom || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gridRef.current.style.setProperty("--grid-mouse-x", `${x}px`);
    gridRef.current.style.setProperty("--grid-mouse-y", `${y}px`);
  };

  const toggleDarkRoom = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => setDarkRoom(!darkRoom));
    } else {
      setDarkRoom(!darkRoom);
    }
  };

  return (
    <section className={`collection-section ${darkRoom ? "dark-room" : ""}`} id="collection" aria-labelledby="collection-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Current Collection</p>
          <h2 id="collection-title">Sculptures for considered spaces</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <button 
            type="button" 
            className={`dark-room-toggle-btn ${darkRoom ? "active" : ""}`}
            onClick={toggleDarkRoom}
          >
            {darkRoom ? "Light Mode" : "Dark Room"}
          </button>
          <div className="filter-tabs" role="tablist" aria-label="Filter sculptures">
            {filters.map((filter) => (
              <button
                className={`filter-tab ${activeFilter === filter ? "active" : ""}`}
                type="button"
                key={filter}
                onClick={() => handleFilterChange(filter)}
              >
                {filter[0].toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div 
        className="product-grid-container" 
        ref={gridRef}
        onMouseMove={handleMouseMove}
        style={{ position: "relative" }}
      >
        {darkRoom && <div className="dark-room-overlay" />}
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product-card spotlight-hover" key={product.name}>
              <img 
                src={product.image} 
                alt={product.alt} 
                onClick={(e) => handleImageClick(product, e)} 
              />
              <div className="product-info">
                <div>
                  <h3>{product.name}</h3>
                  <p className="price">{product.price}</p>
                </div>
                <p className="material">{product.material}</p>
                <p className="product-copy">{product.copy}</p>
              </div>
              <div className="product-card-actions">
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
                <AudioGuide text={`${product.name}. A ${product.material} sculpture. Measuring ${product.dimensions}. ${product.copy}`} />
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
              </div>
            </article>
          ))}
        </div>
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

function InquiryBag({ items, open, onClose, onRemove, user }) {
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
        <a className="button primary cart-cta" href={user ? "#visit" : "#auth"} onClick={onClose}>
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

function OverviewDetail({ filter, inquiries, users, artworkCounts, emailCounts, topArtworks, onBack, authHeaders }) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const returningClientEmails = Object.entries(emailCounts)
    .filter(([_, count]) => count >= 2)
    .map(([email]) => email);

  const newInquiriesList = inquiries.filter(i => new Date(i.createdAt) >= sevenDaysAgo);
  const returningClientsList = inquiries.filter(i => returningClientEmails.includes(i.email));
  const totalArtworksList = inquiries.filter(i => i.works && i.works.trim().length > 0);
  const uniqueEmails = [...new Set(inquiries.map(i => i.email))];
  const artworksList = Object.entries(artworkCounts).sort((a, b) => b[1] - a[1]);

  let title = "";
  let items = [];

  switch (filter) {
    case "new-inquiries":
      title = "New Inquiries (Last 7 Days)";
      items = newInquiriesList;
      break;
    case "returning-clients":
      title = "Returning Clients";
      items = returningClientsList;
      break;
    case "artwork-interests":
      title = "Artwork Interests";
      items = totalArtworksList;
      break;
    case "total-inquiries":
      title = "All Inquiries";
      items = inquiries;
      break;
    case "unique-visitors":
      title = "Unique Visitors";
      items = uniqueEmails.map(email => inquiries.find(i => i.email === email)).filter(Boolean);
      break;
    case "artworks-viewed":
      title = "Artworks Viewed";
      items = artworksList;
      break;
    default:
      items = inquiries;
  }

  return (
    <div className="overview-detail">
      <div className="overview-detail-header">
        <button className="button secondary" onClick={onBack}>← Back to Overview</button>
        <h3>{title}</h3>
        <p className="results-count">{filter === "artworks-viewed" ? `${items.length} unique artworks` : `${items.length} item${items.length !== 1 ? "s" : ""}`}</p>
      </div>

      {filter === "artworks-viewed" ? (
        <div className="artworks-detail-list">
          {items.map(([name, count]) => (
            <div key={name} className="artwork-detail-card">
              <div className="artwork-detail-info">
                <h4>{name}</h4>
                <p>{count} inquiry{count !== 1 ? "ies" : ""}</p>
              </div>
              <div className="artwork-detail-bar">
                <div className="artwork-detail-bar-fill" style={{ width: `${(count / items[0][1]) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : filter === "unique-visitors" ? (
        <div className="inquiries-list">
          {items.map(inquiry => (
            <div key={inquiry.id} className="inquiry-card">
              <div className="inquiry-meta">
                <div className="inquiry-user"><h4>{inquiry.name}</h4><p>{inquiry.email}</p></div>
                <span className="inquiry-date">{new Date(inquiry.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="inquiry-details">
                {inquiry.interest && <div className="inquiry-field"><h5>Interest</h5><p>{inquiry.interest}</p></div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="inquiries-list">
          {items.map(inquiry => {
            const artworks = inquiry.works ? inquiry.works.split(",").map(w => w.trim()).filter(Boolean) : [];
            return (
              <div key={inquiry.id} className="inquiry-card">
                <div className="inquiry-meta">
                  <div className="inquiry-user"><h4>{inquiry.name}</h4><p>{inquiry.email}</p></div>
                  <span className="inquiry-date">{new Date(inquiry.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
                <div className="inquiry-details">
                  {inquiry.interest && <div className="inquiry-field"><h5>Interest</h5><p>{inquiry.interest}</p></div>}
                  {artworks.length > 0 && (
                    <div className="inquiry-field">
                      <h5>Artworks</h5>
                      <div className="artworks-list">{artworks.map((art, idx) => <span key={idx} className="artwork-tag">{art}</span>)}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ token, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [interestFilter, setInterestFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("new");

  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState("");
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [overviewFilter, setOverviewFilter] = useState(null);

  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const res = await fetch("/api/submissions", { headers: authHeaders });
        if (!res.ok) throw new Error("Failed to fetch inquiries");
        setInquiries(await res.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchInquiries();
  }, [token]);

  useEffect(() => {
    if (activeTab !== "users") return;
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users", { headers: authHeaders });
        if (!res.ok) throw new Error("Failed to fetch users");
        setUsers(await res.json());
      } catch (e) {
        setError(e.message);
      }
    }
    fetchUsers();
  }, [activeTab, token]);

  const uniqueInterests = [...new Set(inquiries.map(i => i.interest).filter(Boolean))];

  const filteredInquiries = inquiries.filter(item => {
    const term = searchTerm.toLowerCase();
    if (term && !(item.name.toLowerCase().includes(term) || item.email.toLowerCase().includes(term) || (item.interest && item.interest.toLowerCase().includes(term)) || (item.works && item.works.toLowerCase().includes(term)))) return false;
    if (statusFilter !== "all" && (item.status || "new") !== statusFilter) return false;
    if (interestFilter !== "all" && item.interest !== interestFilter) return false;
    if (dateFrom) {
      const d = new Date(item.createdAt);
      const f = new Date(dateFrom);
      if (d < f) return false;
    }
    if (dateTo) {
      const d = new Date(item.createdAt);
      const t = new Date(dateTo);
      t.setHours(23, 59, 59, 999);
      if (d > t) return false;
    }
    return true;
  });

  const sortedInquiries = [...filteredInquiries].sort((a, b) => {
    switch (sortBy) {
      case "date-asc": return new Date(a.createdAt) - new Date(b.createdAt);
      case "date-desc": return new Date(b.createdAt) - new Date(a.createdAt);
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      case "status": {
        const order = { new: 0, contacted: 1, resolved: 2 };
        return (order[a.status] || 0) - (order[b.status] || 0);
      }
      default: return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const totalInquiries = inquiries.length;
  const uniqueUsers = new Set(inquiries.map(i => i.email)).size;

  const newInquiries = inquiries.filter(i => {
    const d = new Date(i.createdAt);
    return d >= sevenDaysAgo;
  }).length;

  const previousWeekInquiries = inquiries.filter(i => {
    const d = new Date(i.createdAt);
    return d >= fourteenDaysAgo && d < sevenDaysAgo;
  }).length;

  const weeklyChange = previousWeekInquiries > 0
    ? Math.round(((newInquiries - previousWeekInquiries) / previousWeekInquiries) * 100)
    : newInquiries > 0 ? 100 : 0;

  const emailCounts = {};
  inquiries.forEach(i => {
    emailCounts[i.email] = (emailCounts[i.email] || 0) + 1;
  });
  const returningClients = Object.values(emailCounts).filter(count => count >= 2).length;

  const totalArtworksCount = inquiries.reduce((sum, item) => {
    if (!item.works) return sum;
    return sum + item.works.split(",").map(w => w.trim()).filter(Boolean).length;
  }, 0);

  const artworkCounts = {};
  inquiries.forEach(i => {
    if (!i.works) return;
    i.works.split(",").map(w => w.trim()).filter(Boolean).forEach(name => {
      artworkCounts[name] = (artworkCounts[name] || 0) + 1;
    });
  });
  const topArtworks = Object.entries(artworkCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const mostViewedArtwork = topArtworks.length > 0 ? topArtworks[0][0] : "N/A";

  const statusCounts = { new: 0, contacted: 0, resolved: 0 };
  inquiries.forEach(i => { statusCounts[i.status || "new"]++; });

  const monthlyCounts = {};
  inquiries.forEach(i => {
    const d = new Date(i.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
  });
  const months = Object.keys(monthlyCounts).sort();
  const maxMonthCount = months.length > 0 ? Math.max(...months.map(k => monthlyCounts[k])) : 1;
  const maxArtworkCount = topArtworks.length > 0 ? topArtworks[0][1] : 1;

  function getGreeting() {
    const hour = now.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  function toggleSelect(id) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function toggleSelectAll() {
    if (selectedIds.length === sortedInquiries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedInquiries.map(i => i.id));
    }
  }
  function toggleCardExpand(id) {
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function updateStatus(id, status) {
    try {
      await fetch(`/api/submissions/${id}`, { method: "PATCH", headers: { ...authHeaders, "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    } catch (e) {
      setError(e.message);
    }
  }
  async function saveNotes(id) {
    try {
      await fetch(`/api/submissions/${id}`, { method: "PATCH", headers: { ...authHeaders, "Content-Type": "application/json" }, body: JSON.stringify({ notes: notesText }) });
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, notes: notesText } : i));
      setEditingNotes(null);
    } catch (e) {
      setError(e.message);
    }
  }
  async function deleteInquiry(id) {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await fetch(`/api/submissions/${id}`, { method: "DELETE", headers: authHeaders });
      setInquiries(prev => prev.filter(i => i.id !== id));
      setSelectedIds(prev => prev.filter(x => x !== id));
    } catch (e) {
      setError(e.message);
    }
  }
  async function bulkDelete() {
    if (!confirm(`Delete ${selectedIds.length} inquiries?`)) return;
    try {
      await fetch("/api/submissions/bulk-delete", { method: "POST", headers: { ...authHeaders, "Content-Type": "application/json" }, body: JSON.stringify({ ids: selectedIds }) });
      setInquiries(prev => prev.filter(i => !selectedIds.includes(i.id)));
      setSelectedIds([]);
    } catch (e) {
      setError(e.message);
    }
  }
  async function bulkUpdateStatus() {
    try {
      await fetch("/api/submissions/bulk-status", { method: "PATCH", headers: { ...authHeaders, "Content-Type": "application/json" }, body: JSON.stringify({ ids: selectedIds, status: bulkStatus }) });
      setInquiries(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, status: bulkStatus } : i));
      setSelectedIds([]);
    } catch (e) {
      setError(e.message);
    }
  }
  async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE", headers: authHeaders });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      setError(e.message);
    }
  }

  function exportCSV() {
    const rows = [["Name", "Email", "Interest", "Artworks", "Status", "Notes", "Date"]];
    sortedInquiries.forEach(i => {
      rows.push([i.name, i.email, i.interest || "", i.works || "", i.status || "new", (i.notes || "").replace(/\n/g, " "), i.createdAt]);
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "inquiries.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <section className="admin-dashboard"><p>Loading dashboard...</p></section>;

  return (
    <section className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-left">
          <h2>{getGreeting()}, Somto</h2>
          <p className="admin-subtitle">Here's what's happening in your gallery today.</p>
        </div>
        <button className="button secondary" onClick={onClose}>Back to Gallery</button>
      </div>

      {error && <p className="form-status error" style={{ marginBottom: 16 }}>Error: {error}</p>}

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => { setActiveTab("overview"); setOverviewFilter(null); }}>Overview</button>
        <button className={`admin-tab ${activeTab === "inquiries" ? "active" : ""}`} onClick={() => { setActiveTab("inquiries"); setOverviewFilter(null); }}>Inquiries</button>
        <button className={`admin-tab ${activeTab === "users" ? "active" : ""}`} onClick={() => { setActiveTab("users"); setOverviewFilter(null); }}>Users</button>
        <button className={`admin-tab ${activeTab === "analytics" ? "active" : ""}`} onClick={() => { setActiveTab("analytics"); setOverviewFilter(null); }}>Analytics</button>
      </div>

      {activeTab === "overview" && (
        <>
          {!overviewFilter ? (
            <>
              <div className="overview-quick-stats">
                <button className="quick-stat-card clickable" onClick={() => setOverviewFilter("new-inquiries")}>
                  <div className="quick-stat-icon">📩</div>
                  <div className="quick-stat-info">
                    <p className="quick-stat-number">{newInquiries}</p>
                    <p className="quick-stat-label">New Inquiries</p>
                  </div>
                </button>
                <button className="quick-stat-card clickable" onClick={() => setOverviewFilter("returning-clients")}>
                  <div className="quick-stat-icon">👥</div>
                  <div className="quick-stat-info">
                    <p className="quick-stat-number">{returningClients}</p>
                    <p className="quick-stat-label">Returning Clients</p>
                  </div>
                </button>
                <button className="quick-stat-card clickable" onClick={() => setOverviewFilter("artwork-interests")}>
                  <div className="quick-stat-icon">🎨</div>
                  <div className="quick-stat-info">
                    <p className="quick-stat-number">{totalArtworksCount}</p>
                    <p className="quick-stat-label">Artwork Interests</p>
                  </div>
                </button>
              </div>

              <div className="overview-stats-grid">
                <button className="overview-stat-card clickable" onClick={() => setOverviewFilter("total-inquiries")}>
                  <div className="overview-stat-header">
                    <span className="overview-stat-icon">📩</span>
                    <h3>Total Inquiries</h3>
                  </div>
                  <p className="overview-stat-value">{totalInquiries}</p>
                  <p className={`overview-stat-change ${weeklyChange >= 0 ? "positive" : "negative"}`}>
                    {weeklyChange >= 0 ? "↑" : "↓"} {Math.abs(weeklyChange)}% this week
                  </p>
                </button>
                <button className="overview-stat-card clickable" onClick={() => setOverviewFilter("unique-visitors")}>
                  <div className="overview-stat-header">
                    <span className="overview-stat-icon">👥</span>
                    <h3>Unique Visitors</h3>
                  </div>
                  <p className="overview-stat-value">{uniqueUsers}</p>
                  <p className="overview-stat-change positive">↑ {newInquiries} today</p>
                </button>
                <button className="overview-stat-card clickable" onClick={() => setOverviewFilter("artworks-viewed")}>
                  <div className="overview-stat-header">
                    <span className="overview-stat-icon">🎨</span>
                    <h3>Artworks Viewed</h3>
                  </div>
                  <p className="overview-stat-value">{totalArtworksCount}</p>
                  <p className="overview-stat-subtitle">Most viewed: "{mostViewedArtwork}"</p>
                </button>
              </div>
            </>
          ) : (
            <OverviewDetail
              filter={overviewFilter}
              inquiries={inquiries}
              users={users}
              artworkCounts={artworkCounts}
              emailCounts={emailCounts}
              topArtworks={topArtworks}
              onBack={() => setOverviewFilter(null)}
              authHeaders={authHeaders}
            />
          )}
        </>
      )}

      {activeTab === "inquiries" && (
        <>
          <div className="admin-stats">
            <div className="stat-card"><h3>Total Inquiries</h3><p>{totalInquiries}</p></div>
            <div className="stat-card"><h3>Unique Enquirers</h3><p>{uniqueUsers}</p></div>
            <div className="stat-card"><h3>Artworks Inquired</h3><p>{totalArtworksCount}</p></div>
            <div className="stat-card status-new"><h3>New</h3><p>{statusCounts.new}</p></div>
            <div className="stat-card status-contacted"><h3>Contacted</h3><p>{statusCounts.contacted}</p></div>
            <div className="stat-card status-resolved"><h3>Resolved</h3><p>{statusCounts.resolved}</p></div>
          </div>

          <div className="admin-controls">
            <input type="text" placeholder="Search by name, email, interest, or artwork..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
            </select>
            <select className="filter-select" value={interestFilter} onChange={(e) => setInterestFilter(e.target.value)}>
              <option value="all">All Interests</option>
              {uniqueInterests.map(int => <option key={int} value={int}>{int}</option>)}
            </select>
            <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="status">By Status</option>
            </select>
          </div>

          <div className="admin-controls">
            <label className="date-filter-label">From:</label>
            <input type="date" className="date-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <label className="date-filter-label">To:</label>
            <input type="date" className="date-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            {dateFrom || dateTo ? <button className="button-link" onClick={() => { setDateFrom(""); setDateTo(""); }}>Clear dates</button> : null}
          </div>

          {selectedIds.length > 0 && (
            <div className="bulk-toolbar">
              <span>{selectedIds.length} selected</span>
              <select className="filter-select" value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="resolved">Resolved</option>
              </select>
              <button className="button secondary" onClick={bulkUpdateStatus}>Set Status</button>
              <button className="button danger" onClick={bulkDelete}>Delete Selected</button>
              <button className="button-link" onClick={() => setSelectedIds([])}>Clear Selection</button>
            </div>
          )}

          <div className="inquiries-toolbar">
            <span className="results-count">{sortedInquiries.length} result{sortedInquiries.length !== 1 ? "s" : ""}</span>
            <button className="button secondary" onClick={exportCSV}>Export CSV</button>
          </div>

          {sortedInquiries.length === 0 ? (
            <div className="empty-state"><h3>No inquiries found</h3><p>Adjust your filters or check back later.</p></div>
          ) : (
            <div className="inquiries-list">
              {sortedInquiries.map((inquiry) => {
                const artworks = inquiry.works ? inquiry.works.split(",").map(w => w.trim()).filter(Boolean) : [];
                const isSelected = selectedIds.includes(inquiry.id);
                const isExpanded = expandedCards.has(inquiry.id);
                const status = inquiry.status || "new";
                return (
                  <div key={inquiry.id} className={`inquiry-card ${isSelected ? "selected" : ""}`}>
                    <div className="inquiry-checkbox-row">
                      <input type="checkbox" className="inquiry-checkbox" checked={isSelected} onChange={() => toggleSelect(inquiry.id)} />
                      <span className={`status-badge status-${status}`}>{status}</span>
                      <div className="inquiry-actions">
                        <select className="status-select" value={status} onChange={(e) => updateStatus(inquiry.id, e.target.value)}>
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button className="icon-btn" onClick={() => toggleCardExpand(inquiry.id)} title={isExpanded ? "Collapse notes" : "Expand notes"}>{isExpanded ? "\u2212" : "+"}</button>
                        <button className="icon-btn danger" onClick={() => deleteInquiry(inquiry.id)} title="Delete inquiry">&times;</button>
                      </div>
                    </div>
                    <div className="inquiry-meta">
                      <div className="inquiry-user"><h4>{inquiry.name}</h4><p>{inquiry.email}</p></div>
                      <span className="inquiry-date">{new Date(inquiry.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className="inquiry-details">
                      {inquiry.interest && <div className="inquiry-field"><h5>Area of Interest</h5><p>{inquiry.interest}</p></div>}
                      {artworks.length > 0 && <div className="inquiry-field"><h5>Selected Artworks</h5><div className="artworks-list">{artworks.map((art, idx) => <span key={idx} className="artwork-tag">{art}</span>)}</div></div>}
                    </div>
                    {isExpanded && (
                      <div className="inquiry-notes">
                        <h5>Notes</h5>
                        {editingNotes === inquiry.id ? (
                          <div className="notes-edit">
                            <textarea className="notes-textarea" value={notesText} onChange={(e) => setNotesText(e.target.value)} rows={3} placeholder="Add private notes..." />
                            <div className="notes-actions">
                              <button className="button secondary" onClick={() => saveNotes(inquiry.id)}>Save</button>
                              <button className="button-link" onClick={() => setEditingNotes(null)}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="notes-display">
                            <p>{inquiry.notes || <em>No notes yet</em>}</p>
                            <button className="button-link" onClick={() => { setEditingNotes(inquiry.id); setNotesText(inquiry.notes || ""); }}>Edit Notes</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === "users" && (
        <>
          <div className="admin-stats">
            <div className="stat-card"><h3>Total Users</h3><p>{users.length}</p></div>
          </div>
          {users.length === 0 ? (
            <div className="empty-state"><h3>No users found</h3></div>
          ) : (
            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td><button className="icon-btn danger" onClick={() => deleteUser(u.id)} title="Delete user">&times;</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === "analytics" && (
        <div className="analytics-section">
          <h3>Inquiries Over Time</h3>
          {months.length === 0 ? <p>No data yet.</p> : (
            <div className="chart-container">
              {months.map(m => (
                <div key={m} className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height: `${(monthlyCounts[m] / maxMonthCount) * 100}%` }} />
                  <span className="chart-bar-value">{monthlyCounts[m]}</span>
                  <span className="chart-bar-label">{m}</span>
                </div>
              ))}
            </div>
          )}

          <h3>Top Inquired Artworks</h3>
          {topArtworks.length === 0 ? <p>No data yet.</p> : (
            <div className="chart-container horizontal">
              {topArtworks.map(([name, count]) => (
                <div key={name} className="chart-bar-h-wrap">
                  <span className="chart-bar-h-label">{name}</span>
                  <div className="chart-bar-h-track">
                    <div className="chart-bar-h" style={{ width: `${(count / maxArtworkCount) * 100}%` }} />
                  </div>
                  <span className="chart-bar-h-value">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [inquiryItems, setInquiryItems] = useState([]);
  const [cartOpen, setCartOpenState] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAdminActive, setIsAdminActiveState] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [darkRoom, setDarkRoom] = useState(() => {
    const saved = localStorage.getItem("darkRoom");
    return saved ? JSON.parse(saved) : false;
  });
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  useEffect(() => {
    if (darkRoom) {
      document.body.classList.add("dark-room-mode");
    } else {
      document.body.classList.remove("dark-room-mode");
    }
    localStorage.setItem("darkRoom", JSON.stringify(darkRoom));
  }, [darkRoom]);

  const synthRef = useRef(null);

  // View transition wrapper helper
  const withTransition = (updateFn) => {
    if (document.startViewTransition) {
      document.startViewTransition(updateFn);
    } else {
      updateFn();
    }
  };

  const setCartOpen = (val) => withTransition(() => setCartOpenState(val));
  const setIsAdminActive = (val) => withTransition(() => setIsAdminActiveState(val));

  // Toggle ambient soundscape
  const toggleAmbient = () => {
    if (!synthRef.current) {
      synthRef.current = new AmbientSynth();
    }
    if (ambientPlaying) {
      synthRef.current.stop();
      setAmbientPlaying(false);
    } else {
      synthRef.current.start();
      setAmbientPlaying(true);
    }
  };

  // Global mouse coordinates listener for spotlight effect
  useEffect(() => {
    const handleMove = (e) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function handleAuth(newToken, newUser) {
    withTransition(() => {
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
    });
    requestAnimationFrame(() => {
      const visitEl = document.getElementById("visit");
      if (visitEl) visitEl.scrollIntoView({ behavior: "smooth" });
    });
  }

  function handleProfileUpdate(updatedUser, newToken) {
    withTransition(() => {
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (newToken) {
        setToken(newToken);
        localStorage.setItem("token", newToken);
      }
    });
  }

  function handleLogout() {
    withTransition(() => {
      setToken(null);
      setUser(null);
      setIsAdminActiveState(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    });
  }

  function addInquiryItem(productName) {
    withTransition(() => {
      setInquiryItems((items) => {
        if (items.find((i) => i.name === productName)) return items;
        const product = products.find((p) => p.name === productName);
        return product ? [...items, product] : items;
      });
      setCartOpenState(true);
    });
  }

  function removeInquiryItem(productName) {
    withTransition(() => {
      setInquiryItems((items) => items.filter((item) => item.name !== productName));
    });
  }

  return (
    <>
      <Header 
        inquiryCount={inquiryItems.length} 
        onOpenCart={() => setCartOpen(true)} 
        user={user} 
        onLogout={handleLogout} 
        isAdminActive={isAdminActive}
        onToggleAdmin={setIsAdminActive}
        ambientPlaying={ambientPlaying}
        onToggleAmbient={toggleAmbient}
        onProfileUpdate={handleProfileUpdate}
        token={token}
      />
      <main id="top">
        {isAdminActive ? (
          <AdminDashboard token={token} onClose={() => setIsAdminActive(false)} />
        ) : (
          <>
            <Hero user={user} />
            <Intro />
            <Collection onAdd={addInquiryItem} user={user} darkRoom={darkRoom} setDarkRoom={setDarkRoom} lightbox={lightbox} setLightbox={setLightbox} />
            <Atelier />
            {user ? (
              <Visit inquiryItems={inquiryItems} token={token} />
            ) : (
              <Auth onAuth={handleAuth} />
            )}
          </>
        )}
      </main>
      {!isAdminActive && (
        <InquiryBag
          items={inquiryItems}
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          onRemove={removeInquiryItem}
          user={user}
        />
      )}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          {darkRoom && <div className="lightbox-dark-overlay" />}
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={lightbox.image} 
              alt={lightbox.alt} 
              style={{ viewTransitionName: "active-artwork-image" }}
            />
            <div className="lightbox-info">
              <h3>{lightbox.name}</h3>
              <p className="material">{lightbox.material}</p>
              <p className="price">{lightbox.price}</p>
              <p>{lightbox.copy}</p>
              <dl className="product-details">
                <div><dt>Dimensions</dt><dd>{lightbox.dimensions}</dd></div>
                <div><dt>Status</dt><dd>{lightbox.availability}</dd></div>
              </dl>
              {user ? (
                <button
                  className="button card-action"
                  type="button"
                  onClick={() => { addInquiryItem(lightbox.name); setLightbox(null); }}
                  style={{ marginTop: "24px", width: "100%" }}
                >
                  Add to inquiry
                </button>
              ) : (
                <a className="button card-action" href="#auth" onClick={() => setLightbox(null)} style={{ marginTop: "24px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  Sign in to add
                </a>
              )}
            </div>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>x</button>
          </div>
        </div>
      )}
      <footer>
        <div className="footer-brand" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p style={{ margin: 0, fontWeight: 700, letterSpacing: "0.14em", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--ink)" }}>SOMTO ATELIER</p>
        </div>
        <p>Contemporary sculpture, collector services, and private viewings.</p>
      </footer>
    </>
  );
}
