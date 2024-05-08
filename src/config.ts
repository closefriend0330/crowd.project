export const DEFAULT_SITENAME = 'Coworking Party';
export const SITE_STRAPLINE = 'Have fun getting stuff done';

// new logo in the header every 5 minutes
export const RANDOM_LOGO_INTERVAL = 5 * 60 * 1000;
// reconnect within 2 minutes to keep the session alive
export const SESSION_RECONNECT_GRACE_PERIOD = 2 * 60 * 1000;

export const MAX_TAGLINE_LENGTH = 200;

export const CONFETTI_DELAY_MIN = 300;
export const CONFETTI_DELAY_MAX = 1200;

// time a browser tab must be inactive before the user is considered away
export const AWAY_TIME_THRESHOLD = 15 * 60 * 1000;

// used to announce new users in the Discord
export const newUserAdjectives = [
  'awesome',
  'amazing',
  'fantastic',
  'very cool',
  'super interesting',
  'magical',
  'wonderful',
  'incredible',
  'terrific',
  'outstanding',
  'impressive',
  'marvelous',
  'extraordinary',
  'remarkable',
  'exceptional',
  'phenomenal',
  'splendid',
  'spectacular',
] as const;
