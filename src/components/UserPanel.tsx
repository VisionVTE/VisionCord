import type { User } from '../types';

interface UserPanelProps {
  user: User;
  mute?: boolean;
  deafen?: boolean;
  onMuteToggle?: () => void;
  onDeafenToggle?: () => void;
  onSettingsClick?: () => void;
}

export function UserPanel({
  user,
  mute = false,
  deafen = false,
  onMuteToggle,
  onDeafenToggle,
  onSettingsClick,
}: UserPanelProps) {
  return (
    <div className="user-panel">
      <div
        className="user-panel-avatar"
        style={user.color ? { backgroundColor: user.color } : undefined}
      >
        {(user.displayName || user.username).slice(0, 2).toUpperCase()}
      </div>
      <div className="user-panel-info">
        <div className="user-panel-username">{user.displayName || user.username}</div>
        <div className="user-panel-status">
          {mute ? 'Muted' : deafen ? 'Deafened' : user.status === 'online' ? 'Online' : user.status === 'idle' ? 'Idle' : user.status === 'dnd' ? 'Do Not Disturb' : 'Offline'}
        </div>
      </div>
      <div className="user-panel-actions">
        <button
          type="button"
          title={mute ? 'Unmute' : 'Mute'}
          className={mute ? 'muted' : ''}
          onClick={onMuteToggle}
        >
          {mute ? '🔇' : '🔊'}
        </button>
        <button
          type="button"
          title={deafen ? 'Undeafen' : 'Deafen'}
          className={deafen ? 'deafened' : ''}
          onClick={onDeafenToggle}
        >
          {deafen ? '🔈' : '🎧'}
        </button>
        <button type="button" title="Settings" onClick={onSettingsClick}>
          ⚙️
        </button>
      </div>
    </div>
  );
}
