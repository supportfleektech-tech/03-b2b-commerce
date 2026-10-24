import { NextRequest } from 'next/server';
import { approve } from '@/server/modules/purchase-orders';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return approve(req, id);
}
