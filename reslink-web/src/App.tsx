
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import './App.css';
import Registration from './Registration';

type IconName =
  | 'search'
  | 'users'
  | 'book'
  | 'projects'
  | 'arrow'
  | 'network'
  | 'globe'
  | 'check'
  | 'menu'
  | 'close'
  | 'flask'
  | 'message'
  | 'shield'
  | 'sparkles';

function Icon({
  name,
  size = 20,
}: {
  name: IconName;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  const paths: Record<IconName, ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z" />
        <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h7M8 10h7" />
      </>
    ),
    projects: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 4V2m8 2V2M3 9h18M8 13h3m-3 3h6" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    network: (
      <>
        <circle cx="12" cy="5" r="3" />
        <circle cx="5" cy="18" r="3" />
        <circle cx="19" cy="18" r="3" />
        <path d="m10.5 7.5-4 8m7-8 4 8M8 18h8" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m18 6-12 12M6 6l12 12" />,
    flask: (
      <>
        <path d="M9 3h6m-5 0v6L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3L14 9V3" />
        <path d="M7 16h10" />
      </>
    ),
    message: (
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z" />
        <path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14z" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const features = [
  {
    number: '01',
    icon: 'search' as const,
    title: 'Discover researchers',
    description:
      'Find academics, specialists and research partners whose expertise aligns with your interests.',
    color: 'blue',
  },
  {
    number: '02',
    icon: 'projects' as const,
    title: 'Build research teams',
    description:
      'Bring together complementary skills to develop ideas, design studies and deliver meaningful work.',
    color: 'purple',
  },
  {
    number: '03',
    icon: 'book' as const,
    title: 'Share your work',
    description:
      'Showcase publications, research interests, projects and academic achievements in one place.',
    color: 'teal',
  },
  {
    number: '04',
    icon: 'message' as const,
    title: 'Connect and collaborate',
    description:
      'Build professional relationships and create opportunities for lasting academic partnerships.',
    color: 'orange',
  },
];

const researchAreas = [
  'Artificial Intelligence',
  'Public Health',
  'Agriculture',
  'Climate Science',
  'Education',
  'Engineering',
  'Social Sciences',
  'Business & Economics',
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState<'home' | 'register' | 'login'>(
    window.location.hash === '#register'
      ? 'register'
      : window.location.hash === '#login'
        ? 'login'
        : 'home',
  );

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#register') {
        setActivePage('register');
      } else if (window.location.hash === '#login') {
        setActivePage('login');
      } else {
        setActivePage('home');
      }

      setMenuOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const openRegistration = () => {
    closeMenu();
    setActivePage('register');

    if (window.location.hash !== '#register') {
      window.location.hash = 'register';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLogin = () => {
    closeMenu();
    setActivePage('login');

    if (window.location.hash !== '#login') {
      window.location.hash = 'login';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToHome = () => {
    closeMenu();
    setActivePage('home');

    if (window.location.hash !== '#home') {
      window.location.hash = 'home';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activePage === 'register') {
    return <Registration onBack={backToHome} />;
  }

  if (activePage === 'login') {
    return (
      <main className="registration-page">
        <header className="registration-header">
          <button
            className="registration-brand"
            type="button"
            onClick={backToHome}
            aria-label="ResLink home"
          >
            <span className="registration-brand-icon">
              <Icon name="network" size={25} />
            </span>
            <span>
              Res<span className="registration-brand-accent">Link</span>
              <small>RESEARCH. CONNECT. ADVANCE.</small>
            </span>
          </button>

          <button
            className="registration-back"
            type="button"
            onClick={backToHome}
          >
            ← Back to homepage
          </button>
        </header>

        <section
          className="registration-card"
          style={{
            width: 'min(520px, calc(100% - 32px))',
            margin: '70px auto',
            textAlign: 'center',
          }}
        >
          <span className="registration-step">RESEARCHER ACCESS</span>
          <h2>Researcher login</h2>
          <p>
            The ResLink login and account authentication feature has not yet
            been implemented. It will be connected to the secure backend
            after registration and email verification are developed.
          </p>

          <button
            className="registration-submit"
            type="button"
            onClick={openRegistration}
          >
            Create a researcher account →
          </button>

          <button
            className="registration-back"
            type="button"
            style={{ marginTop: 16 }}
            onClick={backToHome}
          >
            Return to homepage
          </button>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container nav-container">
          <a
            className="brand"
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              backToHome();
            }}
            aria-label="ResLink home"
          >
            <span className="brand-mark">
              <Icon name="network" size={25} />
            </span>
            <span className="brand-name">
              Res<span>Link</span>
              <small>RESEARCH. CONNECT. ADVANCE.</small>
            </span>
          </a>

          <button
            className="mobile-menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
          </button>

          <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`}>
            <a href="#home" onClick={(event) => {
              event.preventDefault();
              backToHome();
            }}>
              Home
            </a>
            <a href="#features" onClick={closeMenu}>Explore</a>
            <a href="#research-areas" onClick={closeMenu}>Research areas</a>
            <a href="#about" onClick={closeMenu}>About ResLink</a>

            <div className="mobile-nav-actions">
              <button
                className="button button-outline"
                type="button"
                onClick={openLogin}
              >
                Log in
              </button>
              <button
                className="button button-primary"
                type="button"
                onClick={openRegistration}
              >
                Join ResLink
              </button>
            </div>
          </nav>

          <div className="nav-actions">
            <button className="login-link" type="button" onClick={openLogin}>
              Log in
            </button>
            <button
              className="button button-primary nav-join"
              type="button"
              onClick={openRegistration}
            >
              Join ResLink <Icon name="arrow" size={16} />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-decoration hero-decoration-one" />
          <div className="hero-decoration hero-decoration-two" />

          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                A NEW WAY TO DO RESEARCH
              </div>

              <h1>
                Great research
                <br />
                starts with the
                <br />
                <span>right connection.</span>
              </h1>

              <p className="hero-description">
                Meet researchers who share your curiosity. Discover new
                perspectives, build meaningful partnerships and turn
                promising ideas into impactful research.
              </p>

              <div className="hero-actions">
                <button
                  className="button button-primary button-large"
                  type="button"
                  onClick={openRegistration}
                >
                  Start connecting <Icon name="arrow" size={18} />
                </button>

                <a className="button button-light button-large" href="#features">
                  Explore the platform
                </a>
              </div>

              <div className="hero-assurance">
                <span className="assurance-icon">
                  <Icon name="check" size={15} />
                </span>
                Built for researchers, academics and innovators
              </div>
            </div>

            <div
              className="hero-visual"
              aria-label="Illustration of connected researchers"
            >
              <div className="visual-glow" />
              <div className="visual-label visual-label-top">
                <span className="status-dot" />
                Ideas travel further together
              </div>

              <div className="network-canvas">
                <svg
                  className="network-lines"
                  viewBox="0 0 460 400"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M230 194 L112 93 L72 208 L156 316 L302 316 L390 208 L348 91 L230 194" />
                  <path d="M112 93 L348 91 M72 208 L230 194 M390 208 L230 194 M156 316 L230 194 M302 316 L230 194 M112 93 L156 316 M348 91 L302 316" />
                </svg>

                <div className="researcher-node node-top">
                  <div className="node-avatar avatar-one">AM</div>
                  <span>AI Research</span>
                </div>
                <div className="researcher-node node-left">
                  <div className="node-avatar avatar-two">TN</div>
                  <span>Public Health</span>
                </div>
                <div className="researcher-node node-right">
                  <div className="node-avatar avatar-three">SK</div>
                  <span>Agriculture</span>
                </div>
                <div className="researcher-node node-bottom-left">
                  <div className="node-avatar avatar-four">JD</div>
                  <span>Education</span>
                </div>
                <div className="researcher-node node-bottom-right">
                  <div className="node-avatar avatar-five">LM</div>
                  <span>Engineering</span>
                </div>

                <div className="central-node">
                  <span className="central-icon">
                    <Icon name="network" size={31} />
                  </span>
                  <strong>ResLink</strong>
                  <small>Ideas connect here</small>
                </div>

                <div className="floating-card floating-card-project">
                  <span className="floating-icon">
                    <Icon name="flask" size={19} />
                  </span>
                  <span>
                    <strong>New collaboration</strong>
                    <small>Possibilities unlocked</small>
                  </span>
                </div>

                <div className="floating-card floating-card-match">
                  <span className="match-check">
                    <Icon name="check" size={15} />
                  </span>
                  <span>
                    <strong>Shared interests</strong>
                    <small>Research match found</small>
                  </span>
                </div>
              </div>

              <div className="visual-caption">
                <span className="caption-line" />
                One connection can change everything.
              </div>
            </div>
          </div>

          <div className="container hero-bottom">
            <span>ONE PLATFORM. MANY POSSIBILITIES.</span>
            <div className="hero-bottom-items">
              <span><Icon name="users" size={17} /> Researcher discovery</span>
              <span><Icon name="projects" size={17} /> Project collaboration</span>
              <span><Icon name="globe" size={17} /> Global perspectives</span>
            </div>
          </div>
        </section>

        <section className="intro-section" id="about">
          <div className="container intro-grid">
            <div>
              <span className="section-kicker">RESEARCH WITHOUT BOUNDARIES</span>
              <h2>
                Your next breakthrough
                <br />
                could start with <span>a conversation.</span>
              </h2>
            </div>
            <div className="intro-text">
              <p>
                Research can do more when knowledge, experience and ideas
                come together. ResLink is being built to make it easier
                for researchers to find one another and explore what
                they can achieve together.
              </p>
              <a className="text-link" href="#features">
                Discover what is possible <Icon name="arrow" size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-kicker">THE RESLINK EXPERIENCE</span>
                <h2>Everything starts with <span>connection.</span></h2>
              </div>
              <p>
                A connected research community begins with the right tools
                to discover people, exchange knowledge and work together.
              </p>
            </div>

            <div className="feature-grid">
              {features.map((feature) => (
                <article className="feature-card" key={feature.number}>
                  <div className={`feature-icon icon-${feature.color}`}>
                    <Icon name={feature.icon} size={25} />
                  </div>
                  <span className="feature-number">{feature.number}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <button
                    className="feature-link"
                    type="button"
                    onClick={openRegistration}
                    aria-label={`Register to explore ${feature.title}`}
                  >
                    Explore <Icon name="arrow" size={16} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="research-section" id="research-areas">
          <div className="container research-grid">
            <div className="research-copy">
              <span className="section-kicker">KNOWLEDGE KNOWS NO BORDERS</span>
              <h2>
                Different fields.
                <br />
                <span>Shared possibilities.</span>
              </h2>
              <p>
                Whether you study technology, health, society or the natural
                world, the next valuable perspective might come from a
                discipline different from your own.
              </p>
              <button
                className="button button-primary"
                type="button"
                onClick={openRegistration}
              >
                Find your research community <Icon name="arrow" size={17} />
              </button>
            </div>

            <div className="research-topics">
              {researchAreas.map((area, index) => (
                <button
                  className="topic-pill"
                  key={area}
                  type="button"
                  onClick={openRegistration}
                >
                  <span className={`topic-number topic-number-${(index % 4) + 1}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {area}
                  <Icon name="arrow" size={15} />
                </button>
              ))}
              <div className="topics-note">
                <Icon name="sparkles" size={18} />
                <span>And many more areas of discovery.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="join-section" id="join">
          <div className="container">
            <div className="join-panel">
              <div className="join-decoration join-decoration-one" />
              <div className="join-decoration join-decoration-two" />
              <div className="join-content">
                <span className="join-kicker">YOUR RESEARCH JOURNEY, CONNECTED</span>
                <h2>
                  The best discoveries
                  <br />
                  are rarely made alone.
                </h2>
                <p>
                  Be part of a community built around curiosity,
                  collaboration and the pursuit of knowledge.
                </p>
                <button
                  className="button button-white button-large"
                  type="button"
                  onClick={openRegistration}
                >
                  Join the research community <Icon name="arrow" size={18} />
                </button>
                <small>
                  Researcher registration includes affiliation and identity
                  verification steps.
                </small>
              </div>
              <div className="join-art" aria-hidden="true">
                <div className="join-orbit orbit-one" />
                <div className="join-orbit orbit-two" />
                <div className="join-orbit orbit-three" />
                <div className="join-center"><Icon name="network" size={44} /></div>
                <span className="join-satellite satellite-one"><Icon name="book" size={22} /></span>
                <span className="join-satellite satellite-two"><Icon name="users" size={22} /></span>
                <span className="join-satellite satellite-three"><Icon name="flask" size={22} /></span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <a
            className="brand footer-brand"
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              backToHome();
            }}
          >
            <span className="brand-mark">
              <Icon name="network" size={24} />
            </span>
            <span className="brand-name">
              Res<span>Link</span>
              <small>CONNECT MINDS. ADVANCE RESEARCH.</small>
            </span>
          </a>
          <p>Bringing research minds together to shape what comes next.</p>
          <a
            className="footer-back-top"
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              backToHome();
            }}
          >
            Back to top ↑
          </a>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} ResLink. All rights reserved.</span>
          <span>Designed for discovery. Built for collaboration.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
