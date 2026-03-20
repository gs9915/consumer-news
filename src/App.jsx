import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  author,
  articleSections,
  articleSidebarFacts,
  articleSummary,
  articleTokens,
  articleWatchlist,
  featuredStory,
  homeCards,
  homepageHighlights,
} from "./content";

function ScrollToTop() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");

      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      });

      return;
    }

    window.scrollTo(0, 0);
  }, [hash, pathname]);

  return null;
}

function AppShell() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Topline />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/story/oybo-airpods" element={<ArticlePage />} />
      </Routes>
      <Footer />
    </div>
  );
}

function Topline() {
  return (
    <div className="topline">
      <div className="container topline-inner">
        <span>Shopping Analysis</span>
        <span>Published March 16, 2026</span>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/">
          Consumer<span>News</span>
        </Link>

        <nav className="primary-nav" aria-label="Primary">
          <NavLink to="/">Home</NavLink>
          <NavLink to={featuredStory.path}>Feature</NavLink>
          <Link to="/#latest">Latest</Link>
        </nav>
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <main>
      <section className="home-hero">
        <div className="container home-hero-grid">
          <article className="lead-story">
            <p className="story-label">{featuredStory.category}</p>
            <h1>{featuredStory.title}</h1>
            <p className="story-dek">{featuredStory.dek}</p>

            <div className="story-meta">
              <span>By {author.name}</span>
              {featuredStory.meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="story-actions">
              <Link className="story-link" to={featuredStory.path}>
                Read the full article
              </Link>
              <div className="token-chip-row" aria-label="Story tokens preview">
                {articleTokens.map((token) => (
                  <span className="token-chip" key={token}>
                    {token}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <div className="lead-visual">
            <img src={featuredStory.image} alt={featuredStory.alt} />
          </div>

          <aside className="lead-sidebar">
            {homepageHighlights.map((item) => (
              <article className="sidebar-panel" key={item.title}>
                <p className="panel-label">{item.label}</p>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </article>
            ))}
          </aside>
        </div>
      </section>

      <section className="section-block" id="latest">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="panel-label">Latest</p>
              <h2>Measured, editorial, and built to let the story breathe.</h2>
            </div>
            <Link className="story-link compact" to={featuredStory.path}>
              Open the feature
            </Link>
          </div>

          <div className="cards-grid">
            {homeCards.map((card) => (
              <article className="news-card" key={card.title}>
                <p className="panel-label">{card.label}</p>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ArticlePage() {
  const [activeSection, setActiveSection] = useState(articleSections[0].id);

  useEffect(() => {
    const elements = articleSections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    if (!elements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-28% 0px -48% 0px",
        threshold: [0.2, 0.4, 0.6],
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <section className="article-hero">
        <div className="container article-hero-grid">
          <div className="article-copy">
            <p className="story-label">{featuredStory.category}</p>
            <h1>{featuredStory.title}</h1>
            <p className="story-dek">{featuredStory.dek}</p>

            <div className="author-strip">
              <img className="author-headshot" src={author.image} alt={author.alt} />
              <div className="author-strip-copy">
                <p className="author-kicker">By {author.name}</p>
                <p className="author-role">{author.role}</p>
              </div>
              <div className="author-publish">
                <span>Published</span>
                <strong>March 16, 2026, 9:00 AM EDT</strong>
              </div>
            </div>
          </div>

          <figure className="article-media">
            <img src={featuredStory.image} alt={featuredStory.alt} />
            <figcaption>
              AirPods remain one of the rare promotional products shoppers can value instantly.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="article-main">
        <div className="container article-layout">
          <article className="article-column">
            {articleSections.map((section) => (
              <section
                className={section.id === activeSection ? "article-section is-active" : "article-section"}
                id={section.id}
                key={section.id}
              >
                <p className="section-label">{section.label}</p>
                <h2>{section.title}</h2>

                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {section.note ? <aside className="inline-note">{section.note}</aside> : null}
                {section.quote ? <blockquote className="pull-quote">{section.quote}</blockquote> : null}

                {section.image ? (
                  <figure className="inline-photo">
                    <img src={section.image.src} alt={section.image.alt} />
                    <figcaption>{section.image.caption}</figcaption>
                  </figure>
                ) : null}
              </section>
            ))}
          </article>

          <aside className="article-sidebar">
            <div className="sidebar-card">
              <p className="panel-label">About the author</p>
              <div className="author-card">
                <img className="author-headshot" src={author.image} alt={author.alt} />
                <div>
                  <h3 className="author-name">{author.name}</h3>
                  <p className="author-role">{author.role}</p>
                </div>
              </div>
              <p className="author-bio">{author.bio}</p>
            </div>

            <div className="sidebar-card">
              <p className="panel-label">What to know</p>
              <ul className="summary-list">
                {articleSummary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="sidebar-card">
              <p className="panel-label">At a glance</p>
              <dl className="facts-list">
                {articleSidebarFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="sidebar-card">
              <p className="panel-label">Watch next</p>
              <ul className="summary-list">
                {articleWatchlist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <figure className="sidebar-card sidebar-photo">
              <img
                src="https://images.pexels.com/photos/3921848/pexels-photo-3921848.jpeg?cs=srgb&dl=pexels-readymade-3921848.jpg&fm=jpg"
                alt="AirPods arranged beside an open charging case."
              />
              <figcaption>
                The product does a lot of the communication before the brand
                ever gets a sentence in.
              </figcaption>
            </figure>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <strong>ConsumerNews</strong>
          <p>
            Independent coverage of shopping, products, and retail behavior.
          </p>
        </div>
        <Link className="story-link compact" to={featuredStory.path}>
          Jump back to the Oybo feature
        </Link>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
