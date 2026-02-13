import type { User, Server, DMChannel, Message } from '../types';

export const currentUser: User = {
  id: 'me',
  username: 'VisionUser',
  displayName: 'Vision',
  status: 'online',
  color: '#5865F2',
};

export const users: User[] = [
  { id: '1', username: 'AlexRider', displayName: 'Alex', status: 'online', color: '#57F287' },
  { id: '2', username: 'SkyWalker', displayName: 'Sky', status: 'idle', color: '#FEE75C' },
  { id: '3', username: 'NovaStar', displayName: 'Nova', status: 'dnd', color: '#ED4245' },
  { id: '4', username: 'EchoWave', displayName: 'Echo', status: 'online', color: '#5865F2' },
  { id: '5', username: 'LunaMoon', displayName: 'Luna', status: 'offline', color: '#EB459E' },
  { id: '6', username: 'PhoenixRise', displayName: 'Phoenix', status: 'online', color: '#FAA61A' },
];

const makeMessage = (
  id: string,
  content: string,
  author: User,
  hoursAgo: number,
  opts?: Partial<Message>
): Message => ({
  id,
  content,
  author,
  timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
  ...opts,
});

export const servers: Server[] = [
  {
    id: 's1',
    name: 'VisionCord',
    initials: 'VC',
    categories: [
      {
        id: 'c1',
        name: 'TEXT CHANNELS',
        channels: [
          { id: 'ch1', name: 'general', type: 'text', topic: 'General chat', unread: true, mentionCount: 2 },
          { id: 'ch2', name: 'announcements', type: 'announcement' },
          { id: 'ch3', name: 'rules', type: 'text' },
          { id: 'ch4', name: 'introductions', type: 'text' },
        ],
      },
      {
        id: 'c2',
        name: 'VOICE CHANNELS',
        channels: [
          { id: 'ch5', name: 'General Voice', type: 'voice' },
          { id: 'ch6', name: 'Gaming', type: 'voice' },
          { id: 'ch7', name: 'Music', type: 'voice' },
        ],
      },
    ],
    members: [currentUser, users[0], users[1], users[2], users[3], users[5]],
  },
  {
    id: 's2',
    name: 'Gaming Hub',
    initials: 'GH',
    categories: [
      {
        id: 'c3',
        name: 'CHANNELS',
        channels: [
          { id: 'ch8', name: 'general', type: 'text' },
          { id: 'ch9', name: 'valorant', type: 'text' },
          { id: 'ch10', name: 'Voice', type: 'voice' },
        ],
      },
    ],
    members: [currentUser, users[0], users[4], users[5]],
  },
  {
    id: 's3',
    name: 'Dev Squad',
    initials: 'DS',
    categories: [
      {
        id: 'c4',
        name: 'TEXT',
        channels: [
          { id: 'ch11', name: 'general', type: 'text' },
          { id: 'ch12', name: 'code-review', type: 'text' },
        ],
      },
    ],
    members: [currentUser, users[1], users[2]],
  },
];

export const channelMessages: Record<string, Message[]> = {
  ch1: [
    makeMessage('m1', 'Welcome to VisionCord! 🎉', users[0], 5),
    makeMessage('m2', 'Thanks! Excited to be here. This looks just like Discord!', users[1], 4.5),
    makeMessage('m3', 'Yeah the UI is so familiar. Great clone.', currentUser, 4),
    makeMessage('m4', 'Don\'t forget to check out #rules and #announcements', users[0], 3),
    makeMessage('m5', 'Will do!', users[2], 2.5),
    makeMessage('m6', 'Anyone up for some games later?', users[5], 1),
    makeMessage('m7', 'I\'m in! @Vision you joining?', users[1], 0.5, { reactions: [{ emoji: '👍', count: 2, me: true }] }),
  ],
  ch2: [
    makeMessage('m8', '📢 Server is now live! Invite your friends.', users[0], 24),
  ],
  ch3: [
    makeMessage('m9', '1. Be respectful\n2. No spam\n3. Have fun!', users[0], 48),
  ],
  ch8: [
    makeMessage('m10', 'Who\'s playing tonight?', users[4], 2),
  ],
  ch11: [
    makeMessage('m11', 'PR #42 looks good, merging.', users[1], 1),
  ],
};

export const dmChannels: DMChannel[] = [
  {
    id: 'dm1',
    type: 'dm',
    recipients: [users[0]],
    lastMessage: makeMessage('dm1m', 'Hey, you there?', users[0], 0.25),
    unread: true,
  },
  {
    id: 'dm2',
    type: 'dm',
    recipients: [users[1]],
    lastMessage: makeMessage('dm2m', 'See you in voice!', users[1], 2),
  },
  {
    id: 'dm3',
    type: 'dm',
    recipients: [users[4]],
    lastMessage: makeMessage('dm3m', 'Thanks for the help!', currentUser, 24),
  },
];

export const dmMessages: Record<string, Message[]> = {
  dm1: [
    makeMessage('dm1m1', 'Hey!', users[0], 1),
    makeMessage('dm1m2', 'Hi! What\'s up?', currentUser, 0.9),
    makeMessage('dm1m3', 'Just wanted to say VisionCord is awesome', users[0], 0.5),
    makeMessage('dm1m4', 'Hey, you there?', users[0], 0.25),
  ],
  dm2: [
    makeMessage('dm2m1', 'See you in voice!', users[1], 2),
  ],
  dm3: [
    makeMessage('dm3m1', 'Thanks for the help!', currentUser, 24),
  ],
};
