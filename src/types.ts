export interface User {
  id: string;
  username: string;
  displayName?: string;
  email?: string;
  avatar?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  color?: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement' | 'stage';
  topic?: string;
  unread?: boolean;
  mentionCount?: number;
}

export interface ChannelCategory {
  id: string;
  name: string;
  collapsed?: boolean;
  channels: Channel[];
}

export interface Server {
  id: string;
  name: string;
  icon?: string;
  initials?: string;
  categories: ChannelCategory[];
  members: User[];
}

export interface Message {
  id: string;
  content: string;
  author: User;
  timestamp: Date;
  edited?: boolean;
  attachments?: { id: string; name: string; url: string }[];
  reactions?: { emoji: string; count: number; me: boolean }[];
  replyTo?: Message;
}

export interface DMChannel {
  id: string;
  type: 'dm' | 'group';
  name?: string;
  recipients: User[];
  lastMessage?: Message;
  unread?: boolean;
}
