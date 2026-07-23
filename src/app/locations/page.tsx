import { prisma } from '@/lib/prisma';
import { LocationsClient } from './LocationsClient';

export default async function LocationsPage() {
  const stores = await prisma.store.findMany({
    orderBy: [{ city: 'asc' }, { name: 'asc' }],
  });

  const cities = ['All', ...Array.from(new Set(stores.map((s) => s.city)))];

  return <LocationsClient stores={stores} cities={cities} />;
}
