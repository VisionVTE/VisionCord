import type { Server } from '../types';

interface ServerListProps {
  servers: Server[];
  selectedServerId: string | null;
  onSelectServer: (id: string | null) => void;
  onAddServer: () => void;
}

export function ServerList({ servers, selectedServerId, onSelectServer, onAddServer }: ServerListProps) {
  return (
    <div className="server-list">
      <div className={`server-item ${selectedServerId === null ? 'active' : ''}`}>
        <button
          className="server-icon discord-home"
          title="Home"
          onClick={() => onSelectServer(null)}
          aria-pressed={selectedServerId === null}
        >
          <span aria-hidden>⌂</span>
        </button>
      </div>
      <div className="divider" />
      {servers.map((server) => (
        <div
          key={server.id}
          className={`server-item ${selectedServerId === server.id ? 'active' : ''}`}
        >
          <button
            className="server-icon"
            title={server.name}
            onClick={() => onSelectServer(server.id)}
            aria-pressed={selectedServerId === server.id}
          >
            {server.icon ? (
              <img src={server.icon} alt="" width={48} height={48} style={{ borderRadius: 'inherit' }} />
            ) : (
              (server.initials || server.name.slice(0, 2)).toUpperCase()
            )}
          </button>
        </div>
      ))}
      <button className="add-server" title="Add a Server" aria-label="Add a Server" onClick={onAddServer}>
        +
      </button>
    </div>
  );
}
