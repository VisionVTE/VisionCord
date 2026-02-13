import { useRef, useEffect } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import type { Message, Channel, Server, User } from '../types';

interface ChatViewProps {
  server: Server | null;
  channel: Channel | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onThreadsClick?: () => void;
  onNotificationClick?: () => void;
  onPinClick?: () => void;
  onMembersClick?: () => void;
  onSearchClick?: () => void;
  onAuthorClick?: (user: User, event?: React.MouseEvent) => void;
  onReactionClick?: (messageId: string, emoji: string) => void;
  onTogglePin?: (messageId: string) => void;
  searchQuery?: string;
  onSearchQueryChange?: (value: string) => void;
  searchResults?: Message[];
  attachmentMenuOpen?: boolean;
  onAttachmentMenuToggle?: () => void;
  gifPanelOpen?: boolean;
  onGifPanelToggle?: () => void;
  stickerPanelOpen?: boolean;
  onStickerPanelToggle?: () => void;
  notificationDropdownOpen?: boolean;
  onCloseNotificationDropdown?: () => void;
  onCloseInputMenus?: () => void;
}

function formatTime(date: Date) {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function groupMessages(messages: Message[]): Message[][] {
  if (messages.length === 0) return [];
  const groups: Message[][] = [];
  let current: Message[] = [messages[0]];
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].author.id === messages[i - 1].author.id) {
      current.push(messages[i]);
    } else {
      groups.push(current);
      current = [messages[i]];
    }
  }
  groups.push(current);
  return groups;
}

export function ChatView({
  server,
  channel,
  messages,
  onSendMessage,
  onThreadsClick,
  onNotificationClick,
  onPinClick,
  onMembersClick,
  onSearchClick,
  onAuthorClick,
  onReactionClick,
  onTogglePin,
  attachmentMenuOpen = false,
  onAttachmentMenuToggle,
  gifPanelOpen = false,
  onGifPanelToggle,
  stickerPanelOpen = false,
  onStickerPanelToggle,
  notificationDropdownOpen = false,
  onCloseNotificationDropdown,
  onCloseInputMenus,
}: ChatViewProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const inputAreaWithMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(notificationRef, () => onCloseNotificationDropdown?.());
  useClickOutside(inputAreaWithMenuRef, () => {
    if (attachmentMenuOpen || gifPanelOpen || stickerPanelOpen) onCloseInputMenus?.();
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!channel) {
    return (
      <div className="main-content">
        <div className="chat-empty">
          <div className="chat-empty-icon">💬</div>
          <h3>Welcome to VisionCord</h3>
          <p>Select a channel or DM to start chatting.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = inputRef.current?.value?.trim();
    if (content) {
      onSendMessage(content);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const content = inputRef.current?.value?.trim();
      if (content) {
        onSendMessage(content);
        if (inputRef.current) inputRef.current.value = '';
      }
    }
  };

  const channelIcon = channel.type === 'text' ? '#' : channel.type === 'voice' ? '🔊' : '📢';

  return (
    <div className="main-content">
      <div className="chat-header">
        <span className="chat-header-icon" aria-hidden>{channelIcon}</span>
        <div className="chat-header-divider" />
        <span className="chat-header-title">{channel.name}</span>
        {channel.topic && (
          <>
            <div className="chat-header-divider" />
            <span className="chat-header-title" style={{ fontWeight: 400, color: 'var(--text-muted)' }}>
              {channel.topic}
            </span>
          </>
        )}
        <div className="chat-header-actions">
          <button type="button" title="Threads" onClick={onThreadsClick}>🧵</button>
          <div className="dropdown-container" style={{ position: 'relative' }} ref={notificationRef}>
            <button type="button" title="Notification Settings" onClick={onNotificationClick}>🔔</button>
            {notificationDropdownOpen && (
              <div className="dropdown-menu" style={{ right: 0, left: 'auto', top: '100%', marginTop: 4 }}>
                <button type="button">All Messages</button>
                <button type="button">Mentions Only</button>
                <button type="button">Nothing</button>
              </div>
            )}
          </div>
          <button type="button" title="Pin Message" onClick={onPinClick}>📌</button>
          <button type="button" title="Members" onClick={onMembersClick}>👥</button>
          <button type="button" title="Search" onClick={onSearchClick}>🔍</button>
        </div>
      </div>

      <div className="messages-container">
        {server && messages.length > 0 && (
          <div className="welcome-banner">
            <div className="welcome-icon">{server.initials || server.name.slice(0, 2)}</div>
            <h2 className="welcome-title">Welcome to #{channel.name}!</h2>
            <p className="welcome-subtitle">This is the start of the #{channel.name} channel.</p>
          </div>
        )}
        {groupMessages(messages).map((group) => (
          <div key={group[0].id} className="message-group">
            {group.map((msg) => (
              <div key={msg.id} className="message">
                <div
                  className="message-avatar"
                  style={msg.author.color ? { backgroundColor: msg.author.color } : undefined}
                >
                  {(msg.author.displayName || msg.author.username).slice(0, 2).toUpperCase()}
                </div>
                <div className="message-body">
                  <div className="message-header">
                    <span
                      className="message-author"
                      role="button"
                      tabIndex={0}
                      onClick={(e) => onAuthorClick?.(msg.author, e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onAuthorClick?.(msg.author);
                        }
                      }}
                    >
                      {(msg.author.displayName || msg.author.username)}
                    </span>
                    <span className="message-timestamp">{formatTime(msg.timestamp)}</span>
                    {onTogglePin && (
                      <button
                        type="button"
                        className="message-actions-btn"
                        title="Pin message"
                        onClick={() => onTogglePin(msg.id)}
                      >
                        📌
                      </button>
                    )}
                  </div>
                  <div className="message-content">{msg.content}</div>
                  <div className="message-reactions">
                    {msg.reactions?.map((r) => (
                      <button
                        key={r.emoji}
                        type="button"
                        className={`message-reaction ${r.me ? 'me' : ''}`}
                        onClick={() => onReactionClick?.(msg.id, r.emoji)}
                      >
                        {r.emoji} {r.count}
                      </button>
                    ))}
                    {onReactionClick && (
                      <button
                        type="button"
                        className="message-reaction message-reaction-add"
                        title="Add reaction"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReactionClick(msg.id, '👍');
                        }}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-area" ref={inputAreaWithMenuRef}>
        {(attachmentMenuOpen || gifPanelOpen || stickerPanelOpen) && (
          <div className="input-menu">
            {attachmentMenuOpen && (
              <>
                <div className="input-menu-title">Upload a file</div>
                <div className="input-menu-options">
                  <button type="button" className="input-menu-option" title="Upload file">
                    📎
                  </button>
                  <button type="button" className="input-menu-option" title="Take a photo">
                    📷
                  </button>
                </div>
              </>
            )}
            {gifPanelOpen && (
              <>
                <div className="input-menu-title">Choose a GIF</div>
                <div className="input-menu-options">
                  {['👍', '🎉', '❤️', '😂', '😢', '🔥'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      className="input-menu-option"
                      onClick={() => {
                        onSendMessage(g);
                        onGifPanelToggle?.();
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </>
            )}
            {stickerPanelOpen && (
              <>
                <div className="input-menu-title">Choose a sticker</div>
                <div className="input-menu-options">
                  {['😀', '😎', '🥳', '🤩', '😇', '🤗'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="input-menu-option"
                      onClick={() => {
                        onSendMessage(s);
                        onStickerPanelToggle?.();
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        <form className="message-input-wrapper" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="message-input"
            placeholder={`Message #${channel.name}`}
            rows={1}
            onKeyDown={handleKeyDown}
            aria-label={`Message #${channel.name}`}
          />
          <div className="input-actions">
            <button
              type="button"
              className={`input-action-btn ${attachmentMenuOpen ? 'active' : ''}`}
              title="Add an attachment"
              onClick={onAttachmentMenuToggle}
            >
              ➕
            </button>
            <button
              type="button"
              className={`input-action-btn ${gifPanelOpen ? 'active' : ''}`}
              title="GIF"
              onClick={onGifPanelToggle}
            >
              🖼️
            </button>
            <button
              type="button"
              className={`input-action-btn ${stickerPanelOpen ? 'active' : ''}`}
              title="Sticker"
              onClick={onStickerPanelToggle}
            >
              😀
            </button>
            <button type="submit" className="input-action-btn" title="Send">➤</button>
          </div>
        </form>
      </div>
    </div>
  );
}
