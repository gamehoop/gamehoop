export type GamePlatform =
  | 'android'
  | 'ios'
  | 'linux'
  | 'mac'
  | 'playstation'
  | 'switch'
  | 'switch2'
  | 'windows'
  | 'xbox';

export const gamePlatformOptions: Array<{
  value: GamePlatform;
  label: string;
}> = [
  {
    value: 'android',
    label: 'Android',
  },
  {
    value: 'ios',
    label: 'iOS',
  },
  {
    value: 'linux',
    label: 'Linux',
  },
  {
    value: 'mac',
    label: 'macOS',
  },
  {
    value: 'playstation',
    label: 'Playstation',
  },
  {
    value: 'switch',
    label: 'Switch',
  },
  {
    value: 'switch2',
    label: 'Switch 2',
  },
  {
    value: 'windows',
    label: 'Windows',
  },
  {
    value: 'xbox',
    label: 'Xbox',
  },
];

export type GameGenre =
  | 'action'
  | 'adventure'
  | 'casual'
  | 'management'
  | 'mmo'
  | 'other'
  | 'party'
  | 'platformer'
  | 'puzzle'
  | 'role-playing'
  | 'sandbox'
  | 'shooter'
  | 'simulation'
  | 'sports'
  | 'strategy'
  | 'trivia';

export const gameGenreOptions: Array<{ value: GameGenre; label: string }> = [
  {
    value: 'action',
    label: 'Action',
  },
  {
    value: 'adventure',
    label: 'Adventure',
  },
  {
    value: 'casual',
    label: 'Casual',
  },
  {
    value: 'management',
    label: 'Management',
  },
  {
    value: 'mmo',
    label: 'MMO',
  },
  {
    value: 'party',
    label: 'Party',
  },
  {
    value: 'platformer',
    label: 'Platformer',
  },
  {
    value: 'puzzle',
    label: 'Puzzle',
  },
  {
    value: 'role-playing',
    label: 'Role Playing',
  },
  {
    value: 'sandbox',
    label: 'Sandbox',
  },
  {
    value: 'shooter',
    label: 'Shooter',
  },
  {
    value: 'simulation',
    label: 'Simulation',
  },
  {
    value: 'sports',
    label: 'Sports',
  },
  {
    value: 'strategy',
    label: 'Strategy',
  },
  {
    value: 'trivia',
    label: 'Trivia',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

export type GameSDK = 'godot' | 'javascript' | 'unity';

export const gameSdkOptions: Array<{ value: GameSDK; label: string }> = [
  {
    value: 'godot',
    label: 'Godot',
  },
  {
    value: 'javascript',
    label: 'JavaScript',
  },
  {
    value: 'unity',
    label: 'Unity',
  },
];
