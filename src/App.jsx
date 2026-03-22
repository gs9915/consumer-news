import { useEffect } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  articles,
  author,
  featuredStory,
  homepageStories,
  oyboCta,
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
      <Header />
      <Routes>
        <Route path="/oybo2" element={<ExternalRedirect to="https://consumer-news.com" />} />
        <Route path="/oybo3" element={<ExternalRedirect to="https://consumer-news.com" />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/story/:slug" element={<ArticlePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

function ExternalRedirect({ to }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return null;
}

function StoryMeta({ story, compact = false }) {
  return (
    <div className={`story-meta${compact ? " compact" : ""}`}>
      <span>By {story.author.name}</span>
      {story.meta.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function Header() {
  const firstPhoneStory = homepageStories.find((story) => story.category === "Phones");
  const firstLaptopStory = homepageStories.find((story) => story.category === "Laptops");

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="header-top">
          <Link className="brand" to="/">
            ConsumerNews
          </Link>
          <p className="site-tagline">Technology reviews, product coverage, and buying advice.</p>
        </div>

        <nav className="primary-nav" aria-label="Primary">
          <NavLink to="/">Home</NavLink>
          <Link to="/#latest">Reviews</Link>
          {firstPhoneStory ? <NavLink to={firstPhoneStory.path}>Phones</NavLink> : null}
          {firstLaptopStory ? <NavLink to={firstLaptopStory.path}>Computing</NavLink> : null}
          <NavLink to={featuredStory.path}>Feature</NavLink>
        </nav>
      </div>
    </header>
  );
}

function HomePage() {
  const topStories = homepageStories.slice(0, 4);
  const moreStories = homepageStories.slice(4);

  return (
    <main className="home-page">
      <section className="home-top">
        <div className="container home-top-grid">
          <article className="feature-card">
            {featuredStory.image ? (
              <Link className="feature-media" to={featuredStory.path}>
                <img src={featuredStory.image} alt={featuredStory.alt} />
              </Link>
            ) : null}

            <div className="feature-body">
              <p className="story-label">{featuredStory.category}</p>
              <h1>
                <Link className="headline-link" to={featuredStory.path}>
                  {featuredStory.title}
                </Link>
              </h1>
              <p className="story-dek">{featuredStory.dek}</p>
              <StoryMeta story={featuredStory} />

              <div className="story-actions">
                <Link className="cta-button" to={oyboCta.path}>
                  {oyboCta.label}
                </Link>
                <Link className="story-link" to={featuredStory.path}>
                  Read the feature
                </Link>
              </div>
            </div>
          </article>

          <aside className="home-rail">
            <p className="panel-label">Latest reviews</p>

            {topStories.map((story) => (
              <article className="rail-story" key={story.slug}>
                {story.image ? (
                  <Link className="rail-story-media" to={story.path}>
                    <img src={story.image} alt={story.alt} />
                  </Link>
                ) : null}

                <div className="rail-story-body">
                  <p className="story-label">{story.category}</p>
                  <h2 className="rail-story-title">
                    <Link className="headline-link" to={story.path}>
                      {story.title}
                    </Link>
                  </h2>
                  <StoryMeta compact story={story} />
                </div>
              </article>
            ))}
          </aside>
        </div>
      </section>

      <section className="home-feed" id="latest">
        <div className="container">
          <div className="section-heading">
            <div className="section-heading-copy">
              <p className="panel-label">More coverage</p>
              <h2>Buying advice across tablets, chargers, audio, smart home, and wearables.</h2>
              <p>
                A broader look at the products that quietly shape everyday tech
                buying decisions.
              </p>
            </div>
          </div>

          <div className="feed-grid">
            {moreStories.map((story) => (
              <article className={`feed-story${story.image ? " has-image" : ""}`} key={story.slug}>
                {story.image ? (
                  <Link className="feed-story-media" to={story.path}>
                    <img src={story.image} alt={story.alt} />
                  </Link>
                ) : null}

                <div className="feed-story-body">
                  <p className="story-label">{story.category}</p>
                  <h3>
                    <Link className="headline-link" to={story.path}>
                      {story.title}
                    </Link>
                  </h3>
                  <p className="story-card-dek">{story.dek}</p>
                  <StoryMeta compact story={story} />
                  <Link className="story-link compact" to={story.path}>
                    Read article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return <NotFoundPage />;
  }

  const relatedStories = articles.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <main className="article-page">
      <section className="article-hero">
        <div className={`container article-hero-shell${article.image ? "" : " is-text-only"}`}>
          <div className="article-copy">
            <p className="story-label">{article.category}</p>
            <h1>{article.title}</h1>
            <p className="story-dek">{article.dek}</p>

            <div className="author-strip">
              <img className="author-headshot" src={author.image} alt={author.alt} />
              <div className="author-strip-copy">
                <p className="author-kicker">By {article.author.name}</p>
                <p className="author-role">{article.author.role}</p>
              </div>
              <div className="author-publish">
                <span>Published</span>
                <strong>{article.meta[1]}</strong>
                <small>{article.meta[0]}</small>
              </div>
            </div>

            {article.cta ? (
              <div className="article-cta-bar">
                <Link className="cta-button" to={article.cta.path}>
                  {article.cta.label}
                </Link>
              </div>
            ) : null}
          </div>

          {article.image ? (
            <figure className="article-media">
              <img src={article.image} alt={article.alt} />
              <figcaption>{article.heroCaption}</figcaption>
            </figure>
          ) : null}
        </div>
      </section>

      <section className="article-main">
        <div className="container article-layout">
          <article className="article-column">
            <section className="article-summary-block">
              <p className="panel-label">Takeaways</p>
              <ul className="summary-list">
                {article.summary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {article.sections.map((section) => (
              <section className="article-section" id={section.id} key={section.id}>
                <p className="section-label">{section.label}</p>
                <h2>{section.title}</h2>

                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {section.note ? <aside className="inline-note">{section.note}</aside> : null}
              </section>
            ))}

            {article.cta ? (
              <section className="article-bottom-cta">
                <p className="panel-label">Store visit</p>
                <h2>See the latest offer details at Oybo.</h2>
                <Link className="cta-button" to={article.cta.path}>
                  {article.cta.label}
                </Link>
              </section>
            ) : null}
          </article>

          <aside className="article-sidebar">
            <section className="article-rail-section">
              <p className="panel-label">About the author</p>
              <div className="author-card">
                <img className="author-headshot" src={author.image} alt={author.alt} />
                <div>
                  <h3 className="author-name">{author.name}</h3>
                  <p className="author-role">{author.role}</p>
                </div>
              </div>
              <p className="author-bio">{author.bio}</p>
            </section>

            <section className="article-rail-section">
              <p className="panel-label">Key facts</p>
              <dl className="facts-list">
                {article.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="article-rail-section">
              <p className="panel-label">Related coverage</p>
              <div className="related-stories">
                {relatedStories.map((story) => (
                  <article className="related-story" key={story.slug}>
                    <p className="story-label">{story.category}</p>
                    <h3>
                      <Link className="headline-link" to={story.path}>
                        {story.title}
                      </Link>
                    </h3>
                    <Link className="story-link compact" to={story.path}>
                      Read article
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="container not-found-inner">
        <p className="panel-label">Not found</p>
        <h1>That article is not available.</h1>
        <p>Browse the latest coverage or return to the Oybo feature.</p>
        <div className="story-actions">
          <Link className="story-link" to="/">
            Go to homepage
          </Link>
          <Link className="story-link" to={featuredStory.path}>
            Read the feature
          </Link>
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
          <p>Coverage of phones, laptops, audio gear, accessories, and the stores that sell them.</p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/#latest">Reviews</Link>
          <Link to={featuredStory.path}>Feature</Link>
        </nav>
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
