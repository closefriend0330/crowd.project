export const DEFAULT_SITENAME = 'Coworking Party';
export const SITE_STRAPLINE = 'Have fun getting stuff done';

// time a browser tab must be inactive before the user is considered away
export const AWAY_TIME_THRESHOLD =
  parseInt(process.env.NEXT_PUBLIC_AWAY_TIME_THRESHOLD || '') || 15 * 60 * 1000;
// time after which the status/update is reset on reconnect
export const STATUS_RESET_THRESHOLD =
  parseInt(process.env.STATUS_RESET_THRESHOLD || '') | (8 * 60 * 60 * 1000);

export const CONFETTI_DELAY_MIN = 300;
export const CONFETTI_DELAY_MAX = 1200;
export const CONFETTI_RESET_DELAY = 2000;

// new logo in the header every 5 minutes
export const RANDOM_LOGO_INTERVAL = 5 * 60 * 1000;

// length of the status update 'update' field
export const MAX_UPDATE_LENGTH = parseInt(process.env.NEXT_PUBLIC_MAX_UPDATE_LENGTH || '') || 200;

// length of individual todo item 'title' text
export const MAX_TODO_ITEM_LENGTH =
  parseInt(process.env.NEXT_PUBLIC_MAX_TODO_ITEM_LENGTH || '') || 120;
// don't let users load up their task list with too many items
export const TODO_LIST_WARNING_THRESHOLD =
  parseInt(process.env.NEXT_PUBLIC_TODO_LIST_WARNING_THRESHOLD || '') || 7;
export const MAX_OPEN_TODO_LIST_ITEMS =
  parseInt(process.env.NEXT_PUBLIC_MAX_OPEN_TODO_LIST_ITEMS || '') || 12;

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
