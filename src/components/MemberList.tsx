import type { User } from '../types';

interface MemberListProps {
  members: User[];
  title?: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onMemberClick?: (user: User) => void;
}

export function MemberList({
  members,
  title = 'ONLINE',
  searchQuery = '',
  onSearchChange,
  onMemberClick,
}: MemberListProps) {
  return (
    <div className="member-list">
      <div className="member-list-header">
        <input
          type="text"
          placeholder="Search"
          aria-label="Search members"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      <div className="member-section-title">{title} — {members.length}</div>
      {members.map((member) => (
        <div
          key={member.id}
          className="member-row"
          role="button"
          tabIndex={0}
          onClick={() => onMemberClick?.(member)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onMemberClick?.(member);
          }}
        >
          <div className="member-avatar-wrap">
            <div
              className="member-avatar"
              style={member.color ? { backgroundColor: member.color } : undefined}
            >
              {(member.displayName || member.username).slice(0, 2).toUpperCase()}
            </div>
            <span className={`member-status ${member.status}`} aria-hidden />
          </div>
          <span className="member-name">{member.displayName || member.username}</span>
        </div>
      ))}
    </div>
  );
}
