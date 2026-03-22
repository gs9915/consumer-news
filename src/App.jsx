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

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 21l-4.35-4.35m1.75-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 15v6H3v-6m9-14v14m0-14l6 6m-6-6-6 6" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16v11H7l-3 3V5z" />
    </svg>
  );
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
  const { pathname } = useLocation();
  const trendingLinks = homepageStories.slice(0, 4);
  const hideTrendingBar = pathname === "/story/oybo-airpods";

  return (
    <>
      <header className="site-header">
        <div className="container masthead-shell">
          <div className="masthead-row">
            <button className="icon-button" type="button" aria-label="Open navigation">
              <MenuIcon />
            </button>

            <Link className="brand" to="/">
              ConsumerNews
            </Link>

            <button className="signin-button" type="button">
              Sign in
            </button>
          </div>

          <form className="search-shell" role="search">
            <SearchIcon />
            <input type="search" placeholder="What are you searching for?" aria-label="Search" />
          </form>

          <nav className="primary-nav" aria-label="Primary">
            <NavLink to="/">Home</NavLink>
            <Link to="/#latest">Reviews</Link>
            <NavLink to={featuredStory.path}>Feature</NavLink>
          </nav>
        </div>
      </header>

      {!hideTrendingBar ? (
        <nav className="topic-strip" aria-label="Trending">
          <div className="container topic-strip-inner">
            <h2 className="topic-strip-title">Trending:</h2>
            <menu className="topic-strip-menu">
              {trendingLinks.map((story) => (
                <li className="topic-strip-item" key={story.slug}>
                  <Link className="topic-pill" to={story.path}>
                    {story.title}
                  </Link>
                </li>
              ))}
            </menu>
          </div>
        </nav>
      ) : null}
    </>
  );
}

function TopAdBanner() {
  return (
    <section className="top-ad" aria-label="Top Center Ad">
      <div className="top-ad-box">Advertisement</div>
    </section>
  );
}

function TrustDisclosure() {
  return (
    <section className="trust-box">
      <div className="trust-box-mark">
        <div className="trust-badge">
          <span className="trust-mark">CN</span>
          <strong>Why you can trust us</strong>
        </div>
      </div>

      <div className="trust-box-copy">
        <p>
          ConsumerNews has been testing and reviewing consumer tech for years. Our
          stories may include commerce links, but editorial decisions stay separate
          from advertising and affiliate relationships.
        </p>
      </div>
    </section>
  );
}

function ArticleActions() {
  return (
    <div className="article-actions">
      <button className="follow-button" type="button">
        Follow ConsumerNews
      </button>
      <button className="circle-button" type="button" aria-label="Share article">
        <ShareIcon />
      </button>
      <button className="comment-button" type="button">
        <CommentIcon />
        <span>Comments</span>
      </button>
    </div>
  );
}

function ReviewScore({ score }) {
  return (
    <div className="score-card" aria-label={`Expert score ${score} out of 100`}>
      <div className="score-ring" style={{ "--score": score }} />
      <span className="score-value">{score}</span>
      <span className="score-divider">100</span>
      <span className="score-label">Expert Score</span>
    </div>
  );
}

function QuickOverview({ products }) {
  return (
    <section className="quick-overview">
      <div className="quick-overview-heading">Quick Overview</div>
      <div className="quick-overview-list">
        {products.map((product) => {
          const linkedStory = articles.find((story) => story.slug === product.slug);

          return (
            <article className="quick-overview-item" key={product.slug}>
              <Link className="quick-overview-media" to={linkedStory?.path ?? "/"}>
                <img src={product.image} alt={product.alt} />
              </Link>

              <div className="quick-overview-copy">
                <h3>
                  <Link className="headline-link" to={linkedStory?.path ?? "/"}>
                    {product.title}
                  </Link>
                </h3>
                <Link className="quick-overview-cta" to={linkedStory?.path ?? "/"}>
                  Read the review
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ReviewModule({ product }) {
  const linkedStory = articles.find((story) => story.slug === product.slug);

  return (
    <section className="review-module" id={product.slug}>
      <h2 className="review-section-title">{product.sectionTitle}</h2>

      <article className="review-card">
        <div className="review-card-media">
          <Link className="review-card-image" to={linkedStory?.path ?? "/"}>
            <img src={product.image} alt={product.alt} />
          </Link>
          <p className="review-card-caption">{product.caption}</p>
        </div>

        <div className="review-card-body">
          <ReviewScore score={product.score} />

          <div className="review-card-header">
            <h3>
              <Link className="headline-link" to={linkedStory?.path ?? "/"}>
                {product.title}
              </Link>
            </h3>
          </div>

          <p className="review-card-description">{product.description}</p>

          <div className="pros-cons-grid">
            <div className="pros-cons-block">
              <div className="pros-cons-title pros">Pros</div>
              <ul>
                {product.pros.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="pros-cons-block">
              <div className="pros-cons-title cons">Cons</div>
              <ul>
                {product.cons.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <Link className="review-card-cta" to={linkedStory?.path ?? "/"}>
            Read the full review
          </Link>
        </div>
      </article>
    </section>
  );
}

function HomePage() {
  const topStories = homepageStories.slice(0, 5);
  const railStories = homepageStories.slice(0, 4);

  return (
    <main className="page-main home-page">
      <TopAdBanner />

      <section className="home-shell">
        <div className="container home-layout">
          <div className="home-main">
            <article className="home-feature-card">
              {featuredStory.image ? (
                <Link className="home-feature-media" to={featuredStory.path}>
                  <img src={featuredStory.image} alt={featuredStory.alt} />
                </Link>
              ) : null}

              <div className="home-feature-copy">
                <p className="story-label">{featuredStory.category}</p>
                <h1>
                  <Link className="headline-link" to={featuredStory.path}>
                    {featuredStory.title}
                  </Link>
                </h1>
                <p className="article-subheadline">{featuredStory.dek}</p>
                <StoryMeta story={featuredStory} />
                <Link className="story-link home-feature-link" to={featuredStory.path}>
                  Read story
                </Link>
              </div>
            </article>

            <div className="story-stream" id="latest">
              {topStories.map((story) => (
                <article className="story-stream-item" key={story.slug}>
                  {story.image ? (
                    <Link className="story-stream-media" to={story.path}>
                      <img src={story.image} alt={story.alt} />
                    </Link>
                  ) : null}

                  <div className="story-stream-copy">
                    <p className="story-label">{story.category}</p>
                    <h2>
                      <Link className="headline-link" to={story.path}>
                        {story.title}
                      </Link>
                    </h2>
                    <p>{story.dek}</p>
                    <StoryMeta compact story={story} />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="home-rail">
            <section className="rail-block">
              <h2>Latest reviews</h2>
              <div className="rail-story-list">
                {railStories.map((story) => (
                  <article className="rail-story" key={story.slug}>
                    <p className="story-label">{story.category}</p>
                    <h3>
                      <Link className="headline-link" to={story.path}>
                        {story.title}
                      </Link>
                    </h3>
                  </article>
                ))}
              </div>
            </section>

            <section className="rail-block">
              <h2>Retail watch</h2>
              <article className="rail-story rail-story-highlight">
                <p className="story-label">Retail Analysis</p>
                <h3>
                  <Link className="headline-link" to="/story/oybo-airpods">
                    Store gave buyers free Airpods. And it worked.
                  </Link>
                </h3>
                <p className="rail-story-summary">
                  A recognizable freebie got people through the door. The bigger
                  question is whether the offer turns into repeat visits.
                </p>
                <Link className="cta-button rail-cta" to={oyboCta.path}>
                  {oyboCta.label}
                </Link>
              </article>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function RoundupArticlePage({ article }) {
  const relatedStories = homepageStories.slice(0, 4);

  return (
    <main className="page-main article-page">
      <TopAdBanner />

      <section className="article-shell">
        <div className="container article-frame">
          <div className="article-main-column">
            <TrustDisclosure />

            <header className="article-header">
              <h1>{article.title}</h1>
              <h2 className="article-subheadline">{article.dek}</h2>

              <div className="article-header-row">
                <div className="author-row">
                  <img className="author-headshot" src={author.image} alt={author.alt} />
                  <div>
                    <div className="author-name-line">
                      <Link className="headline-link" to="/">
                        {author.name}
                      </Link>
                    </div>
                    <span className="author-role-line">{author.role}</span>
                    <time className="publish-time">{article.meta[1]}</time>
                  </div>
                </div>

                <ArticleActions />
              </div>
            </header>

            {article.image ? (
              <figure className="hero-figure">
                <div className="hero-figure-frame">
                  <img src={article.image} alt={article.alt} />
                </div>
                <figcaption>{article.heroCaption}</figcaption>
              </figure>
            ) : null}

            <div className="article-canvas">
              {article.intro.map((paragraph) => (
                <p className="article-paragraph lead" key={paragraph}>
                  {paragraph}
                </p>
              ))}

              <QuickOverview products={article.products} />

              {article.products.map((product, index) => (
                <div key={product.slug}>
                  <ReviewModule product={product} />

                  {index === 1 && article.bridgeSections[0] ? (
                    <section className="bridge-section">
                      <h2>{article.bridgeSections[0].title}</h2>
                      {article.bridgeSections[0].paragraphs.map((paragraph) => (
                        <p className="article-paragraph" key={paragraph}>
                          {paragraph}
                        </p>
                      ))}
                    </section>
                  ) : null}
                </div>
              ))}

              {article.bridgeSections[1] ? (
                <section className="bridge-section">
                  <h2>{article.bridgeSections[1].title}</h2>
                  {article.bridgeSections[1].paragraphs.map((paragraph) => (
                    <p className="article-paragraph" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </section>
              ) : null}
            </div>
          </div>

          <aside className="article-right-rail">
            <section className="rail-block">
              <h2>Related coverage</h2>
              <div className="rail-story-list">
                {relatedStories.map((story) => (
                  <article className="rail-story" key={story.slug}>
                    <p className="story-label">{story.category}</p>
                    <h3>
                      <Link className="headline-link" to={story.path}>
                        {story.title}
                      </Link>
                    </h3>
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

function StandardArticlePage({ article }) {
  const relatedStories = homepageStories.filter((story) => story.slug !== article.slug).slice(0, 4);
  const isOyboArticle = article.slug === "oybo-airpods";

  return (
    <main className="page-main article-page">
      {!isOyboArticle ? <TopAdBanner /> : null}

      <section className="article-shell">
        <div className="container article-frame">
          <div className="article-main-column">
            <TrustDisclosure />

            <header className="article-header">
              <h1>{article.title}</h1>
              <h2 className="article-subheadline">{article.dek}</h2>

              <div className="article-header-row">
                <div className="author-row">
                  <img className="author-headshot" src={author.image} alt={author.alt} />
                  <div>
                    <div className="author-name-line">
                      <Link className="headline-link" to="/">
                        {author.name}
                      </Link>
                    </div>
                    <span className="author-role-line">{author.role}</span>
                    <time className="publish-time">{article.meta[1]}</time>
                  </div>
                </div>

                <ArticleActions />
              </div>
            </header>

            {article.image ? (
              <figure className="hero-figure">
                <div className="hero-figure-frame">
                  <img src={article.image} alt={article.alt} />
                </div>
                <figcaption>{article.heroCaption}</figcaption>
              </figure>
            ) : null}

            <div className="article-canvas">
              <section className="summary-box">
                <div className="quick-overview-heading">Takeaways</div>
                <ul className="summary-list">
                  {article.summary.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              {article.sections.map((section) => (
                <section className="bridge-section" id={section.id} key={section.id}>
                  <p className="section-label">{section.label}</p>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p className="article-paragraph" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                  {section.note ? <aside className="inline-note">{section.note}</aside> : null}
                </section>
              ))}

              {article.cta ? (
                <section className="article-bottom-cta">
                  <p className="story-label">Store visit</p>
                  <h2>See the latest offer details at Oybo.</h2>
                  <Link className="cta-button" to={article.cta.path}>
                    {article.cta.label}
                  </Link>
                </section>
              ) : null}
            </div>
          </div>

          {!isOyboArticle ? (
            <aside className="article-right-rail">
              <section className="rail-block">
                <h2>Key facts</h2>
                <dl className="facts-list">
                  {article.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="rail-block">
                <h2>Related coverage</h2>
                <div className="rail-story-list">
                  {relatedStories.map((story) => (
                    <article className="rail-story" key={story.slug}>
                      <p className="story-label">{story.category}</p>
                      <h3>
                        <Link className="headline-link" to={story.path}>
                          {story.title}
                        </Link>
                      </h3>
                    </article>
                  ))}
                </div>
              </section>
            </aside>
          ) : null}
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

  if (article.template === "roundup") {
    return <RoundupArticlePage article={article} />;
  }

  return <StandardArticlePage article={article} />;
}

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <TopAdBanner />
      <section className="container not-found-inner">
        <p className="story-label">Not found</p>
        <h1>That article is not available.</h1>
        <p>Browse the latest coverage or return to the homepage.</p>
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
        <strong>ConsumerNews</strong>
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
