import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { MenuClient } from './MenuClient';

export default async function MenuPage() {
  const menuItems = await prisma.menuItem.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  const categories = ['All', ...Array.from(new Set(menuItems.map((i) => i.category)))];

  return (
    <Suspense>
      <MenuClient menuItems={menuItems} categories={categories} />
    </Suspense>
  );
}
