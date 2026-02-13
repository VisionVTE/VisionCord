import { useState } from 'react';
import type { DMChannel, User } from '../types';
import { UserPanel } from './UserPanel';

interface DMListProps {
  dms: DMChannel[];
  selectedDmId: string | null;
  onSelectDm: (id: string) => void;
  currentUserId: string;
  currentUser: User;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onAddFriend?: (username: string) => void;
  addFriendError?: string | null;
  mute?: boolean;
  deafen?: boolean;
  onMuteToggle?: () => void;
  onDeafenToggle?: () => void;
  onSettingsClick?: () => void;
}

function getDisplayName(channel: DMChannel, currentUserId: string) {
  const other = channel.recipients.find((r) => r.id !== currentUserId);
  return other?.displayName || other?.username || 'Unknown';
}

function getAvatarLetter(channel: DMChannel, currentUserId: string) {
  const name = getDisplayName(channel, currentUserId);
  return name.slice(0, 2).toUpperCase();
}

function getStatus(channel: DMChannel, currentUserId: string) {
  const other = channel.recipients.find((r) => r.id !== currentUserId);
  return other?.status || 'offline';
}

export function DMList({
  dms,
  selectedDmId,
  onSelectDm,
  currentUserId,
  currentUser,
  searchQuery = '',
  onSearchChange,
  onAddFriend,
  addFriendError = null,
  mute = false,
  deafen = false,
  onMuteToggle,
  onDeafenToggle,
  onSettingsClick,
}: DMListProps) {
  const [addFriendUsername, setAddFriendUsername] = useState('');

  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFriend?.(addFriendUsername);
    setAddFriendUsername('');
  };

  return (
    <div className="channel-sidebar">
      <div className="dm-list-header">
        <input
          type="text"
          placeholder="Find or start a conversation"
          aria-label="Search DMs"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      {onAddFriend && (
        <div className="dm-add-friend">
          <div className="dm-friends-title">ADD FRIEND</div>
          <form className="dm-add-friend-form" onSubmit={handleAddFriendSubmit}>
            <input
              type="text"
              placeholder="Enter a username"
              value={addFriendUsername}
              onChange={(e) => setAddFriendUsername(e.target.value)}
              className="dm-add-friend-input"
            />
            <button type="submit" className="dm-add-friend-btn">
              Add
            </button>
          </form>
          {addFriendError && <p className="dm-add-friend-error">{addFriendError}</p>}
        </div>
      )}
      <div className="dm-friends-title">DIRECT MESSAGES</div>
      <div className="channel-list">
        {dms.map((dm) => {
          const name = getDisplayName(dm, currentUserId);
          const preview = dm.lastMessage
            ? `${dm.lastMessage.author.id === currentUserId ? 'You' : (dm.lastMessage.author.displayName || dm.lastMessage.author.username)}: ${dm.lastMessage.content.slice(0, 30)}${dm.lastMessage.content.length > 30 ? '...' : ''}`
            : 'No messages yet';
          return (
            <button
              key={dm.id}
              type="button"
              className={`dm-item ${selectedDmId === dm.id ? 'active' : ''} ${dm.unread ? 'unread' : ''}`}
              onClick={() => onSelectDm(dm.id)}
            >
              <div className="dm-item-avatar">
                {getAvatarLetter(dm, currentUserId)}
                <span className={`dm-item-status ${getStatus(dm, currentUserId)}`} aria-hidden />
              </div>
              <div className="dm-item-info">
                <div className="dm-item-name">{name}</div>
                <div className="dm-item-preview">{preview}</div>
              </div>
            </button>
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
