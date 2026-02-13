import './HomePage.css';
import { HeroGraphic } from './HeroGraphic';

interface HomePageProps {
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onTryDemo?: () => void;
}

export function HomePage({ onOpenLogin, onOpenSignUp, onTryDemo }: HomePageProps) {
  return (
    <div className="homepage">
      <header className="home-header">
        <div className="home-header-inner">
          <h1 className="home-logo">VisionCord</h1>
          <nav className="home-nav">
            <button type="button" className="home-btn home-btn-ghost" onClick={onOpenLogin}>
              Log in
            </button>
            <button type="button" className="home-btn home-btn-primary" onClick={onOpenSignUp}>
              Sign up
            </button>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="home-hero">
          <div className="home-hero-content">
            <h2 className="home-hero-title">A Cord That Actually Protects You</h2>
            <p className="home-hero-text">
              Discord had great potential, but poor moderation decisions and safety oversights have allowed bad actors
              to exploit the system. Predators hide in plain sight, and the platform prioritizes growth over protection.
              VisionCord changes that. We bring you everything Discord should be—the features you love, the communities
              you trust, and the safety standards Discord ignores. Join a platform that puts your security first.
            </p>
            <div className="home-hero-actions">
              <button type="button" className="home-btn home-btn-large home-btn-primary" onClick={onOpenSignUp}>
                Sign up for VisionCord
              </button>
              <button type="button" className="home-btn home-btn-large home-btn-secondary" onClick={onOpenLogin}>
                Already have an account? Log in
              </button>
              {onTryDemo && (
                <button type="button" className="home-btn home-btn-large home-btn-demo" onClick={onTryDemo}>
                  Try with demo account
                </button>
              )}
            </div>
          </div>
          <div className="home-hero-graphic">
            <HeroGraphic />
          </div>
        </section>

        <section className="home-about">
          <h3>What is VisionCord?</h3>
          <p>
            VisionCord is a Cord-style chat application built for the web. Create servers, open
            text and voice channels, send direct messages, react to messages, pin important posts,
            and customize notifications—all in a clean, dark-themed interface you already know.
          </p>
        </section>

        <section className="home-features">
          <h3>Features</h3>
          <ul>
            <li>Servers and channels with a familiar layout</li>
            <li>Direct messages and group conversations</li>
            <li>Message reactions, pins, and search</li>
            <li>User profiles and member lists</li>
            <li>Mute, deafen, and settings</li>
            <li>Responsive, app-like experience in the browser</li>
          </ul>
        </section>

        <section className="home-cta">
          <h3>Ready to get started?</h3>
          <p>Create an account and start chatting in seconds.</p>
          <button type="button" className="home-btn home-btn-primary" onClick={onOpenSignUp}>
            Sign up
          </button>
        </section>
      </main>

      <footer className="home-footer">
        <p>VisionCord — A Cord-style experience on the web.</p>
      </footer>
    </div>
  );
}
