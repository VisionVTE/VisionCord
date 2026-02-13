import type { User } from '../types';

interface UserProfilePopoverProps {
  user: User | null;
  onClose: () => void;
}

export function UserProfilePopover({ user, onClose }: UserProfilePopoverProps) {
  if (!user) return null;

  return (
    <div className="user-profile-popover">
      <div className="user-profile-banner" />
      <div className="user-profile-avatar" style={user.color ? { backgroundColor: user.color } : undefined}>
        {(user.displayName || user.username).slice(0, 2).toUpperCase()}
      </div>
      <div className="user-profile-name">{(user.displayName || user.username)}</div>
      <div className="user-profile-username">@{user.username}</div>
      <div className="user-profile-divider" />
      <div className="user-profile-section">
        <div className="user-profile-label">ABOUT ME</div>
        <div className="user-profile-bio">This is a VisionCord user.</div>
      </div>
      <div className="user-profile-actions">
        <button type="button" onClick={onClose}>Message</button>
        <button type="button" onClick={onClose}>Add Friend</button>
      </div>
    </div>
  );
}
