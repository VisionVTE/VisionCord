import { useState, useRef } from 'react';
import type { Server } from '../types';
import type { Channel, ChannelCategory } from '../types';
import { UserPanel } from './UserPanel';
import type { User } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';

interface ChannelListProps {
  server: Server | null;
  selectedChannelId: string | null;
  onSelectChannel: (id: string) => void;
  currentUser: User;
  serverDropdownOpen?: boolean;
  onServerDropdownToggle?: () => void;
  onCloseServerDropdown?: () => void;
  mute?: boolean;
  deafen?: boolean;
  onMuteToggle?: () => void;
  onDeafenToggle?: () => void;
  onSettingsClick?: () => void;
}

function ChannelItem({
  channel,
  isActive,
  onClick,
}: {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}) {
  const icon = channel.type === 'text' ? '#' : channel.type === 'voice' ? '🔊' : '📢';
  return (
    <button
      className={`channel-item ${isActive ? 'active' : ''} ${channel.unread ? 'unread' : ''}`}
      onClick={onClick}
    >
      <span className="channel-icon" aria-hidden>{icon}</span>
      <span className="channel-name">{channel.name}</span>
      {channel.mentionCount != null && channel.mentionCount > 0 && (
        <span className="channel-mentions">{channel.mentionCount}</span>
      )}
    </button>
  );
}

export function ChannelList({
  server,
  selectedChannelId,
  onSelectChannel,
  currentUser,
  serverDropdownOpen = false,
  onServerDropdownToggle,
  onCloseServerDropdown,
  mute = false,
  deafen = false,
  onMuteToggle,
  onDeafenToggle,
  onSettingsClick,
}: ChannelListProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => onCloseServerDropdown?.());

  if (!server) {
    return (
      <div className="channel-sidebar">
        <div className="channel-sidebar-header">
          <h2>VisionCord</h2>
          <span className="server-chevron" aria-hidden>▼</span>
        </div>
        <div className="channel-list" />
        <UserPanel
          user={currentUser}
          mute={mute}
          deafen={deafen}
          onMuteToggle={onMuteToggle}
          onDeafenToggle={onDeafenToggle}
          onSettingsClick={onSettingsClick}
        />
      </div>
    );
  }

  const toggleCategory = (id: string) => {
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));
  };

  return (
    <div className="channel-sidebar">
      <div className="channel-sidebar-header" ref={dropdownRef}>
        <h2>{server.name}</h2>
        <button
          type="button"
          className="server-chevron"
          onClick={onServerDropdownToggle}
          aria-expanded={serverDropdownOpen}
          aria-haspopup="menu"
        >
          ▼
        </button>
        {serverDropdownOpen && (
          <div className="dropdown-menu" style={{ left: 0, top: '100%', marginTop: 4 }}>
            <button type="button" onClick={onCloseServerDropdown}>
              Invite People
            </button>
            <button type="button" onClick={onCloseServerDropdown}>
              Server Settings
            </button>
            <button type="button" onClick={onCloseServerDropdown}>
              Create Channel
            </button>
            <div className="dropdown-divider" />
            <button type="button" className="dropdown-danger" onClick={onCloseServerDropdown}>
              Leave Server
            </button>
          </div>
        )}
      </div>
      <div className="channel-list">
        {server.categories.map((category: ChannelCategory) => {
          const isCollapsed = collapsed[category.id];
          return (
            <div key={category.id} className="channel-category">
              <button
                className="category-header"
                onClick={() => toggleCategory(category.id)}
              >
                <span className="category-toggle">{isCollapsed ? '▶' : '▼'}</span>
                {category.name}
              </button>
              {!isCollapsed &&
                category.channels.map((channel) => (
                  <ChannelItem
                    key={channel.id}
                    channel={channel}
                    isActive={selectedChannelId === channel.id}
                    onClick={() => onSelectChannel(channel.id)}
                  />
                ))}
            </div>
          );
        })}
      </div>
      <UserPanel
        user={currentUser}
        mute={mute}
        deafen={deafen}
        onMuteToggle={onMuteToggle}
        onDeafenToggle={onDeafenToggle}
        onSettingsClick={onSettingsClick}
      />
    </div>
  );
}
