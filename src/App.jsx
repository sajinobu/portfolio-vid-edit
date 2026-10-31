import { useEffect, useRef, useState } from "react";
import { profile, projects, services, toolkit } from "./content";

function Icon({ name, size = 20, ...props }) {
  const paths = {
    arrow: <path d="M5 12h14M12 5l7 7-7 7" />,
    northeast: <path d="M6 18 18 6M6 6h12v12" />,
    play: <path d="m9 5 11 7-11 7V5Z" fill="currentColor" strokeWidth="0" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </>
    ),
    moon: <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    scissors: (
      <>
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="m8 8 12 12M8 16 20 4" />
      </>
    ),
    vertical: (
      <>
        <rect x="6" y="2" width="12" height="20" rx="2" />
        <path d="m10 8 5 4-5 4V8Z" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3Z" />
        <path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5L20 2Z" />
      </>
    ),
    layers: (
      <path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5" />
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="13" rx="2" />
        <path d="M16 8V3H3v13h5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
const filters = ["All work", "Clips", "Short-form", "Motion", "AI UGC"];
const filterKeys = {
  "All work": "",
  Clips: "clips",
  "Short-form": "short-form",
  Motion: "motion",
  "AI UGC": "ai-ugc",
};
const formatTime = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
function readLocation() {
  const params = new URLSearchParams(window.location.search);
  return {
    project: projects.find((p) => p.id === params.get("project")) || null,
    filter:
      filters.find((f) => filterKeys[f] === params.get("type")) || "All work",
  };
}

function ProjectPlayer({ project, onClose }) {
  const dialog = useRef(null);
  const video = useRef(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    video.current?.play().catch(() => {});
    return () => {
      document.body.style.overflow = previousOverflow;
      element.close();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={`project-dialog ${project.landscape ? "is-landscape" : ""}`}
      aria-labelledby="player-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="player-shell">
        <button
          className="icon-button player-close"
          onClick={onClose}
          aria-label="Close video"
        >
          <Icon name="close" />
        </button>
        <div className="player-media">
          <video
            ref={video}
            src={`/media/${project.id}.mp4`}
            poster={`/media/${project.id}.jpg`}
            controls
            playsInline
            preload="metadata"
            onError={() => setError(true)}
            aria-label={`${project.title} ${project.subtitle}`}
          />
          {error && (
            <p role="alert" className="video-error">
              The video couldn’t load.{" "}
              <a href={`/media/${project.id}.mp4`}>Open the video directly</a>{" "}
              or try again.
            </p>
          )}
        </div>
        <div className="player-description">
          <p className="eyebrow">Portfolio study / {project.category}</p>
          <h2 id="player-title">{project.title}</h2>
          <p className="player-subtitle">
            {project.subtitle} <span>· {formatTime(project.duration)}</span>
          </p>
          <p>{project.description}</p>
          <div className="tags">
            {project.techniques.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className="study-note">{project.note}</p>
          <a
            href={`mailto:${profile.email}?subject=${encodeURIComponent(`Let's make a video — inspired by ${project.title}`)}`}
            className="text-link"
          >
            Have something like this in mind?{" "}
            <Icon name="northeast" size={16} />
          </a>
        </div>
      </div>
    </dialog>
  );
}

function HeroFrames({ onOpen }) {
  const showcase = ["deep-blue", "akon-paycheck", "chris"].map((id) =>
    projects.find((project) => project.id === id),
  );
  return (
    <div className="hero-reel">
      <div className="reel-topline">
        <span className="tiny-dot" /> A FEW FRAMES FROM MY TIMELINE{" "}
        <span className="reel-plus">+</span>
      </div>
      <div className="frame-stage">
        {showcase.map((project, index) => (
          <button
            key={project.id}
            className={`hero-frame frame-${index}`}
            onClick={() => onOpen(project)}
            aria-label={`Watch ${project.title}`}
          >
            <img
              src={`/media/${project.id}.jpg`}
              alt={project.subtitle}
              width="720"
              height="1280"
              fetchPriority={index === 1 ? "high" : "auto"}
            />
            <span className="frame-play">
              <Icon name="play" size={24} />
            </span>
            <span className="frame-caption">
              <span>
                {project.category === "Motion"
                  ? "MOTION DESIGN"
                  : "PODCAST CLIP"}
              </span>
              <span>{formatTime(project.duration)}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="reel-timeline" aria-hidden="true">
        <div className="time-ruler">
          <span>00:00</span>
          <span>00:10</span>
          <span>00:20</span>
          <span>00:30</span>
        </div>
        <div className="timeline-track">
          <span />
          <span />
          <span />
          <span />
          <i />
        </div>
        <div className="audio-track">
          {Array.from({ length: 62 }, (_, i) => (
            <i key={i} style={{ height: `${4 + ((i * 17 + 7) % 16)}px` }} />
          ))}
        </div>
      </div>
      <div className="reel-bottomline">
        <span>Small details. Better stories.</span>
        <span>01 — 03</span>
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "dark",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [filter, setFilter] = useState(() => readLocation().filter);
  const [selected, setSelected] = useState(() => readLocation().project);
  const [copyState, setCopyState] = useState("");
  const copyTimeout = useRef(null);
  const trigger = useRef(null);
  const navLinks = [
    { id: "work", label: "Work" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content =
      theme === "dark" ? "#0B1120" : "#F8FAFC";
    try {
      localStorage.setItem("js-video-theme", theme);
    } catch {
      /* Theme works without storage. */
    }
  }, [theme]);
  useEffect(() => {
    const sync = () => {
      const state = readLocation();
      setSelected(state.project);
      setFilter(state.filter);
    };
    window.addEventListener("popstate", sync);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }),
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener("popstate", sync);
      observer.disconnect();
      clearTimeout(copyTimeout.current);
    };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);
  const changeFilter = (next) => {
    setFilter(next);
    const url = new URL(window.location.href);
    if (filterKeys[next]) url.searchParams.set("type", filterKeys[next]);
    else url.searchParams.delete("type");
    window.history.replaceState({}, "", url);
  };
  const openProject = (project) => {
    trigger.current = document.activeElement;
    setSelected(project);
    const url = new URL(window.location.href);
    url.searchParams.set("project", project.id);
    window.history.pushState({}, "", url);
  };
  const closeProject = () => {
    setSelected(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("project");
    window.history.replaceState({}, "", url);
    requestAnimationFrame(() => trigger.current?.focus());
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyState("Email copied");
    } catch {
      setCopyState("Select the email address to copy it.");
    }
    clearTimeout(copyTimeout.current);
    copyTimeout.current = setTimeout(() => setCopyState(""), 4000);
  };
  const filtered =
    filter === "All work"
      ? projects
      : projects.filter((project) => project.category === filter);
  const visible = filtered;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container nav-inner">
          <a className="brand" href="#top" aria-label="Jennelle Salva home">
            <span className="brand-mark">
              &lt;<b>JS</b>/&gt;
            </span>
            <span className="brand-label">
              JENNELLE SALVA<span>VIDEO EDITOR</span>
            </span>
          </a>
          <nav
            className={`site-nav ${menuOpen ? "is-open" : ""}`}
            id="navigation"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={
                  activeSection === link.id ? "location" : undefined
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="icon-button theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={19} />
            </button>
            <a href="#contact" className="nav-cta">
              Let’s talk <Icon name="northeast" size={16} />
            </a>
            <button
              className="icon-button menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="navigation"
            >
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section className="hero container" id="top">
          <div className="hero-copy">
            <p className="eyebrow">
              <span>&gt;</span> VIDEO EDITING & MOTION DESIGN
            </p>
            <h1>
              Your story.
              <br />
              <span>Made to move.</span>
            </h1>
            <p className="hero-intro">
              Hi, I’m Jennelle<span className="accent">.</span>
            </p>
            <p className="hero-description">
              I turn conversations and ideas into sharp clips, short-form
              stories, and motion graphics. A thoughtful cut. A little movement.
              A reason to keep watching.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#work">
                <Icon name="play" size={18} /> Explore my work
              </a>
              <a className="button secondary" href="#contact">
                Let’s make something <Icon name="northeast" size={17} />
              </a>
            </div>
            <p className="availability">
              <span className="status-dot" /> Open to freelance projects &
              creative collaborations
            </p>
          </div>
          <HeroFrames onOpen={openProject} />
        </section>
        <div className="tool-strip">
          <div className="container tool-strip-inner">
            <span className="mono strip-label">IN MY TOOLKIT</span>
            <span>CapCut</span>
            <span>After Effects</span>
            <span>ChatGPT / Codex</span>
            <span>Remotion</span>
            <a href="#about" aria-label="Explore my toolkit">
              <Icon name="arrow" size={18} />
            </a>
          </div>
        </div>
        <section className="work-section container section" id="work">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / SELECTED WORK</p>
              <h2>
                A few cuts.
                <br className="mobile-break" /> Different stories.
              </h2>
            </div>
            <p>
              A collection of personal edits and motion studies.
              <br />
              Made to explore, experiment, and get better.
            </p>
          </div>
          <div className="work-toolbar">
            <div
              className="filters"
              role="group"
              aria-label="Filter portfolio work"
            >
              {filters.map((option) => (
                <button
                  className={filter === option ? "is-active" : ""}
                  aria-pressed={filter === option}
                  onClick={() => changeFilter(option)}
                  key={option}
                >
                  {option}
                  {option === "All work" && (
                    <span>{String(projects.length).padStart(2, "0")}</span>
                  )}
                </button>
              ))}
            </div>
            <span className="work-count mono" role="status">
              {String(visible.length).padStart(2, "0")} /{" "}
              {String(filtered.length).padStart(2, "0")} STUDIES
            </span>
          </div>
          <div className="project-grid">
            {visible.map((project) => (
              <article
                className={`project-card ${project.landscape ? "landscape-card" : ""}`}
                key={project.id}
              >
                <button
                  className="project-cover"
                  onClick={() => openProject(project)}
                  aria-label={`Watch ${project.title}`}
                  style={{ "--poster": `url('/media/${project.id}.jpg')` }}
                >
                  <img
                    src={`/media/${project.id}.jpg`}
                    alt={project.subtitle}
                    width={project.landscape ? 1280 : 720}
                    height={project.landscape ? 720 : 1280}
                    loading="lazy"
                  />
                  <span className="cover-shade" />
                  <span className="project-play">
                    <Icon name="play" size={22} />
                    <span>Watch edit</span>
                  </span>
                  <span className="project-duration mono">
                    {formatTime(project.duration)}
                  </span>
                  {project.landscape && (
                    <span className="landscape-label mono">
                      16:9 / MOTION DESIGN
                    </span>
                  )}
                </button>
                <div className="project-info">
                  <div className="project-meta mono">
                    <span>{project.category}</span>
                    <span>
                      STUDY{" "}
                      {String(projects.indexOf(project) + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <button
                    className="project-title"
                    onClick={() => openProject(project)}
                  >
                    <h3>{project.title}</h3>
                    <Icon name="northeast" size={18} />
                  </button>
                  <p>{project.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="portfolio-note">
            Personal portfolio studies. Existing footage is used to demonstrate
            editing; featured people and brands are not clients.
          </p>
        </section>
        <section className="services-section section" id="services">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">02 / WHAT I CAN HELP WITH</p>
                <h2>
                  From raw footage
                  <br />
                  to the final frame.
                </h2>
              </div>
              <p>
                Have a recording, a rough idea, or a story to tell?
                <br />
                Here’s where I can jump in.
              </p>
            </div>
            <div className="service-list">
              {services.map((service, index) => (
                <div className="service-row" key={service.title}>
                  <span className="service-number mono">0{index + 1}</span>
                  <div className="service-name">
                    <Icon name={service.icon} size={24} />
                    <h3>{service.title}</h3>
                  </div>
                  <div className="service-description">
                    <p>{service.description}</p>
                    <span className="mono">{service.tags}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="process">
              <span className="mono process-label">A SIMPLE WAY TO WORK</span>
              <span>
                <b>01</b> Share your idea
              </span>
              <Icon name="arrow" size={16} />
              <span>
                <b>02</b> Shape the first cut
              </span>
              <Icon name="arrow" size={16} />
              <span>
                <b>03</b> Refine & deliver
              </span>
            </div>
          </div>
        </section>
        <section className="about-section container section" id="about">
          <div className="about-copy">
            <p className="eyebrow">03 / BEHIND THE TIMELINE</p>
            <h2>
              A creative eye.
              <br />A developer’s mindset.
            </h2>
            <p>
              I’m Jennelle Salva, a video editor with a background in software
              development. I like the space where storytelling, design, and
              technology meet.
            </p>
            <p>
              I’m early in my editing journey, building my craft through
              hands-on projects. I bring curiosity, care for the details, and a
              willingness to keep refining until the story feels right.
            </p>
            <a
              className="text-link"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              A little more about me <Icon name="northeast" size={16} />
            </a>
          </div>
          <div className="toolkit-panel">
            <div className="toolkit-heading">
              <span className="mono">THE TOOLS BEHIND THE CUTS</span>
              <Icon name="layers" size={18} />
            </div>
            {toolkit.map((tool) => (
              <div className="toolkit-row" key={tool.name}>
                <span className="tool-mark" aria-hidden="true">
                  {tool.mark}
                </span>
                <div>
                  <h3>{tool.name}</h3>
                  <p>{tool.role}</p>
                </div>
                <span className="tool-dot" />
              </div>
            ))}
            <p className="toolkit-footnote">
              Different tools. One goal: tell the story well.
            </p>
          </div>
        </section>
        <section className="contact-section" id="contact">
          <div className="container contact-inner">
            <div>
              <p className="eyebrow">04 / LET’S CREATE</p>
              <h2>
                Got a story in mind?
                <br />
                <span>Let’s give it a good cut.</span>
              </h2>
              <p>
                Tell me what you’re making, where it’s going,
                <br />
                and when you need it. We’ll take it from there.
              </p>
            </div>
            <div className="contact-actions">
              <a
                className="button primary contact-button"
                href={`mailto:${profile.email}?subject=Let%E2%80%99s%20make%20a%20video`}
              >
                Let’s talk about your project{" "}
                <Icon name="northeast" size={19} />
              </a>
              <div className="email-row">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                <button
                  className="icon-button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                >
                  <Icon
                    name={copyState === "Email copied" ? "check" : "copy"}
                    size={16}
                  />
                </button>
              </div>
              <span className="copy-status" role="status">
                {copyState}
              </span>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer container">
        <a href="#top" className="brand-mark" aria-label="Back to top">
          &lt;<b>JS</b>/&gt;
        </a>
        <p>© {new Date().getFullYear()} Jennelle Salva</p>
        <span className="footer-note">Always learning. Always creating.</span>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn <Icon name="northeast" size={14} />
        </a>
        <a href="#top">Back to top ↑</a>
      </footer>
      {selected && (
        <ProjectPlayer
          key={selected.id}
          project={selected}
          onClose={closeProject}
        />
      )}
    </>
  );
}
export default App;
