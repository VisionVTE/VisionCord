import { useState, useMemo, useCallback } from 'react';
import './App.css';
import { HomePage } from './components/HomePage';
import { LoginModal } from './components/LoginModal';
import { SignUpModal } from './components/SignUpModal';
import { ServerList } from './components/ServerList';
import { ChannelList } from './components/ChannelList';
import { DMList } from './components/DMList';
import { ChatView } from './components/ChatView';
import { MemberList } from './components/MemberList';
import { AddServerModal } from './components/AddServerModal';
import { SettingsModal } from './components/SettingsModal';
import { UserProfilePopover } from './components/UserProfilePopover';
import { getStoredUser, setStoredUser, clearStoredUser, findUserByUsername, getStoredAccounts } from './lib/auth';
import {
  servers as initialServers,
  dmChannels as initialDmChannels,
  channelMessages as initialChannelMessages,
  dmMessages,
  users,
  currentUser as demoUser,
} from './data/mockData';
import type { Message, Channel, Server, User, DMChannel } from './types';

function createNewServer(name: string, currentUser: User): Server {
  const id = `s-${Date.now()}`;
  const chId = `ch-${Date.now()}`;
  return {
    id,
    name,
    initials: name.slice(0, 2).toUpperCase(),
    categories: [
      {
        id: `c-${id}`,
        name: 'TEXT CHANNELS',
        channels: [{ id: chId, name: 'general', type: 'text' }],
      },
    ],
    members: [currentUser],
  };
}

export default function App() {
  const [authUser, setAuthUser] = useState<User | null>(() => getStoredUser());
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  const [serverList, setServerList] = useState<Server[]>(() =>
    getStoredUser()?.id === 'me' ? [...initialServers] : []
  );
  const [dmChannelsState, setDmChannelsState] = useState<DMChannel[]>(() =>
    getStoredUser()?.id === 'me' ? [...initialDmChannels] : []
  );
  const [baseChannelMessages, setBaseChannelMessages] = useState<Record<string, Message[]>>(
    () => (getStoredUser()?.id === 'me' ? { ...initialChannelMessages } : {})
  );
  const [selectedServerId, setSelectedServerId] = useState<string | null>(() =>
    getStoredUser()?.id === 'me' ? 's1' : null
  );
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(() =>
    getStoredUser()?.id === 'me' ? 'ch1' : null
  );
  const [selectedDmId, setSelectedDmId] = useState<string | null>(null);
  const [addFriendError, setAddFriendError] = useState<string | null>(null);
  const [userSentChannelMessages, setUserSentChannelMessages] = useState<Record<string, Message[]>>({});
  const [userSentDmMessages, setUserSentDmMessages] = useState<Record<string, Message[]>>({});
  const [pinnedMessageIds, setPinnedMessageIds] = useState<Record<string, string[]>>({});
  const [reactionOverrides, setReactionOverrides] = useState<Record<string, Message['reactions']>>({});
  const [panel, setPanel] = useState<'threads' | 'pinned' | 'search' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfileUserId, setUserProfileUserId] = useState<string | null>(null);
  const [userProfileAnchor, setUserProfileAnchor] = useState<{ x: number; y: number } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addServerOpen, setAddServerOpen] = useState(false);
  const [mute, setMute] = useState(false);
  const [deafen, setDeafen] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [dmSearchQuery, setDmSearchQuery] = useState('');
  const [serverDropdownId, setServerDropdownId] = useState<string | null>(null);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [gifPanelOpen, setGifPanelOpen] = useState(false);
  const [stickerPanelOpen, setStickerPanelOpen] = useState(false);

  const selectedServer = useMemo(
    () => serverList.find((s) => s.id === selectedServerId) ?? null,
    [serverList, selectedServerId]
  );

  const selectedChannel = useMemo(() => {
    if (!selectedServer) return null;
    for (const cat of selectedServer.categories) {
      const ch = cat.channels.find((c) => c.id === selectedChannelId);
      if (ch) return ch;
    }
    return null;
  }, [selectedServer, selectedChannelId]);

  const selectedDm = useMemo(
    () => dmChannelsState.find((d) => d.id === selectedDmId) ?? null,
    [dmChannelsState, selectedDmId]
  );

  const currentUser = authUser;
  const isDmView = selectedServerId === null;
  const displayChannel: Channel | null =
    currentUser && isDmView && selectedDm
      ? {
          id: selectedDm.id,
          name:
            selectedDm.recipients.find((r) => r.id !== currentUser.id)?.displayName ||
            selectedDm.recipients.find((r) => r.id !== currentUser.id)?.username ||
            'DM',
          type: 'text',
        }
      : selectedChannel;

  const messagesForCurrent = useMemo((): Message[] => {
    if (isDmView && selectedDmId) {
      const base = dmMessages[selectedDmId] ?? [];
      const sent = userSentDmMessages[selectedDmId] ?? [];
      return [...base, ...sent].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    }
    if (selectedChannelId) {
      const base = baseChannelMessages[selectedChannelId] ?? [];
      const sent = userSentChannelMessages[selectedChannelId] ?? [];
      return [...base, ...sent];
    }
    return [];
  }, [
    isDmView,
    selectedDmId,
    selectedChannelId,
    baseChannelMessages,
    userSentChannelMessages,
    userSentDmMessages,
  ]);

  const messagesWithReactions = useMemo(() => {
    return messagesForCurrent.map((msg) => ({
      ...msg,
      reactions: reactionOverrides[msg.id] ?? msg.reactions ?? [],
    }));
  }, [messagesForCurrent, reactionOverrides]);

  const pinnedForChannel = useMemo(() => {
    if (!displayChannel) return [];
    const ids = pinnedMessageIds[displayChannel.id] ?? [];
    return messagesForCurrent.filter((m) => ids.includes(m.id));
  }, [displayChannel, pinnedMessageIds, messagesForCurrent]);

  const filteredMembers = useMemo(() => {
    let members = isDmView && selectedDm ? selectedDm.recipients : selectedServer?.members ?? [];
    if (currentUser) {
      members = members.map((m) => (m.id === 'me' ? currentUser : m));
    }
    if (!memberSearchQuery.trim()) return members;
    const q = memberSearchQuery.toLowerCase();
    return members.filter(
      (m) =>
        (m.displayName ?? m.username).toLowerCase().includes(q) ||
        m.username.toLowerCase().includes(q)
    );
  }, [isDmView, selectedDm, selectedServer, memberSearchQuery, currentUser]);

  const filteredDms = useMemo(() => {
    if (!dmSearchQuery.trim()) return dmChannelsState;
    const q = dmSearchQuery.toLowerCase();
    return dmChannelsState.filter((dm) => {
      const other = dm.recipients.find((r) => r.id !== (currentUser?.id ?? 'me'));
      const name = (other?.displayName ?? other?.username ?? '').toLowerCase();
      return name.includes(q) || (other?.username ?? '').toLowerCase().includes(q);
    });
  }, [dmSearchQuery, dmChannelsState, currentUser?.id]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return messagesForCurrent.filter((m) =>
      m.content.toLowerCase().includes(q)
    );
  }, [searchQuery, messagesForCurrent]);

  const userById = useCallback((id: string): User | null => {
    if (currentUser && id === currentUser.id) return currentUser;
    const u = users.find((x) => x.id === id);
    if (u) return u;
    for (const dm of dmChannelsState) {
      const r = dm.recipients.find((x) => x.id === id);
      if (r) return r;
    }
    const accounts = Object.values(getStoredAccounts());
    const found = accounts.find((x) => x.id === id);
    if (found) return found;
    return null;
  }, [currentUser, dmChannelsState]);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!currentUser) return;
      const newMsg: Message = {
        id: `new-${Date.now()}`,
        content,
        author: currentUser,
        timestamp: new Date(),
      };
      if (isDmView && selectedDmId) {
        setUserSentDmMessages((prev) => ({
          ...prev,
          [selectedDmId]: [...(prev[selectedDmId] ?? []), newMsg],
        }));
        setDmChannelsState((prev) =>
          prev.map((dm) =>
            dm.id === selectedDmId ? { ...dm, lastMessage: newMsg } : dm
          )
        );
      } else if (selectedChannelId) {
        setUserSentChannelMessages((prev) => ({
          ...prev,
          [selectedChannelId]: [...(prev[selectedChannelId] ?? []), newMsg],
        }));
      }
    },
    [isDmView, selectedDmId, selectedChannelId, currentUser]
  );

  const handleToggleReaction = useCallback((messageId: string, emoji: string) => {
    setReactionOverrides((prev) => {
      const current = prev[messageId] ?? [];
      const existing = current.find((r) => r.emoji === emoji);
      let next: Message['reactions'];
      if (existing) {
        const me = !existing.me;
        const count = me ? existing.count + 1 : existing.count - 1;
        if (count <= 0) next = current.filter((r) => r.emoji !== emoji);
        else next = current.map((r) => (r.emoji === emoji ? { ...r, count, me } : r));
      } else {
        next = [...current, { emoji, count: 1, me: true }];
      }
      if (next.length === 0) {
        const { [messageId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [messageId]: next };
    });
  }, []);

  const handleTogglePin = useCallback((messageId: string) => {
    if (!displayChannel) return;
    setPinnedMessageIds((prev) => {
      const ids = prev[displayChannel.id] ?? [];
      const has = ids.includes(messageId);
      return {
        ...prev,
        [displayChannel.id]: has ? ids.filter((id) => id !== messageId) : [...ids, messageId],
      };
    });
  }, [displayChannel]);

  const handleAddServer = useCallback((name: string) => {
    if (!authUser) return;
    const server = createNewServer(name, authUser);
    const chId = server.categories[0].channels[0].id;
    setServerList((prev) => [...prev, server]);
    setBaseChannelMessages((prev) => ({ ...prev, [chId]: [] }));
    setSelectedServerId(server.id);
    setSelectedChannelId(chId);
    setSelectedDmId(null);
  }, [authUser]);

  const handleTryDemo = useCallback(() => {
    setStoredUser(demoUser);
    setAuthUser(demoUser);
    setServerList([...initialServers]);
    setDmChannelsState([...initialDmChannels]);
    setBaseChannelMessages({ ...initialChannelMessages });
    setSelectedServerId('s1');
    setSelectedChannelId('ch1');
    setSelectedDmId(null);
    setLoginOpen(false);
    setSignUpOpen(false);
  }, []);

  const handleAddFriend = useCallback(
    (username: string) => {
      setAddFriendError(null);
      if (!authUser) return;
      const trimmed = username.trim();
      if (!trimmed) {
        setAddFriendError('Enter a username.');
        return;
      }
      const found = findUserByUsername(trimmed);
      if (!found) {
        setAddFriendError('No user found with that username. They need to sign up first.');
        return;
      }
      if (found.id === authUser.id) {
        setAddFriendError("You can't message yourself.");
        return;
      }
      const existing = dmChannelsState.find((dm) =>
        dm.recipients.some((r) => r.id === found.id)
      );
      if (existing) {
        setSelectedServerId(null);
        setSelectedDmId(existing.id);
        return;
      }
      const newDm: DMChannel = {
        id: `dm-${Date.now()}`,
        type: 'dm',
        recipients: [authUser, found],
      };
      setDmChannelsState((prev) => [...prev, newDm]);
      setSelectedServerId(null);
      setSelectedDmId(newDm.id);
    },
    [authUser, dmChannelsState]
  );

  const displayServer: Server | null = isDmView ? null : selectedServer;

  if (!authUser) {
    return (
      <>
        <HomePage
          onOpenLogin={() => setLoginOpen(true)}
          onOpenSignUp={() => setSignUpOpen(true)}
          onTryDemo={handleTryDemo}
        />
        <LoginModal
          isOpen={loginOpen}
          onClose={() => setLoginOpen(false)}
          onSuccess={(user) => {
            setStoredUser(user);
            setAuthUser(user);
            setLoginOpen(false);
          }}
        />
        <SignUpModal
          isOpen={signUpOpen}
          onClose={() => setSignUpOpen(false)}
          onSuccess={(user) => {
            setAuthUser(user);
            setSignUpOpen(false);
          }}
        />
      </>
    );
  }

  return (
    <div className="app">
      <ServerList
        servers={serverList}
        selectedServerId={selectedServerId}
        onSelectServer={(id) => {
          setSelectedServerId(id);
          setServerDropdownId(null);
          if (id === null) {
            setSelectedChannelId(null);
          } else {
            const server = serverList.find((s) => s.id === id);
            const firstText = server?.categories
              .flatMap((c) => c.channels)
              .find((ch) => ch.type === 'text');
            setSelectedChannelId(firstText?.id ?? null);
            setSelectedDmId(null);
          }
        }}
        onAddServer={() => setAddServerOpen(true)}
      />

      {isDmView ? (
        <DMList
          dms={filteredDms}
          selectedDmId={selectedDmId}
          onSelectDm={setSelectedDmId}
          currentUserId={authUser.id}
          currentUser={authUser}
          searchQuery={dmSearchQuery}
          onSearchChange={setDmSearchQuery}
          onAddFriend={handleAddFriend}
          addFriendError={addFriendError}
          mute={mute}
          deafen={deafen}
          onMuteToggle={() => setMute((m) => !m)}
          onDeafenToggle={() => setDeafen((d) => !d)}
          onSettingsClick={() => setSettingsOpen(true)}
        />
      ) : (
        <ChannelList
          server={selectedServer}
          selectedChannelId={selectedChannelId}
          onSelectChannel={setSelectedChannelId}
          currentUser={authUser}
          serverDropdownOpen={serverDropdownId === selectedServerId}
          onServerDropdownToggle={() =>
            setServerDropdownId((id) => (id === selectedServerId ? null : selectedServerId ?? null))
          }
          onCloseServerDropdown={() => setServerDropdownId(null)}
          mute={mute}
          deafen={deafen}
          onMuteToggle={() => setMute((m) => !m)}
          onDeafenToggle={() => setDeafen((d) => !d)}
          onSettingsClick={() => setSettingsOpen(true)}
        />
      )}

      <ChatView
        server={displayServer}
        channel={displayChannel}
        messages={messagesWithReactions}
        onSendMessage={handleSendMessage}
        onThreadsClick={() => setPanel((p) => (p === 'threads' ? null : 'threads'))}
        notificationDropdownOpen={notificationDropdownOpen}
        onNotificationClick={() => setNotificationDropdownOpen((o) => !o)}
        onCloseNotificationDropdown={() => setNotificationDropdownOpen(false)}
        onPinClick={() => setPanel((p) => (p === 'pinned' ? null : 'pinned'))}
        onMembersClick={() => {}}
        onSearchClick={() => setPanel((p) => (p === 'search' ? null : 'search'))}
        onAuthorClick={(user, event) => {
          setUserProfileUserId(user.id);
          const target = event?.currentTarget as HTMLElement;
          if (target) {
            const rect = target.getBoundingClientRect();
            setUserProfileAnchor({ x: rect.left, y: rect.bottom + 4 });
          }
        }}
        onReactionClick={handleToggleReaction}
        onTogglePin={handleTogglePin}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchResults={searchResults}
        attachmentMenuOpen={attachmentMenuOpen}
        onAttachmentMenuToggle={() => {
          setAttachmentMenuOpen((o) => !o);
          setGifPanelOpen(false);
          setStickerPanelOpen(false);
        }}
        gifPanelOpen={gifPanelOpen}
        onGifPanelToggle={() => {
          setGifPanelOpen((o) => !o);
          setAttachmentMenuOpen(false);
          setStickerPanelOpen(false);
        }}
        stickerPanelOpen={stickerPanelOpen}
        onStickerPanelToggle={() => {
          setStickerPanelOpen((o) => !o);
          setAttachmentMenuOpen(false);
          setGifPanelOpen(false);
        }}
        onCloseInputMenus={() => {
          setAttachmentMenuOpen(false);
          setGifPanelOpen(false);
          setStickerPanelOpen(false);
        }}
      />

      {!isDmView && (
        <MemberList
          members={filteredMembers}
          searchQuery={memberSearchQuery}
          onSearchChange={setMemberSearchQuery}
          onMemberClick={(user) => {
            setUserProfileUserId(user.id);
            setUserProfileAnchor({ x: window.innerWidth - 340, y: 80 });
          }}
        />
      )}

      {panel && (
        <div className="side-panel">
          <div className="side-panel-header">
            <h3>
              {panel === 'threads' && 'Threads'}
              {panel === 'pinned' && 'Pinned Messages'}
              {panel === 'search' && 'Search'}
            </h3>
            <button
              type="button"
              className="side-panel-close"
              onClick={() => setPanel(null)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="side-panel-body">
            {panel === 'threads' && (
              <p className="side-panel-empty">No threads in this channel yet.</p>
            )}
            {panel === 'pinned' && (
              <>
                {pinnedForChannel.length === 0 ? (
                  <p className="side-panel-empty">No pinned messages.</p>
                ) : (
                  pinnedForChannel.map((m) => (
                    <div key={m.id} className="message" style={{ marginBottom: 16 }}>
                      <div className="message-body">
                        <div className="message-header">
                          <span className="message-author">
                            {(m.author.displayName || m.author.username)}
                          </span>
                          <span className="message-timestamp">
                            {m.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <div className="message-content">{m.content}</div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
            {panel === 'search' && (
              <>
                <input
                  type="text"
                  placeholder="Search in this channel"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="modal-field"
                  style={{ marginBottom: 12 }}
                />
                {searchResults.length === 0 ? (
                  <p className="side-panel-empty">
                    {searchQuery.trim() ? 'No messages found.' : 'Enter a search term.'}
                  </p>
                ) : (
                  searchResults.map((m) => (
                    <div key={m.id} className="message" style={{ marginBottom: 16 }}>
                      <div className="message-body">
                        <div className="message-header">
                          <span className="message-author">
                            {(m.author.displayName || m.author.username)}
                          </span>
                          <span className="message-timestamp">
                            {m.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <div className="message-content">{m.content}</div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}

      {userProfileUserId && userProfileAnchor && (
        <div
          style={{
            position: 'fixed',
            left: Math.min(userProfileAnchor.x, window.innerWidth - 340),
            top: userProfileAnchor.y,
            zIndex: 200,
          }}
        >
          <UserProfilePopover
            user={userById(userProfileUserId)}
            onClose={() => {
              setUserProfileUserId(null);
              setUserProfileAnchor(null);
            }}
          />
        </div>
      )}

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onLogout={() => {
          clearStoredUser();
          setAuthUser(null);
          setSettingsOpen(false);
        }}
      />
      <AddServerModal
        isOpen={addServerOpen}
        onClose={() => setAddServerOpen(false)}
        onAdd={handleAddServer}
      />
    </div>
  );
}
