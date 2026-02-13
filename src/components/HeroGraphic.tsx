import './HeroGraphic.css';

/** Discord-style hero: floating server icons, chat bubbles, and a central scene */
export function HeroGraphic() {
  return (
    <div className="hero-graphic" aria-hidden>
      <div className="hero-graphic-bg" />
      {/* Floating server icons (left) */}
      <div className="hero-float hero-servers-left">
        <span className="hero-server-icon" style={{ animationDelay: '0s' }}>VC</span>
        <span className="hero-server-icon" style={{ animationDelay: '0.5s' }}>GH</span>
        <span className="hero-server-icon" style={{ animationDelay: '1s' }}>DS</span>
      </div>
      {/* Floating server icons (right) */}
      <div className="hero-float hero-servers-right">
        <span className="hero-server-icon" style={{ animationDelay: '0.2s' }}>🎮</span>
        <span className="hero-server-icon" style={{ animationDelay: '0.7s' }}>💬</span>
        <span className="hero-server-icon" style={{ animationDelay: '1.2s' }}>⚡</span>
      </div>
      {/* Chat bubbles / message preview (center) */}
      <div className="hero-chat-scene">
        <div className="hero-chat-window">
          <div className="hero-chat-header">
            <span className="hero-chat-hash">#</span>
            <span>general</span>
          </div>
          <div className="hero-chat-messages">
            <div className="hero-msg">
              <span className="hero-msg-avatar">AX</span>
              <span className="hero-msg-author">Alex</span>
              <span className="hero-msg-text">Hey, anyone online?</span>
            </div>
            <div className="hero-msg">
              <span className="hero-msg-avatar">SK</span>
              <span className="hero-msg-author">Sky</span>
              <span className="hero-msg-text">Yeah! What’s up?</span>
            </div>
            <div className="hero-msg hero-msg-you">
              <span className="hero-msg-avatar hero-msg-avatar-you">Vi</span>
              <span className="hero-msg-author">Vision</span>
              <span className="hero-msg-text">Just hanging out 👋</span>
            </div>
          </div>
          <div className="hero-chat-input">
            <span className="hero-chat-input-placeholder">Message #general</span>
          </div>
        </div>
      </div>
      {/* Decorative circles / orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
    </div>
  );
}
