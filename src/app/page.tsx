import { prisma } from '@/lib/prisma';
import { HomeClient } from './HomeClient';

export default async function HomePage() {
  const featuredItems = await prisma.menuItem.findMany({
    where: { isFeatured: true },
    take: 6,
    orderBy: { createdAt: 'asc' },
  });

  return <HomeClient featuredItems={featuredItems} />;
}
