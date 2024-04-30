'use client';

import {
  IconBalloon,
  IconCake,
  IconChartLine,
  IconChartPie,
  IconCheese,
  IconCode,
  IconConfetti,
  IconDeviceImac,
  IconFileCheck,
  IconFileSpreadsheet,
  IconGlassFull,
  IconIceCream2,
  IconKeyboard,
  IconPizza,
  IconPuzzle,
  IconRollerSkating,
  IconShredder,
} from '@tabler/icons-react';
import { motion, useAnimation } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import { RANDOM_LOGO_INTERVAL } from '@/config';

const icons = [
  IconCake,
  IconPizza,
  IconConfetti,
  IconCheese,
  IconPuzzle,
  IconBalloon,
  IconGlassFull,
  IconIceCream2,
  IconFileCheck,
  IconChartLine,
  IconFileSpreadsheet,
  IconDeviceImac,
  IconShredder,
  IconKeyboard,
  IconChartPie,
  IconCode,
  IconRollerSkating,
] as const;

type TablerIcon = (typeof icons)[0];

const randomIcon = (currentIcon?: TablerIcon) => {
  let icon;

  do {
    icon = icons[Math.floor(Math.random() * icons.length)];
  } while (icon === currentIcon);

  return icon;
};

export default function Logo() {
  const [Icon, setIcon] = useState<TablerIcon>(randomIcon());
  const controls = useAnimation();

  const animate = useCallback(() => {
    controls.start({
      y: [0, -20, 0, -15, 0, -5, 0],
    });
  }, [controls]);

  const updateLogo = useCallback(() => {
    setIcon((prev: TablerIcon) => randomIcon(prev));

    animate();
  }, [animate]);

  useEffect(() => {
    animate();

    const interval = setInterval(updateLogo, RANDOM_LOGO_INTERVAL);

    return () => clearInterval(interval);
  }, [animate, updateLogo]);

  return (
    <motion.div
      animate={controls}
      transition={{ duration: 2.0, ease: 'easeOut' }} // Define the duration and repeat the animation infinitely
      onClick={updateLogo}
    >
      <Icon strokeWidth={1} className='size-6 sm:size-10 select-none' />
    </motion.div>
  );
}
