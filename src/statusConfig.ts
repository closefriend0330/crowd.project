import {
  IconAffiliate,
  IconAsset,
  IconBabyCarriage,
  IconBath,
  IconBed,
  IconBook,
  IconBook2,
  IconBrain,
  IconBrandLeetcode,
  IconBrowser,
  IconBrush,
  IconBug,
  IconBuilding,
  IconBuildingCircus,
  IconBuildingLighthouse,
  IconBuildingStore,
  IconBulb,
  IconButterfly,
  IconCalendar,
  IconChevronsUp,
  IconClipboardList,
  IconCode,
  IconCompass,
  IconConfetti,
  IconCup,
  IconDeviceGamepad2,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconDog,
  IconEar,
  IconEdit,
  IconEye,
  IconFireExtinguisher,
  IconFirstAidKit,
  IconFlask,
  IconFrame,
  IconHammer,
  IconHeart,
  IconHearts,
  IconListDetails,
  IconListTree,
  IconLoader,
  IconMail,
  IconMap,
  IconMicrophone,
  IconMoodHappy,
  IconMusic,
  IconNut,
  IconPlane,
  IconPray,
  IconProgress,
  IconQuestionMark,
  IconRocket,
  IconRun,
  IconScale,
  IconSchool,
  IconSearch,
  IconShoppingBag,
  IconSofa,
  IconSoup,
  IconSunrise,
  IconTool,
  IconTrees,
  IconTriangle,
  IconTypography,
  IconUser,
  IconUserSearch,
  IconUsers,
  IconUsersGroup,
  IconVideo,
  IconWashMachine,
  IconZzz,
} from '@tabler/icons-react';

import { UserStatusConfig } from '@/lib/types';

export type TablerIcon = typeof IconBed;

export const userStatusConfig: UserStatusConfig = {
  offline: { color: 'bg-gray-500', nonSelectable: true },
  online: { color: 'bg-green-500', icon: IconUser },
  admin: { color: 'bg-amber-700', icon: IconListDetails },
  analyzing: { color: 'bg-cyan-800', icon: IconSearch },
  awaking: { color: 'bg-amber-500', icon: IconSunrise },
  brainstorming: { color: 'bg-blue-600', icon: IconBulb },
  browsing: { color: 'bg-orange-900', icon: IconBrowser },
  building: { color: 'bg-green-800', icon: IconBuilding },
  busying: { color: 'bg-indigo-400', icon: IconClipboardList },
  chores: { color: 'bg-slate-400', icon: IconWashMachine },
  coding: { color: 'bg-violet-300', icon: IconCode },
  collecting: { color: 'bg-pink-500', icon: IconButterfly },
  curating: { color: 'bg-rose-500', icon: IconUserSearch },
  creating: { color: 'bg-yellow-500', icon: IconTool },
  debugging: { color: 'bg-gray-600', icon: IconBug },
  designing: { color: 'bg-stone-400', icon: IconFrame },
  drinking: { color: 'bg-blue-500', icon: IconCup },
  editing: { color: 'bg-blue-300', icon: IconEdit },
  emailing: { color: 'bg-blue-900', icon: IconMail },
  enjoying: { color: 'bg-emerald-300', icon: IconMoodHappy },
  errands: { color: 'bg-stone-400', icon: IconBuildingStore },
  exercising: { color: 'bg-blue-400', icon: IconRun },
  exploring: { color: 'bg-green-300', icon: IconMap },
  fixing: { color: 'bg-red-800', icon: IconFireExtinguisher },
  filming: { color: 'bg-pink-700', icon: IconVideo },
  focusing: { color: 'bg-pink-400', icon: IconBrain },
  food: { color: 'bg-teal-400', icon: IconSoup },
  gaming: { color: 'bg-purple-400', icon: IconDeviceGamepad2 },
  hobbying: { color: 'bg-emerald-600', icon: IconBrush },
  juggling: { color: 'bg-violet-700', icon: IconBuildingCircus },
  learning: { color: 'bg-lime-600', icon: IconBook2 },
  listening: { color: 'bg-pink-900', icon: IconEar },
  maintaining: { color: 'bg-amber-500', icon: IconHammer },
  managing: { color: 'bg-orange-300', icon: IconTriangle },
  meeting: { color: 'bg-blue-500', icon: IconUsers },
  mentoring: { color: 'bg-purple-600', icon: IconBuildingLighthouse },
  networking: { color: 'bg-indigo-500', icon: IconAffiliate },
  observing: { color: 'bg-lime-700', icon: IconAsset },
  outside: { color: 'bg-green-400', icon: IconTrees },
  optimising: { color: 'bg-lime-800', icon: IconChevronsUp },
  organising: { color: 'bg-red-400', icon: IconListTree },
  parenting: { color: 'bg-sky-900', icon: IconBabyCarriage },
  partner: { color: 'bg-rose-600', icon: IconHearts },
  partying: { color: 'bg-violet-500', icon: IconConfetti },
  performing: { color: 'bg-teal-900', icon: IconMusic },
  pets: { color: 'bg-amber-600', icon: IconDog },
  practicing: { color: 'bg-yellow-400', icon: IconBrandLeetcode },
  primping: { color: 'bg-rose-700', icon: IconBath },
  preparing: { color: 'bg-orange-600', icon: IconLoader },
  planning: { color: 'bg-lime-500', icon: IconCalendar },
  procrastinating: { color: 'bg-cyan-600', icon: IconQuestionMark },
  reading: { color: 'bg-sky-600', icon: IconBook },
  recording: { color: 'bg-fuchsia-700', icon: IconMicrophone },
  relaxing: { color: 'bg-orange-500', icon: IconSofa },
  releasing: { color: 'bg-blue-700', icon: IconRocket },
  researching: { color: 'bg-blue-900', icon: IconCompass },
  resting: { color: 'bg-fuchsia-500', icon: IconZzz },
  reviewing: { color: 'bg-indigo-600', icon: IconScale },
  sciencing: { color: 'bg-purple-900', icon: IconFlask },
  scrolling: { color: 'bg-gray-700', icon: IconDeviceMobile },
  selfcare: { color: 'bg-rose-400', icon: IconHeart },
  shopping: { color: 'bg-teal-700', icon: IconShoppingBag },
  sleeping: { color: 'bg-indigo-400', icon: IconBed },
  socialising: { color: 'bg-fuchsia-400', icon: IconUsersGroup },
  streaming: { color: 'bg-purple-700', icon: IconVideo },
  teaching: { color: 'bg-cyan-400', icon: IconSchool },
  tinkering: { color: 'bg-gray-800', icon: IconNut },
  travelling: { color: 'bg-sky-400', icon: IconPlane },
  trying: { color: 'bg-yellow-600', icon: IconProgress },
  volunteering: { color: 'bg-amber-400', icon: IconFirstAidKit },
  watching: { color: 'bg-indigo-800', icon: IconEye },
  working: { color: 'bg-red-500', icon: IconDeviceLaptop },
  worshipping: { color: 'bg-sky-700', icon: IconPray },
  writing: { color: 'bg-orange-700', icon: IconTypography },
} as const;
export const userStatusOptions = Object.keys(userStatusConfig);
export const userSelectableStatusOptions = userStatusOptions.filter(
  (status) => !userStatusConfig[status as keyof UserStatusConfig].nonSelectable
);
