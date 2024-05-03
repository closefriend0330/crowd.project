import {
  IconBed,
  IconBook,
  IconBrain,
  IconBrush,
  IconCalendar,
  IconCode,
  IconConfetti,
  IconDeviceGamepad2,
  IconDeviceLaptop,
  IconFireExtinguisher,
  IconFrame,
  IconHeart,
  IconListDetails,
  IconMoodHappy,
  IconPlane,
  IconPray,
  IconQuestionMark,
  IconRun,
  IconSchool,
  IconShoppingBag,
  IconSofa,
  IconSoup,
  IconTool,
  IconTrees,
  IconTriangle,
  IconUser,
  IconUsers,
  IconUsersGroup,
  IconVideo,
} from '@tabler/icons-react';

import { UserStatusConfig } from '@/lib/types';

export type TablerIcon = typeof IconBed;

export const userStatusConfig: UserStatusConfig = {
  offline: { textColor: 'text-gray-500', backgroundColor: 'bg-gray-500', nonSelectable: true },
  online: { textColor: 'text-green-500', backgroundColor: 'bg-green-500', icon: IconUser },
  admin: { textColor: 'text-amber-700', backgroundColor: 'bg-amber-700', icon: IconListDetails },
  coding: { textColor: 'text-violet-300', backgroundColor: 'bg-violet-300', icon: IconCode },
  creating: { textColor: 'text-yellow-500', backgroundColor: 'bg-yellow-500', icon: IconTool },
  designing: { textColor: 'text-stone-400', backgroundColor: 'bg-stone-400', icon: IconFrame },
  enjoying: {
    textColor: 'text-emerald-300',
    backgroundColor: 'bg-emerald-300',
    icon: IconMoodHappy,
  },
  exercising: { textColor: 'text-blue-400', backgroundColor: 'bg-blue-400', icon: IconRun },
  fixing: { textColor: 'text-red-800', backgroundColor: 'bg-red-800', icon: IconFireExtinguisher },
  focusing: { textColor: 'text-pink-400', backgroundColor: 'bg-pink-400', icon: IconBrain },
  food: { textColor: 'text-teal-400', backgroundColor: 'bg-teal-400', icon: IconSoup },
  gaming: {
    textColor: 'text-purple-400',
    backgroundColor: 'bg-purple-400',
    icon: IconDeviceGamepad2,
  },
  hobbying: { textColor: 'text-emerald-600', backgroundColor: 'bg-emerald-600', icon: IconBrush },
  learning: { textColor: 'text-lime-600', backgroundColor: 'bg-lime-600', icon: IconBook },
  managing: { textColor: 'text-orange-300', backgroundColor: 'bg-orange-300', icon: IconTriangle },
  meeting: { textColor: 'text-blue-500', backgroundColor: 'bg-blue-500', icon: IconUsers },
  outside: { textColor: 'text-green-400', backgroundColor: 'bg-green-400', icon: IconTrees },
  partying: { textColor: 'text-violet-500', backgroundColor: 'bg-violet-500', icon: IconConfetti },
  planning: { textColor: 'text-lime-500', backgroundColor: 'bg-lime-500', icon: IconCalendar },
  procrastinating: {
    textColor: 'text-cyan-600',
    backgroundColor: 'bg-cyan-600',
    icon: IconQuestionMark,
  },
  relaxing: { textColor: 'text-orange-500', backgroundColor: 'bg-orange-500', icon: IconSofa },
  selfcare: { textColor: 'text-rose-400', backgroundColor: 'bg-rose-400', icon: IconHeart },
  shopping: { textColor: 'text-teal-700', backgroundColor: 'bg-teal-700', icon: IconShoppingBag },
  sleeping: { textColor: 'text-indigo-400', backgroundColor: 'bg-indigo-400', icon: IconBed },
  socialising: {
    textColor: 'text-fuchsia-400',
    backgroundColor: 'bg-fuchsia-400',
    icon: IconUsersGroup,
  },
  streaming: { textColor: 'text-purple-700', backgroundColor: 'bg-purple-700', icon: IconVideo },
  teaching: { textColor: 'text-cyan-400', backgroundColor: 'bg-cyan-400', icon: IconSchool },
  travelling: { textColor: 'text-sky-400', backgroundColor: 'bg-sky-400', icon: IconPlane },
  working: { textColor: 'text-red-500', backgroundColor: 'bg-red-500', icon: IconDeviceLaptop },
  worshipping: { textColor: 'text-sky-700', backgroundColor: 'bg-sky-700', icon: IconPray },
};
export const userStatusOptions = Object.keys(userStatusConfig);
export const userSelectableStatusOptions = userStatusOptions.filter(
  (status) => !userStatusConfig[status as keyof UserStatusConfig].nonSelectable
);
