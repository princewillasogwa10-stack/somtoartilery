import { useMemo, useState, useEffect, useRef } from "react";
import * as THREE from "three";

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

function Header({ inquiryCount, onOpenCart, user, onLogout, isAdminActive, onToggleAdmin, ambientPlaying, onToggleAmbient }) {
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    function onHashChange() {
      setActiveSection(window.location.hash);
    }
    window.addEventListener("hashchange", onHashChange);
    setActiveSection(window.location.hash);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <header className="site-header" aria-label="Main navigation">
      <a className="brand" href="#top" aria-label="SOMTO ATELIER home" onClick={() => { if (isAdminActive) onToggleAdmin(false); }}>
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
            <a href="#visit" className={activeSection === "#visit" ? "active" : ""} onClick={() => setNavOpen(false)}>
              Visit
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
              fontWeight: isAdminActive ? '900' : '600',
              color: isAdminActive ? 'var(--ink)' : 'var(--muted)',
              fontSize: '0.92rem',
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
            style={{
              background: "none",
              border: "1px solid var(--line)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "var(--muted)"
            }}
          >
            <span className="sound-wave">
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </span>
            <span>{ambientPlaying ? "Mute" : "Gibran_Alcocer_-_Idea_10_(mp3.pm).mp3"}</span>
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
          <button className="logout-link" type="button" onClick={() => { onLogout(); setNavOpen(false); if (isAdminActive) onToggleAdmin(false); }}>
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
          <a className="button secondary" href="#auth">
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

function VirtualStudio() {
  const mountRef = useRef(null);
  const [shape, setShape] = useState("knot"); // knot, sphere, monolith
  const [material, setMaterial] = useState("marble"); // marble, bronze, clay, wood
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  
  const shapeRef = useRef(shape);
  const materialRef = useRef(material);
  const autoRotateRef = useRef(autoRotate);
  const rotationSpeedRef = useRef(rotationSpeed);

  // Keep refs updated for the animation loop
  useEffect(() => { shapeRef.current = shape; }, [shape]);
  useEffect(() => { materialRef.current = material; }, [material]);
  useEffect(() => { autoRotateRef.current = autoRotate; }, [autoRotate]);
  useEffect(() => { rotationSpeedRef.current = rotationSpeed; }, [rotationSpeed]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f1e7); // var(--paper)

    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2.5, 6);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfffaf2, 1.2);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    // Studio Spotlight for dramatic contrast
    const spotlight = new THREE.SpotLight(0xb9934a, 2.5); // var(--brass) tint
    spotlight.position.set(-4, 6, 2);
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.8;
    spotlight.castShadow = true;
    scene.add(spotlight);

    // Floor / Plinth Base Shadow Receiver
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Build the Plinth (Pedestal)
    const plinthGroup = new THREE.Group();
    const plinthGeo = new THREE.CylinderGeometry(0.8, 0.85, 1.2, 32);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xd7d0c4, // var(--stone)
      roughness: 0.5,
      metalness: 0.1
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = -0.6;
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    plinthGroup.add(plinth);
    scene.add(plinthGroup);

    // Sculpture Group
    const sculptureGroup = new THREE.Group();
    sculptureGroup.position.y = 0.6; // sits on the plinth
    scene.add(sculptureGroup);

    // Materials dictionary
    const getMaterial = (matName) => {
      switch (matName) {
        case "marble":
          return new THREE.MeshPhysicalMaterial({
            color: 0xfffaf2, // var(--chalk)
            roughness: 0.1,
            metalness: 0.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            transmission: 0.1, // soft light pass-through
            thickness: 0.5
          });
        case "bronze":
          return new THREE.MeshStandardMaterial({
            color: 0x3d301b,
            roughness: 0.35,
            metalness: 0.95
          });
        case "clay":
          return new THREE.MeshStandardMaterial({
            color: 0xb75b3f, // var(--clay)
            roughness: 0.95,
            metalness: 0.0
          });
        case "wood":
          return new THREE.MeshStandardMaterial({
            color: 0x5c4033, // deep walnut
            roughness: 0.25,
            metalness: 0.1
          });
        default:
          return new THREE.MeshStandardMaterial({ color: 0x999999 });
      }
    };

    // Geometries
    let currentMesh = null;

    const updateSculpture = () => {
      // Clear old sculpture mesh
      if (currentMesh) {
        sculptureGroup.remove(currentMesh);
        currentMesh.geometry.dispose();
      }

      let geo;
      const sh = shapeRef.current;
      if (sh === "knot") {
        geo = new THREE.TorusKnotGeometry(0.48, 0.15, 120, 16);
      } else if (sh === "sphere") {
        geo = new THREE.IcosahedronGeometry(0.65, 3);
        // Deform vertices slightly to make it organic
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const z = pos.getZ(i);
          // Apply a noise wave
          const wave = Math.sin(x * 4) * Math.cos(y * 4) * Math.sin(z * 4) * 0.08;
          pos.setX(i, x + wave * (x/0.65));
          pos.setY(i, y + wave * (y/0.65));
          pos.setZ(i, z + wave * (z/0.65));
        }
        geo.computeVertexNormals();
      } else {
        // Monolith (Rounded box with cuts)
        geo = new THREE.BoxGeometry(0.7, 1.1, 0.5, 4, 4, 4);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          let x = pos.getX(i);
          let y = pos.getY(i);
          let z = pos.getZ(i);
          // Curve it inwards slightly in the middle to represent a modern sculpted form
          const factor = 1.0 - Math.abs(y) * 0.4;
          pos.setX(i, x * factor);
          pos.setZ(i, z * factor);
        }
        geo.computeVertexNormals();
      }

      const mat = getMaterial(materialRef.current);
      currentMesh = new THREE.Mesh(geo, mat);
      currentMesh.castShadow = true;
      currentMesh.receiveShadow = true;
      sculptureGroup.add(currentMesh);
    };

    updateSculpture();

    // Look at sculpture
    camera.lookAt(0, 0.4, 0);

    // Interaction handlers
    let isDragging = false;
    let prevPointerPos = { x: 0, y: 0 };

    const handlePointerDown = (e) => {
      isDragging = true;
      prevPointerPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPointerPos.x;
      const deltaY = e.clientY - prevPointerPos.y;

      sculptureGroup.rotation.y += deltaX * 0.007;
      sculptureGroup.rotation.x += deltaY * 0.007;

      prevPointerPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // Animation Loop
    let reqId;
    let prevMaterial = materialRef.current;
    let prevShape = shapeRef.current;

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      // Check for changes in parameters
      if (materialRef.current !== prevMaterial || shapeRef.current !== prevShape) {
        updateSculpture();
        prevMaterial = materialRef.current;
        prevShape = shapeRef.current;
      }

      if (autoRotateRef.current && !isDragging) {
        sculptureGroup.rotation.y += rotationSpeedRef.current;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="virtual-studio-section" aria-labelledby="studio-title">
      <div className="studio-container">
        <div className="studio-viewer" ref={mountRef} id="3d-canvas-container" title="Drag cursor to rotate sculpture">
          <div className="studio-badge">Virtual Studio</div>
        </div>
        <div className="studio-controls">
          <p className="eyebrow">Interactive Exhibition</p>
          <h2 id="studio-title">The Virtual Studio</h2>
          <p className="studio-desc">
            Sculptures possess weight, shadow, and tactile presence. Explore these virtual forms in high-fidelity 3D. Spin the plinth, adjust studio lighting, and experiment with material surfaces.
          </p>

          <div className="control-group">
            <h3>Select Form</h3>
            <div className="option-row">
              <button className={`option-btn ${shape === "knot" ? "active" : ""}`} onClick={() => setShape("knot")}>Eternal Knot</button>
              <button className={`option-btn ${shape === "sphere" ? "active" : ""}`} onClick={() => setShape("sphere")}>Genesis Sphere</button>
              <button className={`option-btn ${shape === "monolith" ? "active" : ""}`} onClick={() => setShape("monolith")}>The Monolith</button>
            </div>
          </div>

          <div className="control-group">
            <h3>Material Family</h3>
            <div className="option-row">
              <button className={`option-btn ${material === "marble" ? "active" : ""}`} onClick={() => setMaterial("marble")}>Carrara Marble</button>
              <button className={`option-btn ${material === "bronze" ? "active" : ""}`} onClick={() => setMaterial("bronze")}>Cast Bronze</button>
              <button className={`option-btn ${material === "clay" ? "active" : ""}`} onClick={() => setMaterial("clay")}>Terracotta</button>
              <button className={`option-btn ${material === "wood" ? "active" : ""}`} onClick={() => setMaterial("wood")}>Polished Walnut</button>
            </div>
          </div>

          <div className="control-group toggles-group">
            <label className="toggle-label">
              <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />
              <span>Plinth Auto-Rotation</span>
            </label>
            {autoRotate && (
              <div className="slider-container">
                <label>Rotation Speed</label>
                <input type="range" min="0.001" max="0.02" step="0.001" value={rotationSpeed} onChange={(e) => setRotationSpeed(parseFloat(e.target.value))} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Collection({ onAdd, user }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null);
  const [darkRoom, setDarkRoom] = useState(false);
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

  const closeLightbox = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => setLightbox(null));
    } else {
      setLightbox(null);
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
      {lightbox && (
        <div className="lightbox" onClick={closeLightbox}>
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
            </div>
            <button className="lightbox-close" onClick={closeLightbox}>x</button>
          </div>
        </div>
      )}
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
            style={{
              background: "none",
              border: "1px solid var(--line)",
              cursor: "pointer",
              padding: "8px 16px",
              fontSize: "0.85rem",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}
          >
            {darkRoom ? "☀️ Light Mode" : "🌙 Dark Room"}
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

function AdminDashboard({ token, onClose }) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const res = await fetch("/api/submissions", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error("Failed to fetch inquiries");
        }
        const data = await res.json();
        setInquiries(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchInquiries();
  }, [token]);

  const filteredInquiries = inquiries.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      (item.interest && item.interest.toLowerCase().includes(term)) ||
      (item.works && item.works.toLowerCase().includes(term))
    );
  });

  // Calculate stats
  const totalInquiries = inquiries.length;
  const uniqueUsers = new Set(inquiries.map(i => i.email)).size;
  const totalArtworksCount = inquiries.reduce((sum, item) => {
    if (!item.works) return sum;
    const count = item.works.split(",").map(w => w.trim()).filter(Boolean).length;
    return sum + count;
  }, 0);

  return (
    <section className="admin-dashboard">
      <div className="admin-header">
        <h2>Inquiries Dashboard</h2>
        <button className="button secondary" onClick={onClose}>Back to Gallery</button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Inquiries</h3>
          <p>{totalInquiries}</p>
        </div>
        <div className="stat-card">
          <h3>Unique Enquirers</h3>
          <p>{uniqueUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Artworks Inquired</h3>
          <p>{totalArtworksCount}</p>
        </div>
      </div>

      <div className="admin-controls">
        <input 
          type="text" 
          placeholder="Search by name, email, interest, or artwork..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <p>Loading inquiries...</p>}
      {error && <p className="form-status error">Error: {error}</p>}

      {!loading && !error && (
        <div className="inquiries-list">
          {filteredInquiries.length === 0 ? (
            <div className="empty-state">
              <h3>No inquiries found</h3>
              <p>Either there are no submissions yet, or your search didn't match any records.</p>
            </div>
          ) : (
            filteredInquiries.map((inquiry) => {
              const artworks = inquiry.works ? inquiry.works.split(",").map(w => w.trim()).filter(Boolean) : [];
              return (
                <div key={inquiry.id} className="inquiry-card">
                  <div className="inquiry-meta">
                    <div className="inquiry-user">
                      <h4>{inquiry.name}</h4>
                      <p>{inquiry.email}</p>
                    </div>
                    <span className="inquiry-date">
                      {new Date(inquiry.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="inquiry-details">
                    {inquiry.interest && (
                      <div className="inquiry-field">
                        <h5>Area of Interest</h5>
                        <p>{inquiry.interest}</p>
                      </div>
                    )}
                    {artworks.length > 0 && (
                      <div className="inquiry-field">
                        <h5>Selected Artworks</h5>
                        <div className="artworks-list">
                          {artworks.map((art, idx) => (
                            <span key={idx} className="artwork-tag">{art}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
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
      />
      <main id="top">
        {isAdminActive ? (
          <AdminDashboard token={token} onClose={() => setIsAdminActive(false)} />
        ) : (
          <>
            <Hero />
            <Intro />
            <VirtualStudio />
            <Collection onAdd={addInquiryItem} user={user} />
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
        />
      )}
      <footer>
        <p>SOMTO ATELIER</p>
        <p>Contemporary sculpture, collector services, and private viewings.</p>
      </footer>
    </>
  );
}
